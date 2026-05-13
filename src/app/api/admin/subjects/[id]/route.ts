import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/admin/audit";

/**
 * PATCH /api/admin/subjects/[id]
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("can_manage_subjects", req);
    const { id } = params;
    const { name, description, status } = await req.json();

    const supabaseAdmin = createServerClient();

    const updates: any = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (status) updates.status = status;

    const { data: subject, error } = await supabaseAdmin
      .from("subjects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update subject." }, { status: 500 });
    }

    // Log the event
    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      action: "Update Subject",
      entityType: "Subject",
      entityId: id,
      details: updates,
      severity: "info",
    });

    return NextResponse.json({ subject });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}

/**
 * DELETE /api/admin/subjects/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("can_manage_subjects", req);
    const { id } = params;

    const supabaseAdmin = createServerClient();

    // Instead of actual deletion, we archive the subject
    const { error } = await supabaseAdmin
      .from("subjects")
      .update({ status: "archived" })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to archive subject." }, { status: 500 });
    }

    // Log the event
    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      action: "Archive Subject",
      entityType: "Subject",
      entityId: id,
      severity: "warning",
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
