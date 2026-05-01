import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/cms/auth";

export async function GET(request) {
  const { user, error } = await getAuthenticatedAdmin(request);

  if (!user) {
    return NextResponse.json({ authenticated: false, error }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata || {},
      app_metadata: user.app_metadata || {},
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    },
  });
}

