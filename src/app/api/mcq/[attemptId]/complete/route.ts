import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { calculateScore } from "@/lib/mcq/scoring";

/**
 * POST /api/mcq/[attemptId]/complete
 * Finalizes the exam, calculates score, and updates analytics.
 * Idempotent: returns existing result if already completed.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params;
    const supabase = createServerClient();

    // Fetch attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("mcq_attempts")
      .select("*")
      .eq("id", attemptId)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // Already completed — idempotent
    if (attempt.status === "completed") {
      return NextResponse.json({
        success: true,
        attemptId,
        score: attempt.score,
        percentage: attempt.percentage,
        correct_count: attempt.correct_count,
        wrong_count: attempt.wrong_count,
        unanswered_count: attempt.unanswered_count,
      });
    }

    // Fetch all questions from snapshot (to get correct_options)
    const { data: questions, error: qError } = await supabase
      .from("mcq_attempt_questions")
      .select("question_index, correct_option")
      .eq("attempt_id", attemptId)
      .order("question_index");

    if (qError) throw qError;

    // Fetch all answers
    const { data: answers, error: aError } = await supabase
      .from("mcq_attempt_answers")
      .select("question_index, selected_option, is_locked")
      .eq("attempt_id", attemptId)
      .order("question_index");

    if (aError) throw aError;

    // Map correct options by index
    const correctMap: Record<number, string> = {};
    for (const q of questions || []) {
      correctMap[q.question_index] = q.correct_option;
    }

    // Calculate score
    const answerRecords = (answers || []).map((a) => ({
      selected_option: a.selected_option,
      correct_option: correctMap[a.question_index],
      is_locked: a.is_locked,
    }));
    const scoreResult = calculateScore(answerRecords);

    const now = new Date().toISOString();

    // Update attempt to completed
    const { data: updatedAttempt, error: updateError } = await supabase
      .from("mcq_attempts")
      .update({
        status: "completed",
        score: scoreResult.score,
        correct_count: scoreResult.correct_count,
        wrong_count: scoreResult.wrong_count,
        unanswered_count: scoreResult.unanswered_count,
        percentage: scoreResult.percentage,
        completed_at: now,
        updated_at: now,
      })
      .eq("id", attemptId)
      .select("id, status")
      .single();

    console.log("[complete] update result:", updatedAttempt, updateError);

    if (updateError) throw updateError;
    if (!updatedAttempt) {
      console.error("[complete] Update returned no rows — possible RLS block for attemptId:", attemptId);
      throw new Error("Failed to update attempt status — RLS may be blocking the update");
    }

    // Update analytics
    const { updateAnalytics } = await import("@/lib/mcq/analytics");
    await updateAnalytics(supabase, attempt.user_id, attempt.subject_id, {
      total_questions: scoreResult.total_questions,
      correct_count: scoreResult.correct_count,
      wrong_count: scoreResult.wrong_count,
      unanswered_count: scoreResult.unanswered_count,
      percentage: scoreResult.percentage,
    });

    return NextResponse.json({
      success: true,
      attemptId,
      ...scoreResult,
    });
  } catch (error) {
    console.error("[POST /api/mcq/[attemptId]/complete]", error);
    return NextResponse.json({ error: "Failed to complete exam" }, { status: 500 });
  }
}
