import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/login
 * Authenticates via email/password.
 * Returns role for client-side redirect logic.
 * Session cookie is set by Supabase client automatically.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const supabaseAuth = createSupabaseServerClient();
    const { data: authData, error: signInError } = await supabaseAuth.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (signInError || !authData.user) {
      return NextResponse.json(
        { error: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

    // Fetch user profile + role
    const adminClient = createServerClient();
    const { data: profile, error: profileError } = await adminClient
      .from("users")
      .select("*, roles(name)")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User profile not found. Please contact support." }, { status: 404 });
    }

    if (profile.status === "disabled" || profile.status === "suspended") {
      await supabaseAuth.auth.signOut();
      return NextResponse.json({ error: "Your account has been disabled. Please contact an administrator." }, { status: 403 });
    }

    const role = (profile.roles as unknown as { name: string })?.name ?? "student";

    // Set session cookie via response headers
    const response = NextResponse.json({
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

    // Forward auth cookies from supabase response
    const supabaseResponse = await supabaseAuth.auth.getSession();
    if (supabaseResponse.data.session) {
      const { access_token, refresh_token } = supabaseResponse.data.session;
      response.cookies.set("sb-access-token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1 hour
      });
      response.cookies.set("sb-refresh-token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
