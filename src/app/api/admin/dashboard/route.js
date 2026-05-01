import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/cms/auth";
import { getDashboardStats } from "@/lib/cms/server";

export async function GET(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  const stats = await getDashboardStats();
  return NextResponse.json({ ok: true, stats });
}

