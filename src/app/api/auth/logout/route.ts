import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/logout
 * Signs out the current user and clears session cookies.
 */
export async function POST() {
  try {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();

    const response = NextResponse.json({ success: true });

    // Clear auth cookies
    response.cookies.set("sb-access-token", "", { maxAge: 0, path: "/" });
    response.cookies.set("sb-refresh-token", "", { maxAge: 0, path: "/" });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/logout]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
