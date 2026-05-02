import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/cms/auth";
import { CMS_CONTENT_TYPES } from "@/lib/cms/constants";
import { deleteContentItem, saveContentItem } from "@/lib/cms/server";
import { revalidatePublicSite } from "@/lib/cms/revalidate";

function normalizeType(rawType) {
  return String(rawType || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
}

function isAllowedType(type) {
  return CMS_CONTENT_TYPES.includes(type);
}

export async function POST(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const type = normalizeType(body?.type);
    if (!isAllowedType(type)) {
      return NextResponse.json(
        { error: "Invalid content type." },
        { status: 404 }
      );
    }

    const result = await saveContentItem(type, body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    revalidatePublicSite();

    return NextResponse.json({
      ok: true,
      item: result.data,
    });
  } catch (error) {
    console.error("Content creation API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const type = normalizeType(body?.type);
    const id = String(body?.id || "");

    if (!isAllowedType(type)) {
      return NextResponse.json({ error: "Invalid content type." }, { status: 404 });
    }

    if (!id) {
      return NextResponse.json({ error: "Item id is required." }, { status: 400 });
    }

    const result = await saveContentItem(type, { ...body, id });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    revalidatePublicSite();

    return NextResponse.json({
      ok: true,
      item: result.data,
    });
  } catch (error) {
    console.error("Content update API error:", error);
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
    const type = normalizeType(searchParams.get("type"));
    const id = String(searchParams.get("id") || "");

    if (!isAllowedType(type)) {
      return NextResponse.json({ error: "Invalid content type." }, { status: 404 });
    }

    if (!id) {
      return NextResponse.json({ error: "Item id is required." }, { status: 400 });
    }

    const result = await deleteContentItem(type, id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    revalidatePublicSite();

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("Content deletion API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
