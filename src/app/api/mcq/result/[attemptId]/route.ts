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

    console.log("[result] attempt.status from DB:", attempt.status, "| id:", attemptId);

    // Auto-complete if somehow still in_progress (e.g. complete API had a silent failure)
    if (attempt.status === "in_progress" || attempt.status === "expired") {
      if (attempt.status === "in_progress") {
        console.log("[result] Auto-completing in_progress attempt...");
        // Inline complete logic
        const { data: questions } = await supabase
          .from("mcq_attempt_questions")
          .select("question_index, correct_option")
          .eq("attempt_id", attemptId)
          .order("question_index");

        const { data: answers } = await supabase
          .from("mcq_attempt_answers")
          .select("question_index, selected_option, is_locked")
          .eq("attempt_id", attemptId)
          .order("question_index");

        const correctMap: Record<number, string> = {};
        for (const q of questions || []) {
          correctMap[q.question_index] = q.correct_option;
        }

        const { calculateScore } = await import("@/lib/mcq/scoring");
        const answerRecords = (answers || []).map((a) => ({
          selected_option: a.selected_option,
          correct_option: correctMap[a.question_index],
          is_locked: a.is_locked,
        }));
        const scoreResult = calculateScore(answerRecords);
        const now = new Date().toISOString();

        const { data: autoUpdated, error: autoErr } = await supabase
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
          .select("id, status, score, correct_count, wrong_count, unanswered_count, percentage, total_questions, timer_mode, completed_at, started_at")
          .single();

        console.log("[result] auto-update result:", autoUpdated, autoErr);

        if (autoUpdated) {
          // Update analytics in background
          const { updateAnalytics } = await import("@/lib/mcq/analytics");
          await updateAnalytics(supabase, attempt.user_id, attempt.subject_id, {
            total_questions: autoUpdated.total_questions,
            correct_count: scoreResult.correct_count,
            wrong_count: scoreResult.wrong_count,
            unanswered_count: scoreResult.unanswered_count,
            percentage: scoreResult.percentage,
          });

          const { generateSummary } = await import("@/lib/mcq/scoring");
          const subjectName = (attempt.subjects as unknown as { name: string })?.name ?? "Subject";
          const pct = scoreResult.percentage;
          return NextResponse.json({
            attemptId: autoUpdated.id,
            subjectName,
            totalQuestions: autoUpdated.total_questions,
            score: scoreResult.score,
            percentage: pct,
            correctCount: scoreResult.correct_count,
            wrongCount: scoreResult.wrong_count,
            unansweredCount: scoreResult.unanswered_count,
            timerMode: autoUpdated.timer_mode,
            completedAt: autoUpdated.completed_at,
            startedAt: autoUpdated.started_at,
            summary: generateSummary(scoreResult, subjectName),
          });
        }
      }

      // If expired or auto-complete failed, still return error
      if (attempt.status !== "expired") {
        return NextResponse.json({ error: "Exam not yet completed" }, { status: 400 });
      }
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
