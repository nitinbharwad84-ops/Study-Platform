import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];
// Admin's own auth page — also public, but admin-specific
const ADMIN_PUBLIC_ROUTES = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static assets and API routes
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  // Build SSR Supabase client (reads + silently refreshes session cookies)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set(name, value);
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set(name, "");
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isStudentPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminPublicRoute = ADMIN_PUBLIC_ROUTES.some((r) => pathname === r);
  const isAdminRoute = pathname.startsWith("/admin") && !isAdminPublicRoute;
  const isRootRoute = pathname === "/";

  // ---------------------------------------------------------
  // Root redirect
  // ---------------------------------------------------------
  if (isRootRoute) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ---------------------------------------------------------
  // Fetch role once (only if user is logged in and we need it)
  // ---------------------------------------------------------
  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("roles(name)")
      .eq("id", user.id)
      .single();
    role = (profile?.roles as unknown as { name: string })?.name ?? "student";
  }

  // ---------------------------------------------------------
  // /admin/login — the admin auth page
  // ---------------------------------------------------------
  if (isAdminPublicRoute) {
    // Already logged in as admin → go to admin dashboard
    if (user && role && role !== "student") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    // Logged in as student → go to student dashboard
    if (user && role === "student") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Not logged in → allow access to admin login page
    return response;
  }

  // ---------------------------------------------------------
  // Student public routes (/login, /register, /forgot-password)
  // ---------------------------------------------------------
  if (isStudentPublicRoute) {
    if (user && role === "student") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (user && role && role !== "student") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return response;
  }

  // ---------------------------------------------------------
  // Admin protected routes (/admin/*)
  // ---------------------------------------------------------
  if (isAdminRoute) {
    // Not logged in → redirect to admin login
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Logged in as student → deny, redirect to student dashboard
    if (role === "student") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Admin — allow through
    return response;
  }

  // ---------------------------------------------------------
  // Student protected routes (/dashboard, /mcq, /settings, etc.)
  // ---------------------------------------------------------
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
