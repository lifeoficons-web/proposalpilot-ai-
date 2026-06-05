import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, getPublicPaths } from "@/lib/auth-edge";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const publicPaths = getPublicPaths();
  const { pathname } = request.nextUrl;

  // API routes are handled by the API routes themselves
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.includes(pathname);

  // Redirect to login if no token and not on a public page
  if (!token && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    const payload = verifyToken(token);
    if (!payload) {
      // Invalid or expired token — clear it and redirect
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    // Redirect authenticated users away from login/signup
    if (pathname === "/login" || pathname === "/signup") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Admin guard
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};