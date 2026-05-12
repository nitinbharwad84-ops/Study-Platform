import { NextRequest, NextResponse } from "next/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ROLE_COOKIE = "sp-user-role";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Build response first so we can bind cookie writes to it
    const cookieResponse = NextResponse.json({});

    const supabase = createSSRClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return req.cookies.get(name)?.value; },
          set(name: string, value: string, options) { cookieResponse.cookies.set(name, value, options); },
          remove(name: string, options) { cookieResponse.cookies.set(name, "", { ...options, maxAge: 0 }); },
        },
      }
    );

    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

    if (signInError || !authData.user) {
      return NextResponse.json(
        { error: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

    // Service-role client → bypasses RLS, always works
    const adminClient = createServerClient();

    const { data: profile, error: profileError } = await adminClient
      .from("users")
      .select("id, email, first_name, last_name, role_id, status")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error("[login] profile lookup failed:", profileError);
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "User profile not found. Please contact support." },
        { status: 404 }
      );
    }

    if (profile.status === "disabled" || profile.status === "suspended") {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Your account has been disabled. Please contact an administrator." },
        { status: 403 }
      );
    }

    // Fetch role explicitly by role_id
    let role = "student";
    if (profile.role_id) {
      const { data: roleData } = await adminClient
        .from("roles")
        .select("name")
        .eq("id", profile.role_id)
        .single();
      if (roleData?.name) role = roleData.name;
    }

    console.log(`[login] user=${profile.email} role=${role}`);

    const finalResponse = NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role,
      },
      redirectTo: role === "student" ? "/dashboard" : "/admin/dashboard",
    });

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    // Transfer Supabase session cookies
    cookieResponse.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie.name, cookie.value, cookieOpts);
    });

    // Set a lightweight role cookie that middleware can read without DB queries
    finalResponse.cookies.set(ROLE_COOKIE, role, {
      ...cookieOpts,
      httpOnly: false, // readable by middleware (edge)
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return finalResponse;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
