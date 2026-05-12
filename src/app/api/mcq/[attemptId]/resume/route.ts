import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { computeTimeRemaining } from "@/lib/mcq/timer";

/**
 * GET /api/mcq/[attemptId]/resume
 * Restores full attempt state for the exam session page.
 * Returns: attempt metadata, all questions, all answers, timer state.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params;
    const supabase = createServerClient();

    // Fetch attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("mcq_attempts")
      .select("*, subjects(name)")
      .eq("id", attemptId)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // If already completed/expired, return status so UI can redirect
    if (attempt.status === "completed" || attempt.status === "expired") {
      return NextResponse.json({ status: attempt.status, attemptId }, { status: 200 });
    }

    // Auto-finalize if full_exam timer has expired
    if (attempt.timer_mode === "full_exam" && attempt.expires_at) {
      const timerState = computeTimeRemaining(attempt.expires_at);
      if (timerState.isExpired) {
        await supabase
          .from("mcq_attempts")
          .update({ status: "expired", updated_at: new Date().toISOString() })
          .eq("id", attemptId);

        return NextResponse.json({ status: "expired", attemptId }, { status: 200 });
      }
    }

    // Fetch questions snapshot (ordered)
    const { data: questions, error: qError } = await supabase
      .from("mcq_attempt_questions")
      .select("*")
      .eq("attempt_id", attemptId)
      .order("question_index");

    if (qError) throw qError;

    // Fetch answers
    const { data: answers, error: aError } = await supabase
      .from("mcq_attempt_answers")
      .select("*")
      .eq("attempt_id", attemptId)
      .order("question_index");

    if (aError) throw aError;

    // Compute timer state for full_exam mode
    let timerState = null;
    if (attempt.timer_mode === "full_exam" && attempt.expires_at) {
      timerState = computeTimeRemaining(attempt.expires_at);
    }

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        subjectName: (attempt.subjects as unknown as { name: string })?.name,
        totalQuestions: attempt.total_questions,
        timerMode: attempt.timer_mode,
        timerValue: attempt.timer_value,
        currentIndex: attempt.current_index,
        status: attempt.status,
        expiresAt: attempt.expires_at,
      },
      questions: questions || [],
      answers: answers || [],
      timerState,
    });
  } catch (error) {
    console.error("[GET /api/mcq/[attemptId]/resume]", error);
    return NextResponse.json({ error: "Failed to resume attempt" }, { status: 500 });
  }
}
