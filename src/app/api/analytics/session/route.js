import { NextResponse } from "next/server";
import { recordAnalyticsSession } from "@/lib/analytics/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await recordAnalyticsSession(request, body);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error || "Failed to track session." }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data: result.data });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid analytics session request." }, { status: 400 });
  }
}
