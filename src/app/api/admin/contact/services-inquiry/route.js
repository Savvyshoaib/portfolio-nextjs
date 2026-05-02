import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/cms/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    if (!supabase) {
      return NextResponse.json({ error: "Supabase configuration error." }, { status: 500 });
    }

    let query = supabase.from("service_inquiries").select("*", { count: "exact" });

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,service_title.ilike.%${search}%,service_slug.ilike.%${search}%,message.ilike.%${search}%`
      );
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (priority) {
      query = query.eq("priority", priority);
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) {
      console.error("Service inquiries fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch service inquiries." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      submissions: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Service inquiries API error:", error);
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
    const id = String(body?.id || "").trim();
    const status = body?.status;
    const priority = body?.priority;

    if (!id) {
      return NextResponse.json({ error: "Submission ID is required." }, { status: 400 });
    }

    const updateData = {};
    if (status) {
      updateData.status = status;
    }
    if (priority) {
      updateData.priority = priority;
    }

    if (!Object.keys(updateData).length) {
      return NextResponse.json({ error: "No fields provided for update." }, { status: 400 });
    }

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    if (!supabase) {
      return NextResponse.json({ error: "Supabase configuration error." }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("service_inquiries")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Service inquiry update error:", error);
      return NextResponse.json({ error: "Failed to update service inquiry." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Service inquiry updated successfully.",
      submission: data,
    });
  } catch (error) {
    console.error("Service inquiry update API error:", error);
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Submission ID is required." }, { status: 400 });
    }

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    if (!supabase) {
      return NextResponse.json({ error: "Supabase configuration error." }, { status: 500 });
    }

    const { error } = await supabase.from("service_inquiries").delete().eq("id", id);
    if (error) {
      console.error("Service inquiry delete error:", error);
      return NextResponse.json({ error: "Failed to delete service inquiry." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Service inquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Service inquiry delete API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

