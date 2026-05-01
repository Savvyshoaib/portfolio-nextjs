import { NextResponse } from "next/server";
import { CMS_AUTH_COOKIES } from "@/lib/cms/constants";

const ADMIN_PUBLIC_PATHS = new Set(["/admin/login", "/admin/register"]);

function hasCmsSession(request) {
  return Boolean(request.cookies.get(CMS_AUTH_COOKIES.accessToken)?.value);
}

function isPublicAdminApi(pathname) {
  return (
    pathname === "/api/admin/auth/login" ||
    pathname === "/api/admin/auth/register" ||
    pathname === "/api/admin/auth/logout" ||
    pathname === "/api/admin/auth/session"
  );
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasCmsSession(request);

  if (pathname.startsWith("/admin")) {
    const isPublicAdminPage = ADMIN_PUBLIC_PATHS.has(pathname);

    if (!isAuthenticated && !isPublicAdminPage) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/api/admin") && !isPublicAdminApi(pathname) && !isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
