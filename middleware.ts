import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Create response object for better caching
  const response = NextResponse.next();

  // Add cache-control headers for auth pages
  if (pathname.startsWith("/auth/") || pathname.startsWith("/external/auth/")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  // Auth routes that don't need protection
  const publicAuthRoutes = [
    "/auth/otp-login",
    "/auth/verify-otp",
    "/external/auth/otp-login",
    "/external/auth/verify-otp",
  ];

  // Protected routes that require authentication
  const protectedRoutes = [
    "/internal",
    "/external",
    "/dashboard",
    "/auth/onboarding",
  ];

  // Check if route requires protection
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Skip if the route is public
  if (publicAuthRoutes.includes(pathname)) {
    return response;
  }

  // Check for session cookie
  const sessionToken = req.cookies.get("next-auth.session-token");

  // Determine user type based on URL
  const isExternalUser = pathname.startsWith("/external");

  // Redirect unauthorized users to the appropriate login page
  if (!sessionToken && isProtectedRoute) {
    const redirectPath = isExternalUser ? "/external/auth/otp-login" : "/auth/otp-login";
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // Verify session by calling /api/auth/session
  if (sessionToken && isProtectedRoute) {
    try {
      const sessionResponse = await fetch(
        `${req.nextUrl.origin}/api/auth/session`,
        {
          headers: {
            Cookie: `next-auth.session-token=${sessionToken.value}`,
          },
        }
      );
      const sessionData = await sessionResponse.json();

      if (!sessionResponse.ok || !sessionData?.user) {
        const redirectPath = isExternalUser ? "/external/auth/otp-login" : "/auth/otp-login";
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }

      // // Optionally, check if user role matches the route (e.g., external user accessing /internal)
      // const userRole = sessionData.user?.role;
      // const isInternalRoute = pathname.startsWith("/internal");
      // const isExternalRoute = pathname.startsWith("/external");

      // if (isInternalRoute && userRole !== "internal") {
      //   return NextResponse.redirect(new URL("/auth/otp-login", req.url));
      // }
      // if (isExternalRoute && userRole !== "External") {
      //   return NextResponse.redirect(new URL("/external/auth/otp-login", req.url));
      // }
    } catch (error) {
      console.error("Middleware session fetch error:", error);
      const redirectPath = isExternalUser ? "/external/auth/otp-login" : "/auth/otp-login";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/internal/:path*", "/external/:path*", "/auth/:path*", "/dashboard/:path*"],
};