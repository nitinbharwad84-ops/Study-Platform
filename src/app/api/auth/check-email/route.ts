import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/check-email
 * Validates that an email exists in the approved_emails registry
 * and has not been claimed or revoked.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    const normalizedEmail = email.toLowerCase().trim();

    const { data: approved, error } = await supabase
      .from("approved_emails")
      .select("id, email, status, role_to_assign, expires_at")
      .eq("email", normalizedEmail)
      .single();

    if (error || !approved) {
      return NextResponse.json(
        { error: "This email is not approved for registration. Please contact an administrator." },
        { status: 403 }
      );
    }

    if (approved.status === "claimed") {
      return NextResponse.json(
        { error: "An account already exists for this email. Please sign in instead." },
        { status: 409 }
      );
    }

    if (approved.status === "revoked") {
      return NextResponse.json(
        { error: "Your access has been revoked. Please contact an administrator." },
        { status: 403 }
      );
    }

    if (approved.expires_at && new Date(approved.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Your invitation has expired. Please contact an administrator." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      approved: true,
      email: normalizedEmail,
      roleToAssign: approved.role_to_assign,
    });
  } catch (error) {
    console.error("[POST /api/auth/check-email]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
