import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/admin/audit";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/subjects
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission("can_manage_subjects", req);

    const supabaseAdmin = createServerClient();

    const { data: subjects, error } = await supabaseAdmin
      .from("subjects")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch subjects." }, { status: 500 });
    }

    return NextResponse.json({ subjects });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}

/**
 * POST /api/admin/subjects
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requirePermission("can_manage_subjects", req);
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const supabaseAdmin = createServerClient();

    const { data: subject, error } = await supabaseAdmin
      .from("subjects")
      .insert({
        name,
        description,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Subject already exists." }, { status: 400 });
      }
      return NextResponse.json({ error: "Failed to create subject." }, { status: 500 });
    }

    // Log the event
    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      action: "Create Subject",
      entityType: "Subject",
      entityId: subject.id,
      details: { name, description },
      severity: "success",
    });

    return NextResponse.json({ subject });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
