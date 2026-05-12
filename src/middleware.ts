import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

// Lightweight role cookie set by the login API
const ROLE_COOKIE = "sp-user-role";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];
const ADMIN_PUBLIC_ROUTES = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static assets and API routes through
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  // Build SSR Supabase client to refresh session cookies
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

  // Validate session — getUser() makes a server call to verify the JWT
  const { data: { user } } = await supabase.auth.getUser();

  // Read role from the lightweight cookie (set by login API, no DB query needed)
  const role = request.cookies.get(ROLE_COOKIE)?.value ?? "student";
  const isAdmin = role === "super_admin" || role === "normal_admin";

  const isStudentPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminPublicRoute = ADMIN_PUBLIC_ROUTES.some((r) => pathname === r);
  const isAdminRoute = pathname.startsWith("/admin") && !isAdminPublicRoute;
  const isRootRoute = pathname === "/";

  // ---------------------------------------------------------
  // Root redirect
  // ---------------------------------------------------------
  if (isRootRoute) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/dashboard" : "/dashboard", request.url)
    );
  }

  // ---------------------------------------------------------
  // /admin/login — the admin auth page
  // ---------------------------------------------------------
  if (isAdminPublicRoute) {
    if (user && isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (user && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response; // not logged in — show the page
  }

  // ---------------------------------------------------------
  // Student public routes (/login, /register, /forgot-password)
  // ---------------------------------------------------------
  if (isStudentPublicRoute) {
    if (user && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (user && isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return response; // not logged in — show the page
  }

  // ---------------------------------------------------------
  // Admin protected routes (/admin/*)
  // ---------------------------------------------------------
  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      // Student trying to access admin — deny
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response; // admin — allow through
  }

  // ---------------------------------------------------------
  // All other protected routes (student routes)
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
