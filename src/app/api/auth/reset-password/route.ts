import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createServerClient();

    // 1. Verify token
    const { data: request, error: fetchError } = await supabaseAdmin
      .from("password_reset_requests")
      .select("id, user_id, status, token_expires_at")
      .eq("reset_token", token)
      .single();

    if (fetchError || !request) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    if (request.status !== "approved") {
      return NextResponse.json({ error: "This request is not approved." }, { status: 400 });
    }

    if (new Date() > new Date(request.token_expires_at)) {
      return NextResponse.json({ error: "Token has expired." }, { status: 400 });
    }

    // 2. Update user's password via Supabase Auth Admin API
    const { error: updatePasswordError } = await supabaseAdmin.auth.admin.updateUserById(
      request.user_id,
      { password: newPassword }
    );

    if (updatePasswordError) {
      console.error("[POST /api/auth/reset-password] Auth error:", updatePasswordError);
      return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
    }

    // 3. Mark request as completed
    await supabaseAdmin
      .from("password_reset_requests")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", request.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/reset-password]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
