import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit/log";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/register
 * Invite-only registration:
 * 1. Re-validates email in approved_emails
 * 2. Creates Supabase auth user
 * 3. Creates users profile row with correct role
 * 4. Marks approved_email as claimed
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const supabase = createServerClient(); // service role client
    const normalizedEmail = email.toLowerCase().trim();

    // Re-validate invite
    const { data: approved, error: inviteError } = await supabase
      .from("approved_emails")
      .select("id, status, role_to_assign, expires_at")
      .eq("email", normalizedEmail)
      .single();

    if (inviteError || !approved || approved.status !== "pending") {
      return NextResponse.json({ error: "Email is not approved or already claimed." }, { status: 403 });
    }

    if (approved.expires_at && new Date(approved.expires_at) < new Date()) {
      return NextResponse.json({ error: "Invitation has expired." }, { status: 403 });
    }

    // Fetch role ID
    const { data: roleRow } = await supabase
      .from("roles")
      .select("id")
      .eq("name", approved.role_to_assign ?? "student")
      .single();

    if (!roleRow) {
      return NextResponse.json({ error: "Role configuration error" }, { status: 500 });
    }

    // Create Supabase Auth user (using admin API = service role)
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true, // auto-confirm since invite-only
      user_metadata: { first_name: firstName, last_name: lastName },
    });

    if (signUpError || !authData.user) {
      await logAuditEvent({
        actorEmail: normalizedEmail,
        action: "register_failed_auth",
        entityType: "auth",
        severity: "error",
        details: { error: signUpError?.message || "Auth user creation failed" }
      });
      console.error("[register] Supabase auth error:", signUpError);
      return NextResponse.json(
        { error: signUpError?.message ?? "Failed to create account" },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // Create users profile row
    const { error: profileError } = await supabase.from("users").insert({
      id: userId,
      email: normalizedEmail,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      role_id: roleRow.id,
      status: "active",
    });

    if (profileError) {
      // Rollback: delete the auth user
      await supabase.auth.admin.deleteUser(userId);
      console.error("[register] Profile insert error:", profileError);
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 });
    }

    // Mark approved_email as claimed
    await supabase
      .from("approved_emails")
      .update({ status: "claimed", claimed_at: new Date().toISOString() })
      .eq("id", approved.id);

    await logAuditEvent({
      actorId: userId,
      actorEmail: normalizedEmail,
      action: "register_success",
      entityType: "user",
      entityId: userId,
      severity: "success",
      details: { role: approved.role_to_assign }
    });

    return NextResponse.json({ success: true, userId }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
