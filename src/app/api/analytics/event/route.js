import { NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/analytics/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await recordAnalyticsEvent(request, body);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error || "Failed to track event." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid analytics event request." }, { status: 400 });
  }
}
