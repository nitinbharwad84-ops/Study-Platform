import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { computeWeights, weightedSample, shuffleArray, shuffleOptions } from "@/lib/mcq/anti-repeat";
import { computeExpiresAt } from "@/lib/mcq/timer";

import { getSession } from "@/lib/auth/session";

/**
 * POST /api/mcq/start
 * Body: { subjectId, count, timerMode, timerValue }
 *
 * 1. Validates subject has enough questions
 * 2. Fetches recent attempts for anti-repeat
 * 3. Selects questions with weighted randomization
 * 4. Shuffles options per question
 * 5. Creates mcq_attempts record
 * 6. Snapshots questions into mcq_attempt_questions
 * Returns: { attemptId }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subjectId, count, timerMode, timerValue } = body as {
      subjectId: string;
      count: number;
      timerMode: "per_question" | "full_exam" | "none";
      timerValue: number;
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const userId = session.id;

    // --- Validation ---
    if (!subjectId || !count || count < 1) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const supabase = createServerClient();

    // --- Fetch all active questions for subject ---
    const { data: allQuestions, error: qError } = await supabase
      .from("mcq_questions")
      .select("id, question, option_a, option_b, option_c, option_d, correct_option, explanation_a, explanation_b, explanation_c, explanation_d, difficulty, topic")
      .eq("subject_id", subjectId)
      .eq("status", "active");

    if (qError) throw qError;
    if (!allQuestions || allQuestions.length < count) {
      return NextResponse.json(
        { error: `Not enough questions. Available: ${allQuestions?.length ?? 0}, Requested: ${count}` },
        { status: 400 }
      );
    }

    // --- Fetch recent attempt question IDs for anti-repeat ---
    const { data: recentAttempts } = await supabase
      .from("mcq_attempts")
      .select("id")
      .eq("user_id", userId)
      .eq("subject_id", subjectId)
      .in("status", ["completed", "expired"])
      .order("started_at", { ascending: false })
      .limit(10);

    const recentAttemptQuestions: string[][] = [];

    if (recentAttempts && recentAttempts.length > 0) {
      for (const attempt of recentAttempts) {
        const { data: aqData } = await supabase
          .from("mcq_attempt_questions")
          .select("question_id")
          .eq("attempt_id", attempt.id);

        if (aqData) {
          recentAttemptQuestions.push(aqData.map((r) => r.question_id));
        }
      }
    }

    // --- Anti-repeat weighted selection ---
    const weights = computeWeights(
      allQuestions.map((q) => q.id),
      recentAttemptQuestions
    );
    const selectedIds = weightedSample(weights, count);

    // Shuffle question order
    const shuffledIds = shuffleArray(selectedIds);
    const selectedQuestions = shuffledIds
      .map((id) => allQuestions.find((q) => q.id === id)!)
      .filter(Boolean);

    // --- Create attempt record ---
    const now = new Date().toISOString();
    const expiresAt =
      timerMode === "full_exam"
        ? computeExpiresAt(now, timerValue)
        : null;

    const { data: attempt, error: attemptError } = await supabase
      .from("mcq_attempts")
      .insert({
        user_id: userId,
        subject_id: subjectId,
        total_questions: count,
        timer_mode: timerMode,
        timer_value: timerValue,
        status: "in_progress",
        current_index: 0,
        started_at: now,
        expires_at: expiresAt,
        updated_at: now,
      })
      .select("id")
      .single();

    if (attemptError || !attempt) throw attemptError ?? new Error("Failed to create attempt");

    // --- Snapshot questions into mcq_attempt_questions ---
    const snapshotRows = selectedQuestions.map((q, index) => {
      const { shuffled, newCorrectOption, shuffleMap } = shuffleOptions(
        { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
        q.correct_option
      );

      // Remap explanations to match shuffled option positions
      const explMap: Record<string, string> = {
        [q.option_a]: q.explanation_a,
        [q.option_b]: q.explanation_b,
        [q.option_c]: q.explanation_c,
        [q.option_d]: q.explanation_d,
      };

      return {
        attempt_id: attempt.id,
        question_index: index,
        question_id: q.id,
        question_text: q.question,
        option_a: shuffled.A,
        option_b: shuffled.B,
        option_c: shuffled.C,
        option_d: shuffled.D,
        correct_option: newCorrectOption,
        explanation_a: explMap[shuffled.A] || "",
        explanation_b: explMap[shuffled.B] || "",
        explanation_c: explMap[shuffled.C] || "",
        explanation_d: explMap[shuffled.D] || "",
        shuffle_map: shuffleMap,
      };
    });

    const { error: snapshotError } = await supabase
      .from("mcq_attempt_questions")
      .insert(snapshotRows);

    if (snapshotError) throw snapshotError;

    // --- Initialize answer placeholders ---
    const answerRows = Array.from({ length: count }, (_, i) => ({
      attempt_id: attempt.id,
      question_index: i,
      selected_option: null,
      is_correct: null,
      is_locked: false,
      is_flagged: false,
      answered_at: null,
      time_spent_sec: null,
    }));

    const { error: answerInitError } = await supabase
      .from("mcq_attempt_answers")
      .insert(answerRows);

    if (answerInitError) throw answerInitError;

    return NextResponse.json({ attemptId: attempt.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/mcq/start]", error);
    return NextResponse.json({ error: "Failed to start exam" }, { status: 500 });
  }
}
