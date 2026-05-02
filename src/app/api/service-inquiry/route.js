import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const serviceSlug = String(body?.serviceSlug || "").trim();
    const serviceTitle = String(body?.serviceTitle || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    if (!serviceSlug) {
      return NextResponse.json({ error: "Service selection is required." }, { status: 400 });
    }

    if (!message || message.length < 10) {
      return NextResponse.json({ error: "Message is required (at least 10 characters)." }, { status: 400 });
    }

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    if (!supabase) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referrer = request.headers.get("referer") || "unknown";

    const { data, error } = await supabase
      .from("service_inquiries")
      .insert({
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        service_slug: serviceSlug,
        service_title: serviceTitle || serviceSlug,
        message,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer,
      })
      .select()
      .single();

    if (error) {
      console.error("Service inquiry submission error:", error);
      return NextResponse.json({ error: "Failed to save service inquiry." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Service inquiry submitted successfully.",
      submission: data,
    });
  } catch (error) {
    console.error("Service inquiry API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

