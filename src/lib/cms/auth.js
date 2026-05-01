import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CMS_AUTH_COOKIES } from "./constants";

function getBaseCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  };
}

export function setCmsSessionCookies(response, session) {
  const base = getBaseCookieOptions();
  const expiresAt = session?.expires_at ? new Date(session.expires_at * 1000) : undefined;

  response.cookies.set({
    ...base,
    name: CMS_AUTH_COOKIES.accessToken,
    value: session?.access_token || "",
    ...(expiresAt ? { expires: expiresAt } : {}),
  });

  response.cookies.set({
    ...base,
    name: CMS_AUTH_COOKIES.refreshToken,
    value: session?.refresh_token || "",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearCmsSessionCookies(response) {
  response.cookies.set({
    ...getBaseCookieOptions(),
    name: CMS_AUTH_COOKIES.accessToken,
    value: "",
    expires: new Date(0),
  });

  response.cookies.set({
    ...getBaseCookieOptions(),
    name: CMS_AUTH_COOKIES.refreshToken,
    value: "",
    expires: new Date(0),
  });
}

function extractBearerToken(request) {
  const authHeader = request?.headers?.get?.("authorization") || "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    return "";
  }

  return authHeader.slice(7).trim();
}

async function getRequestCookieToken(request) {
  const requestToken = request?.cookies?.get?.(CMS_AUTH_COOKIES.accessToken)?.value;
  if (requestToken) {
    return requestToken;
  }

  const cookieStore = await cookies();
  return cookieStore.get(CMS_AUTH_COOKIES.accessToken)?.value || "";
}

function isAdminUser(user) {
  const role = user?.app_metadata?.role || user?.user_metadata?.role || "admin";
  return role === "admin" || role === "owner" || role === "super_admin";
}

export async function getAuthenticatedAdmin(request) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { user: null, error: "Supabase environment variables are missing." };
  }

  const accessToken = extractBearerToken(request) || (await getRequestCookieToken(request));
  if (!accessToken) {
    return { user: null, error: "Missing authentication token." };
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user) {
    return { user: null, error: "Invalid or expired session." };
  }

  if (!isAdminUser(data.user)) {
    return { user: null, error: "Your account is not allowed to access the admin panel." };
  }

  return { user: data.user, error: null };
}

export async function requireAdminApiUser(request) {
  const { user, error } = await getAuthenticatedAdmin(request);
  if (user) {
    return { user, error: null, response: null };
  }

  return {
    user: null,
    error: error || "Unauthorized",
    response: NextResponse.json({ error: error || "Unauthorized" }, { status: 401 }),
  };
}
