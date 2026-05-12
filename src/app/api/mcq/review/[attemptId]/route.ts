import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * GET /api/mcq/review/[attemptId]
 * Returns all questions with chosen answers, correct answers, and explanations.
 * Read-only — used by the detailed review page.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params;
    const supabase = createServerClient();

    // Fetch attempt meta
    const { data: attempt, error: attemptError } = await supabase
      .from("mcq_attempts")
      .select("id, status, total_questions, subjects(name)")
      .eq("id", attemptId)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // Fetch question snapshots
    const { data: questions, error: qError } = await supabase
      .from("mcq_attempt_questions")
      .select("question_index, question_text, option_a, option_b, option_c, option_d, correct_option, explanation_a, explanation_b, explanation_c, explanation_d")
      .eq("attempt_id", attemptId)
      .order("question_index");

    if (qError) throw qError;

    // Fetch answers
    const { data: answers, error: aError } = await supabase
      .from("mcq_attempt_answers")
      .select("question_index, selected_option, is_correct, is_flagged")
      .eq("attempt_id", attemptId)
      .order("question_index");

    if (aError) throw aError;

    // Merge into review items
    const answerMap: Record<number, { selected_option: string | null; is_correct: boolean | null; is_flagged: boolean }> = {};
    for (const a of answers || []) {
      answerMap[a.question_index] = {
        selected_option: a.selected_option,
        is_correct: a.is_correct,
        is_flagged: a.is_flagged,
      };
    }

    const reviewItems = (questions || []).map((q) => {
      const answer = answerMap[q.question_index];
      return {
        index: q.question_index,
        question: q.question_text,
        options: {
          A: q.option_a,
          B: q.option_b,
          C: q.option_c,
          D: q.option_d,
        },
        correctOption: q.correct_option,
        selectedOption: answer?.selected_option ?? null,
        isCorrect: answer?.is_correct ?? null,
        isFlagged: answer?.is_flagged ?? false,
        explanations: {
          A: q.explanation_a,
          B: q.explanation_b,
          C: q.explanation_c,
          D: q.explanation_d,
        },
      };
    });

    return NextResponse.json({
      attemptId,
      subjectName: (attempt.subjects as unknown as { name: string })?.name,
      totalQuestions: attempt.total_questions,
      status: attempt.status,
      items: reviewItems,
    });
  } catch (error) {
    console.error("[GET /api/mcq/review/[attemptId]]", error);
    return NextResponse.json({ error: "Failed to fetch review" }, { status: 500 });
  }
}
