import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/cms/auth";
import { revalidatePublicSite } from "@/lib/cms/revalidate";

export async function POST(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  revalidatePublicSite();

  return NextResponse.json({
    ok: true,
    message: "Site cache cleared. Hard-refresh your browser (Ctrl+Shift+R) if the favicon still looks old.",
  });
}
