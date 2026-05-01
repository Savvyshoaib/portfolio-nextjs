import "server-only";
import { getCmsSnapshot } from "./server";

function toMetadataBase(siteUrl) {
  try {
    return new URL(siteUrl);
  } catch {
    return undefined;
  }
}

function toKeywords(rawKeywords) {
  if (Array.isArray(rawKeywords)) {
    return rawKeywords;
  }

  return String(rawKeywords || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function getPublicSiteData() {
  const snapshot = await getCmsSnapshot();
  const { settings, sections, content } = snapshot;

  return {
    settings,
    sections,
    services: content.services.map((item) => ({
      ...item,
      title: item.title,
      desc: item.excerpt,
      icon: item.payload?.icon || "Sparkles",
    })),
    portfolio: content.portfolio.map((item) => ({
      ...item,
      title: item.title,
      tag: item.excerpt,
      year: item.payload?.year || "",
      color: item.payload?.color || "from-accent/40 to-accent",
      size: item.payload?.size || "sm",
    })),
    blogPosts: content.blog.map((item) => ({
      ...item,
      title: item.title,
      excerpt: item.excerpt,
      tag: item.payload?.tag || "Article",
      date: item.payload?.date || "",
    })),
    testimonials: content.testimonials.map((item) => ({
      ...item,
      quote: item.title,
      name: item.payload?.name || "Anonymous",
      role: item.payload?.role || item.excerpt || "",
    })),
    techStack: content.techStack.map((item) => item.title).filter(Boolean),
  };
}

export { getPublicSiteData };

export async function getGlobalSeoSettings() {
  const data = await getPublicSiteData();
  return {
    seo: data.settings.seo || {},
    pageSeo: data.settings.pageSeo || {},
    robots: data.settings.robots || {},
    general: data.settings.general || {},
  };
}

export async function buildPageMetadata(pageKey = "home") {
  const { seo, pageSeo, robots, general } = await getGlobalSeoSettings();
  const selectedSeo = pageSeo[pageKey] || {};
  const title = selectedSeo.title || seo.title;
  const description = selectedSeo.description || seo.description;
  const keywords = toKeywords(selectedSeo.keywords || seo.keywords);
  const ogTitle = selectedSeo.ogTitle || seo.ogTitle || title;
  const ogDescription = selectedSeo.ogDescription || seo.ogDescription || description;
  const ogImageUrl = selectedSeo.ogImageUrl || seo.ogImageUrl || undefined;

  const metadata = {
    title,
    description,
    keywords,
    authors: [{ name: general.siteName || "Website" }],
    twitter: {
      card: seo.twitterCard || "summary_large_image",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    robots: {
      index: robots.allowIndexing ?? true,
      follow: robots.allowFollow ?? true,
    },
  };

  const metadataBase = toMetadataBase(general.siteUrl);
  if (metadataBase) {
    metadata.metadataBase = metadataBase;
  }

  if (seo.faviconUrl) {
    metadata.icons = {
      icon: seo.faviconUrl,
      shortcut: seo.faviconUrl,
      apple: seo.faviconUrl,
    };
  }

  return metadata;
}

export function getAdminNoIndexMetadata() {
  return {
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}
