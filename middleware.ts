import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSessionToken,
} from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await readAdminSessionToken(sessionToken);
  const isAdminRoute = request.nextUrl.pathname.startsWith("/api/admin");
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (!isAdminRoute && !isDashboardRoute) {
    return NextResponse.next();
  }

  if (!session) {
    if (isAdminRoute) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.user.role !== "ADMIN") {
    if (isAdminRoute) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.redirect(new URL("/login?error=forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
