import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/cms/auth";
import { SUPABASE_ENV } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function cleanString(value) {
  return String(value || "").trim();
}

export async function GET(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  return NextResponse.json({
    ok: true,
    profile: {
      id: auth.user.id,
      email: auth.user.email,
      fullName: auth.user.user_metadata?.full_name || "",
      phone: auth.user.user_metadata?.phone || "",
      role:
        auth.user.app_metadata?.role ||
        auth.user.user_metadata?.role ||
        "admin",
      createdAt: auth.user.created_at,
      lastSignInAt: auth.user.last_sign_in_at,
    },
  });
}

export async function PUT(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  if (!SUPABASE_ENV.hasServiceRoleEnv) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY is required to update profile details from the admin panel.",
      },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = cleanString(body?.fullName);
  const phone = cleanString(body?.phone);
  const password = String(body?.password || "");

  const updatePayload = {
    user_metadata: {
      ...(auth.user.user_metadata || {}),
      full_name: fullName,
      phone,
    },
  };

  if (password) {
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }
    updatePayload.password = password;
  }

  const supabase = createSupabaseServerClient({ useServiceRole: true });
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service-role configuration is missing." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase.auth.admin.updateUserById(
    auth.user.id,
    updatePayload
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    profile: {
      id: data.user?.id || auth.user.id,
      email: data.user?.email || auth.user.email,
      fullName: data.user?.user_metadata?.full_name || fullName,
      phone: data.user?.user_metadata?.phone || phone,
      role:
        data.user?.app_metadata?.role ||
        data.user?.user_metadata?.role ||
        "admin",
    },
  });
}

