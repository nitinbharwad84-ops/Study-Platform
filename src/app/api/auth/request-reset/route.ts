import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/request-reset
 * Student submits a password reset request (requires admin approval).
 * Does NOT require authentication — student may be locked out.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, reason } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    const normalizedEmail = email.toLowerCase().trim();

    // Check user exists
    const { data: user } = await supabase
      .from("users")
      .select("id, email, status")
      .eq("email", normalizedEmail)
      .single();

    if (!user) {
      // Don't reveal whether the email exists — return success anyway
      return NextResponse.json({ success: true });
    }

    if (user.status === "disabled") {
      return NextResponse.json(
        { error: "This account has been disabled. Please contact an administrator." },
        { status: 403 }
      );
    }

    // Check for existing pending request
    const { data: existing } = await supabase
      .from("password_reset_requests")
      .select("id, status, requested_at")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "A password reset request is already pending. Please wait for admin approval." },
        { status: 409 }
      );
    }

    // Create request
    await supabase.from("password_reset_requests").insert({
      user_id: user.id,
      email: normalizedEmail,
      reason: reason?.trim() || null,
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/request-reset]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
