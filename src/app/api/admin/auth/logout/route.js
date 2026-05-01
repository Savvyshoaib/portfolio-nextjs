import { NextResponse } from "next/server";
import { clearCmsSessionCookies } from "@/lib/cms/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearCmsSessionCookies(response);
  return response;
}

