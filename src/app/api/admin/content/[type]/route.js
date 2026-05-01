import { NextResponse } from "next/server";
import { CMS_CONTENT_TYPES } from "@/lib/cms/constants";
import { deleteContentItem, getContentItems, saveContentItem } from "@/lib/cms/server";
import { requireAdminApiUser } from "@/lib/cms/auth";
import { revalidatePublicSite } from "@/lib/cms/revalidate";

function resolveType(paramsPromise) {
  return paramsPromise?.type || "";
}

function normalizeType(rawType) {
  return String(rawType || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
}

function isAllowedType(type) {
  return CMS_CONTENT_TYPES.includes(type);
}

export async function GET(request, { params }) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  const type = normalizeType(resolveType(await params));
  if (!isAllowedType(type)) {
    return NextResponse.json({ error: "Invalid content type." }, { status: 404 });
  }

  const publishedOnly = request.nextUrl.searchParams.get("published") === "true";
  const featuredOnly = request.nextUrl.searchParams.get("featured") === "true";
  const items = await getContentItems(type, { publishedOnly, featuredOnly });
  return NextResponse.json({ ok: true, type, items });
}

export async function POST(request, { params }) {
  return mutateContent(request, params);
}

export async function PUT(request, { params }) {
  return mutateContent(request, params);
}

async function mutateContent(request, paramsPromise) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  const type = normalizeType(resolveType(await paramsPromise));
  if (!isAllowedType(type)) {
    return NextResponse.json({ error: "Invalid content type." }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = await saveContentItem(type, body?.item || body || {});
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  revalidatePublicSite();
  return NextResponse.json({ ok: true, type, item: result.data });
}

export async function DELETE(request, { params }) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  const type = normalizeType(resolveType(await params));
  if (!isAllowedType(type)) {
    return NextResponse.json({ error: "Invalid content type." }, { status: 404 });
  }

  let id = request.nextUrl.searchParams.get("id") || "";
  if (!id) {
    try {
      const body = await request.json();
      id = String(body?.id || "");
    } catch {
      id = "";
    }
  }

  if (!id) {
    return NextResponse.json({ error: "Item id is required." }, { status: 400 });
  }

  const result = await deleteContentItem(type, id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  revalidatePublicSite();
  return NextResponse.json({ ok: true });
}
