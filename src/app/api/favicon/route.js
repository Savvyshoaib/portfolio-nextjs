import { NextResponse } from "next/server";
import { getFaviconHref } from "@/lib/cms/asset-cache";
import { getSiteSettings } from "@/lib/cms/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSiteSettings();
  const faviconHref = getFaviconHref(settings?.seo || {});

  if (!faviconHref) {
    return new NextResponse("Favicon not configured.", { status: 404 });
  }

  try {
    const upstream = await fetch(faviconHref, { cache: "no-store" });
    if (!upstream.ok) {
      return new NextResponse("Failed to load favicon.", { status: 502 });
    }

    const buffer = await upstream.arrayBuffer();
    const contentType = upstream.headers.get("content-type") || "image/png";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new NextResponse("Failed to load favicon.", { status: 502 });
  }
}
