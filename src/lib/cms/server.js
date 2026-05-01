import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { CMS_CONTENT_TYPES, DEFAULT_CONTENT_ITEMS, DEFAULT_SITE_SECTIONS, DEFAULT_SITE_SETTINGS, deepMerge } from "./defaults";
import { SUPABASE_ENV } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const TABLES = {
  settings: "site_settings",
  sections: "site_sections",
  content: "content_items",
};

let didTrySeeding = false;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

function toSlug(input = "") {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function withDefaultsForType(type, rows = []) {
  const defaults = clone(DEFAULT_CONTENT_ITEMS[type] || []);
  if (!rows.length) {
    return defaults.map((item, index) => ({
      id: `default-${type}-${index + 1}`,
      type,
      ...item,
    }));
  }

  return rows.map((row) => ({
    id: row.id,
    type,
    title: row.title || "",
    slug: row.slug || toSlug(row.title || ""),
    excerpt: row.excerpt || "",
    payload: row.payload || {},
    cover_image_url: row.cover_image_url || "",
    tags: safeArray(row.tags),
    published: row.published ?? true,
    featured: row.featured ?? false,
    display_order: row.display_order ?? 0,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
  }));
}

function hasCmsEnv() {
  return SUPABASE_ENV.hasPublicEnv;
}

function hasSeederEnv() {
  return SUPABASE_ENV.hasServiceRoleEnv;
}

function getServerClient({ useServiceRole = false } = {}) {
  return createSupabaseServerClient({ useServiceRole });
}

function getReadClient() {
  return getServerClient({ useServiceRole: hasSeederEnv() });
}

async function trySeedDefaults() {
  if (didTrySeeding || !hasSeederEnv()) {
    return;
  }
  didTrySeeding = true;

  const supabase = getServerClient({ useServiceRole: true });
  if (!supabase) {
    return;
  }

  try {
    const { data: settingsRow } = await supabase
      .from(TABLES.settings)
      .select("id")
      .eq("key", "global")
      .maybeSingle();

    if (!settingsRow) {
      await supabase.from(TABLES.settings).upsert(
        {
          key: "global",
          data: clone(DEFAULT_SITE_SETTINGS),
        },
        { onConflict: "key" }
      );
    }

    const { data: sectionRows } = await supabase.from(TABLES.sections).select("key");
    const existingSectionKeys = new Set((sectionRows || []).map((row) => row.key));
    const sectionInserts = Object.entries(DEFAULT_SITE_SECTIONS)
      .filter(([key]) => !existingSectionKeys.has(key))
      .map(([key, data]) => ({ key, data }));

    if (sectionInserts.length) {
      await supabase.from(TABLES.sections).insert(sectionInserts);
    }

    const { count } = await supabase
      .from(TABLES.content)
      .select("*", { count: "exact", head: true });

    if ((count || 0) === 0) {
      const items = [];
      CMS_CONTENT_TYPES.forEach((type) => {
        const defaults = DEFAULT_CONTENT_ITEMS[type] || [];
        defaults.forEach((item) => {
          items.push({
            type,
            title: item.title,
            slug: item.slug || toSlug(item.title),
            excerpt: item.excerpt || "",
            payload: item.payload || {},
            cover_image_url: item.cover_image_url || "",
            tags: safeArray(item.tags),
            published: item.published ?? true,
            featured: item.featured ?? false,
            display_order: item.display_order ?? 0,
          });
        });
      });

      if (items.length) {
        await supabase.from(TABLES.content).insert(items);
      }
    }
  } catch {
    // No-op. Local fallback content remains active.
  }
}

const getCachedSiteSettings = unstable_cache(
  async () => {
    if (!hasCmsEnv()) {
      return clone(DEFAULT_SITE_SETTINGS);
    }

    await trySeedDefaults();
    const supabase = getReadClient();
    if (!supabase) {
      return clone(DEFAULT_SITE_SETTINGS);
    }

    const { data } = await supabase
      .from(TABLES.settings)
      .select("data")
      .eq("key", "global")
      .maybeSingle();

    return deepMerge(clone(DEFAULT_SITE_SETTINGS), data?.data || {});
  },
  ["site-settings"],
  { tags: ["cms-settings", "site-data"] }
);

export async function getSiteSettings() {
  return getCachedSiteSettings();
}

export async function saveSiteSettings(nextSettings) {
  const supabase = getServerClient({ useServiceRole: hasSeederEnv() });
  if (!supabase) {
    return { ok: false, error: "Supabase environment variables are missing." };
  }

  const merged = deepMerge(clone(DEFAULT_SITE_SETTINGS), nextSettings || {});
  const { error } = await supabase.from(TABLES.settings).upsert(
    {
      key: "global",
      data: merged,
    },
    { onConflict: "key" }
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  // Revalidate cache tags to ensure updates are reflected
  revalidateTag("cms-settings");
  revalidateTag("site-data");

  return { ok: true, data: merged };
}

export async function getSiteSections() {
  if (!hasCmsEnv()) {
    return clone(DEFAULT_SITE_SECTIONS);
  }

  await trySeedDefaults();
  const supabase = getReadClient();
  if (!supabase) {
    return clone(DEFAULT_SITE_SECTIONS);
  }

  const { data } = await supabase.from(TABLES.sections).select("key, data");
  const mapped = {};
  (data || []).forEach((row) => {
    mapped[row.key] = row.data || {};
  });

  return deepMerge(clone(DEFAULT_SITE_SECTIONS), mapped);
}

export async function saveSection(key, value) {
  const baseSections = await getSiteSections();
  const mergedSection = deepMerge(baseSections[key] || {}, value || {});
  const supabase = getServerClient({ useServiceRole: hasSeederEnv() });
  if (!supabase) {
    return { ok: false, error: "Supabase environment variables are missing." };
  }

  const { error } = await supabase.from(TABLES.sections).upsert(
    {
      key,
      data: mergedSection,
    },
    { onConflict: "key" }
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data: mergedSection };
}

export async function getContentItems(type, { publishedOnly = false, featuredOnly = false } = {}) {
  if (!CMS_CONTENT_TYPES.includes(type)) {
    return [];
  }

  if (!hasCmsEnv()) {
    return clone(DEFAULT_CONTENT_ITEMS[type] || []);
  }

  await trySeedDefaults();
  const supabase = getReadClient();
  if (!supabase) {
    return clone(DEFAULT_CONTENT_ITEMS[type] || []);
  }

  let query = supabase
    .from(TABLES.content)
    .select("*")
    .eq("type", type)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  if (featuredOnly) {
    query = query.eq("featured", true);
  }

  const { data } = await query;
  return withDefaultsForType(type, data || []);
}

export async function getAllContentItems({ publishedOnly = false } = {}) {
  const [services, portfolio, blog, testimonials, techStack] = await Promise.all([
    getContentItems("services", { publishedOnly }),
    getContentItems("portfolio", { publishedOnly }),
    getContentItems("blog", { publishedOnly }),
    getContentItems("testimonials", { publishedOnly }),
    getContentItems("tech_stack", { publishedOnly }),
  ]);

  return { services, portfolio, blog, testimonials, techStack };
}

export async function saveContentItem(type, payload) {
  if (!CMS_CONTENT_TYPES.includes(type)) {
    return { ok: false, error: "Invalid content type." };
  }

  const supabase = getServerClient({ useServiceRole: hasSeederEnv() });
  if (!supabase) {
    return { ok: false, error: "Supabase environment variables are missing." };
  }

  const item = {
    id: payload.id || undefined,
    type,
    title: payload.title || "",
    slug: payload.slug || toSlug(payload.title || ""),
    excerpt: payload.excerpt || "",
    payload: payload.payload || {},
    cover_image_url: payload.cover_image_url || "",
    tags: safeArray(payload.tags),
    published: payload.published ?? true,
    featured: payload.featured ?? false,
    display_order: Number(payload.display_order ?? 0),
  };

  if (!item.id) {
    delete item.id;
  }

  const { data, error } = await supabase
    .from(TABLES.content)
    .upsert(item, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data };
}

export async function deleteContentItem(type, id) {
  if (!CMS_CONTENT_TYPES.includes(type)) {
    return { ok: false, error: "Invalid content type." };
  }

  const supabase = getServerClient({ useServiceRole: hasSeederEnv() });
  if (!supabase) {
    return { ok: false, error: "Supabase environment variables are missing." };
  }

  const { error } = await supabase.from(TABLES.content).delete().eq("id", id).eq("type", type);
  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function getCmsSnapshot() {
  const [settings, sections, content] = await Promise.all([
    getSiteSettings(),
    getSiteSections(),
    getAllContentItems({ publishedOnly: true }),
  ]);

  return {
    settings,
    sections,
    content,
  };
}

export async function getDashboardStats() {
  const [settings, sections, content] = await Promise.all([
    getSiteSettings(),
    getSiteSections(),
    getAllContentItems(),
  ]);

  return {
    totals: {
      sections: Object.keys(sections || {}).length,
      services: content.services.length,
      portfolio: content.portfolio.length,
      blog: content.blog.length,
      testimonials: content.testimonials.length,
      techStack: content.techStack.length,
    },
    settings,
  };
}
