import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit/log";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/approved-emails
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission("can_manage_admins", req);

    const supabaseAdmin = createServerClient();

    const { data: emails, error } = await supabaseAdmin
      .from("approved_emails")
      .select("*")
      .order("invited_at", { ascending: false });

    if (error) {
      console.error("[GET /api/admin/approved-emails] Fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch approved emails." }, { status: 500 });
    }

    return NextResponse.json({ emails });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}

/**
 * POST /api/admin/approved-emails
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requirePermission("can_manage_admins", req);
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const supabaseAdmin = createServerClient();

    const { error } = await supabaseAdmin
      .from("approved_emails")
      .insert({
        email: cleanEmail,
        role_to_assign: role,
        invited_by: admin.id,
      });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Email already approved." }, { status: 400 });
      }
      return NextResponse.json({ error: "Failed to approve email." }, { status: 500 });
    }

    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      action: "approve_email_success",
      entityType: "approved_email",
      entityId: cleanEmail,
      severity: "success",
      details: { role }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
