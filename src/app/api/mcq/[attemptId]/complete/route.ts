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
    const { error: updateError } = await supabase
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
      .eq("id", attemptId);

    if (updateError) throw updateError;

    // Upsert analytics
    const { data: existingAnalytics } = await supabase
      .from("mcq_analytics")
      .select("*")
      .eq("user_id", attempt.user_id)
      .eq("subject_id", attempt.subject_id)
      .single();

    if (existingAnalytics) {
      const newTotal = existingAnalytics.total_attempts + 1;
      const newTotalQ = existingAnalytics.total_questions + scoreResult.total_questions;
      const newCorrect = existingAnalytics.total_correct + scoreResult.correct_count;
      const newWrong = existingAnalytics.total_wrong + scoreResult.wrong_count;
      const newUnanswered = existingAnalytics.total_unanswered + scoreResult.unanswered_count;
      const newAvg = newTotalQ > 0 ? Math.round((newCorrect / newTotalQ) * 10000) / 100 : 0;

      await supabase
        .from("mcq_analytics")
        .update({
          total_attempts: newTotal,
          total_questions: newTotalQ,
          total_correct: newCorrect,
          total_wrong: newWrong,
          total_unanswered: newUnanswered,
          avg_score_pct: newAvg,
          last_attempt_at: now,
          updated_at: now,
        })
        .eq("user_id", attempt.user_id)
        .eq("subject_id", attempt.subject_id);
    } else {
      const avgPct = scoreResult.total_questions > 0
        ? Math.round((scoreResult.correct_count / scoreResult.total_questions) * 10000) / 100
        : 0;
      await supabase.from("mcq_analytics").insert({
        user_id: attempt.user_id,
        subject_id: attempt.subject_id,
        total_attempts: 1,
        total_questions: scoreResult.total_questions,
        total_correct: scoreResult.correct_count,
        total_wrong: scoreResult.wrong_count,
        total_unanswered: scoreResult.unanswered_count,
        avg_score_pct: avgPct,
        last_attempt_at: now,
        updated_at: now,
      });
    }

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
