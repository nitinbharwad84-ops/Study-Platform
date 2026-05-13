import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit/log";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/mcq-questions
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission("can_manage_content", req);
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    const supabaseAdmin = createServerClient();

    let query = supabaseAdmin
      .from("mcq_questions")
      .select("*, subjects(name)")
      .order("created_at", { ascending: false });

    if (subjectId && subjectId !== "all") {
      query = query.eq("subject_id", subjectId);
    }

    const { data: questions, error } = await query;

    if (error) {
      console.error("[GET /api/admin/mcq-questions] Fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch questions." }, { status: 500 });
    }

    return NextResponse.json({ questions });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}

/**
 * POST /api/admin/mcq-questions
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requirePermission("can_manage_content", req);
    const body = await req.json();
    const { subject_id, question_text, options, correct_option, explanations, difficulty } = body;

    if (!subject_id || !question_text || !options || !correct_option) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const supabaseAdmin = createServerClient();

    const { data: question, error } = await supabaseAdmin
      .from("mcq_questions")
      .insert({
        subject_id,
        question_text,
        options,
        correct_option,
        explanations,
        difficulty: difficulty || "medium",
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/admin/mcq-questions] Insert error:", error);
      return NextResponse.json({ error: "Failed to create question." }, { status: 500 });
    }

    // Log the event
    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      action: "create_question_success",
      entityType: "mcq_question",
      entityId: question.id,
      severity: "success",
      details: { subject_id, difficulty }
    });

    return NextResponse.json({ question });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
