import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateSummary } from "@/lib/mcq/scoring";

/**
 * GET /api/mcq/result/[attemptId]
 * Returns the score summary for the result screen.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params;
    const supabase = createServerClient();

    const { data: attempt, error } = await supabase
      .from("mcq_attempts")
      .select("*, subjects(name)")
      .eq("id", attemptId)
      .single();

    if (error || !attempt) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    if (attempt.status !== "completed" && attempt.status !== "expired") {
      return NextResponse.json({ error: "Exam not yet completed" }, { status: 400 });
    }

    const subjectName = (attempt.subjects as unknown as { name: string })?.name ?? "Subject";

    const summary = generateSummary(
      {
        score: attempt.score ?? 0,
        correct_count: attempt.correct_count ?? 0,
        wrong_count: attempt.wrong_count ?? 0,
        unanswered_count: attempt.unanswered_count ?? 0,
        total_questions: attempt.total_questions,
        percentage: parseFloat(attempt.percentage ?? "0"),
      },
      subjectName
    );

    return NextResponse.json({
      attemptId: attempt.id,
      subjectName,
      totalQuestions: attempt.total_questions,
      score: attempt.score ?? 0,
      percentage: parseFloat(attempt.percentage ?? "0"),
      correctCount: attempt.correct_count ?? 0,
      wrongCount: attempt.wrong_count ?? 0,
      unansweredCount: attempt.unanswered_count ?? 0,
      timerMode: attempt.timer_mode,
      completedAt: attempt.completed_at,
      startedAt: attempt.started_at,
      summary,
    });
  } catch (error) {
    console.error("[GET /api/mcq/result/[attemptId]]", error);
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 });
  }
}
