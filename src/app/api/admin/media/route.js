import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/cms/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ASSETS_BUCKET = "assets";
const LIST_PAGE_SIZE = 100;

function toStoragePath(prefix, name) {
  const safePrefix = String(prefix || "").trim();
  const safeName = String(name || "").trim();
  return safePrefix ? `${safePrefix}/${safeName}` : safeName;
}

function isFolderEntry(entry) {
  return !entry?.id;
}

function isImageEntry(entry) {
  return String(entry?.metadata?.mimetype || "").startsWith("image/");
}

function normalizeMediaPath(rawPath) {
  return String(rawPath || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .trim();
}

function isSafeObjectPath(path) {
  if (!path || path.endsWith("/") || path.includes("..")) {
    return false;
  }

  return true;
}

function getSortTimestamp(entry) {
  return Date.parse(entry.createdAt || entry.updatedAt || "") || 0;
}

async function listEntriesByPage(supabase, prefix) {
  const entries = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(ASSETS_BUCKET).list(prefix, {
      limit: LIST_PAGE_SIZE,
      offset,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      return { entries: [], error };
    }

    const pageEntries = Array.isArray(data) ? data : [];
    entries.push(...pageEntries);

    if (pageEntries.length < LIST_PAGE_SIZE) {
      break;
    }

    offset += LIST_PAGE_SIZE;
  }

  return { entries, error: null };
}

async function listAllBucketObjects(supabase) {
  const queue = [""];
  const files = [];

  while (queue.length > 0) {
    const currentPrefix = queue.shift();
    const { entries, error } = await listEntriesByPage(supabase, currentPrefix);
    if (error) {
      return { files: [], error };
    }

    for (const entry of entries) {
      if (!entry?.name) {
        continue;
      }

      const path = toStoragePath(currentPrefix, entry.name);

      if (isFolderEntry(entry)) {
        queue.push(path);
        continue;
      }

      files.push({
        ...entry,
        path,
      });
    }
  }

  return { files, error: null };
}

export async function GET(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  try {
    const supabase = createSupabaseServerClient({ useServiceRole: true });
    if (!supabase) {
      return NextResponse.json({ error: "Supabase configuration error." }, { status: 500 });
    }

    const { files, error } = await listAllBucketObjects(supabase);
    if (error) {
      console.error("Media list API error:", error);
      return NextResponse.json({ error: "Failed to fetch media files." }, { status: 500 });
    }

    const imageFiles = files
      .filter(isImageEntry)
      .map((file) => {
        const path = normalizeMediaPath(file.path);
        const { data: publicUrlData } = supabase.storage.from(ASSETS_BUCKET).getPublicUrl(path);
        return {
          name: file.name,
          path,
          url: publicUrlData?.publicUrl || "",
          contentType: file.metadata?.mimetype || "",
          size: Number(file.metadata?.size || 0),
          createdAt: file.created_at || null,
          updatedAt: file.updated_at || null,
          lastAccessedAt: file.last_accessed_at || null,
        };
      })
      .sort((left, right) => getSortTimestamp(right) - getSortTimestamp(left));

    return NextResponse.json({
      ok: true,
      files: imageFiles,
      total: imageFiles.length,
    });
  } catch (error) {
    console.error("Media GET API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const path = normalizeMediaPath(searchParams.get("path"));

    if (!isSafeObjectPath(path)) {
      return NextResponse.json({ error: "Valid file path is required." }, { status: 400 });
    }

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    if (!supabase) {
      return NextResponse.json({ error: "Supabase configuration error." }, { status: 500 });
    }

    const { error } = await supabase.storage.from(ASSETS_BUCKET).remove([path]);
    if (error) {
      console.error("Media delete API error:", error);
      return NextResponse.json({ error: "Failed to delete media file." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      path,
    });
  } catch (error) {
    console.error("Media DELETE API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
