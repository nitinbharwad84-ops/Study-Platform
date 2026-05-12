import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware placeholder for route protection
// Will be implemented in Phase 4 with Supabase Auth
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - no protection needed
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // TODO: Phase 4 - Add Supabase session validation
  // TODO: Phase 4 - Check user role for admin routes
  // TODO: Phase 4 - Redirect unauthenticated users to /login

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (assets)
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
