import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/admin/audit";

/**
 * PATCH /api/admin/users/[id]
 * Update user status or role.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("can_manage_users", req);
    const { id } = params;
    const { status, role } = await req.json();

    const supabaseAdmin = createServerClient();

    const updates: any = {};
    if (status) updates.status = status;
    if (role) updates.role = role;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[PATCH /api/admin/users/[id]] Update error:", error);
      return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
    }

    // Log the event
    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      action: "Update User",
      entityType: "User",
      entityId: id,
      details: updates,
      severity: "info",
    });

    return NextResponse.json({ user });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
