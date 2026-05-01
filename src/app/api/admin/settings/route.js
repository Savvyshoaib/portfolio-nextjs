import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/cms/auth";
import { getSiteSettings, saveSiteSettings } from "@/lib/cms/server";
import { revalidatePublicSite } from "@/lib/cms/revalidate";

export async function GET(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  const settings = await getSiteSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = await saveSiteSettings(body?.settings || body || {});
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  revalidatePublicSite();
  return NextResponse.json({ ok: true, settings: result.data });
}
