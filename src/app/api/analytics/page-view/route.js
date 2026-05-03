import { NextResponse } from "next/server";
import { recordAnalyticsPageView } from "@/lib/analytics/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await recordAnalyticsPageView(request, body);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error || "Failed to track page view." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid page view request." }, { status: 400 });
  }
}
