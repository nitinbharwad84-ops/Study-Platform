import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/admin/audit";

/**
 * PATCH /api/admin/mcq-questions/[id]
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("can_manage_content", req);
    const { id } = params;
    const updates = await req.json();

    const supabaseAdmin = createServerClient();

    const { data: question, error } = await supabaseAdmin
      .from("mcq_questions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[PATCH /api/admin/mcq-questions/[id]] Update error:", error);
      return NextResponse.json({ error: "Failed to update question." }, { status: 500 });
    }

    // Log the event
    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      action: "Update MCQ Question",
      entityType: "MCQQuestion",
      entityId: id,
      details: updates,
      severity: "info",
    });

    return NextResponse.json({ question });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}

/**
 * DELETE /api/admin/mcq-questions/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission("can_manage_content", req);
    const { id } = params;

    const supabaseAdmin = createServerClient();

    // Archive instead of delete
    const { error } = await supabaseAdmin
      .from("mcq_questions")
      .update({ status: "archived" })
      .eq("id", id);

    if (error) {
      console.error("[DELETE /api/admin/mcq-questions/[id]] Archive error:", error);
      return NextResponse.json({ error: "Failed to archive question." }, { status: 500 });
    }

    // Log the event
    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      action: "Archive MCQ Question",
      entityType: "MCQQuestion",
      entityId: id,
      severity: "warning",
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
