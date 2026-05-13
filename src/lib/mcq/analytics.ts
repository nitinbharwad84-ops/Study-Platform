import { SupabaseClient } from "@supabase/supabase-js";

export interface ScoreSummary {
  total_questions: number;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  percentage: number;
}

/**
 * Upserts analytics for a user and subject based on an exam result.
 */
export async function updateAnalytics(
  supabase: SupabaseClient,
  userId: string,
  subjectId: string,
  scoreResult: ScoreSummary
) {
  const now = new Date().toISOString();

  // Fetch existing analytics
  const { data: existing } = await supabase
    .from("mcq_analytics")
    .select("*")
    .eq("user_id", userId)
    .eq("subject_id", subjectId)
    .single();

  if (existing) {
    const newTotal = existing.total_attempts + 1;
    const newTotalQ = existing.total_questions + scoreResult.total_questions;
    const newCorrect = existing.total_correct + scoreResult.correct_count;
    const newWrong = existing.total_wrong + scoreResult.wrong_count;
    const newUnanswered = existing.total_unanswered + scoreResult.unanswered_count;
    const newAvg = newTotalQ > 0 ? Math.round((newCorrect / newTotalQ) * 10000) / 100 : 0;

    return await supabase
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
      .eq("user_id", userId)
      .eq("subject_id", subjectId);
  } else {
    return await supabase.from("mcq_analytics").insert({
      user_id: userId,
      subject_id: subjectId,
      total_attempts: 1,
      total_questions: scoreResult.total_questions,
      total_correct: scoreResult.correct_count,
      total_wrong: scoreResult.wrong_count,
      total_unanswered: scoreResult.unanswered_count,
      avg_score_pct: scoreResult.percentage,
      last_attempt_at: now,
      updated_at: now,
    });
  }
}
