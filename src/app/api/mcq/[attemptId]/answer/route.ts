import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * POST /api/mcq/[attemptId]/answer
 * Body: { questionIndex: number, selectedOption: "A"|"B"|"C"|"D" }
 *
 * Locks the answer for a specific question index.
 * Idempotent-safe: returns 409 if already locked.
 * Persists immediately — no client-side trust.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params;
    const body = await req.json();
    const { questionIndex, selectedOption } = body as {
      questionIndex: number;
      selectedOption: "A" | "B" | "C" | "D";
    };

    if (questionIndex === undefined || !selectedOption) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Validate attempt exists and is in_progress
    const { data: attempt, error: attemptError } = await supabase
      .from("mcq_attempts")
      .select("id, status, timer_mode, expires_at")
      .eq("id", attemptId)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }
    if (attempt.status !== "in_progress") {
      return NextResponse.json({ error: "Attempt is not active" }, { status: 409 });
    }

    // Check if already locked — prevent re-submission
    const { data: existing, error: existError } = await supabase
      .from("mcq_attempt_answers")
      .select("is_locked, selected_option")
      .eq("attempt_id", attemptId)
      .eq("question_index", questionIndex)
      .single();

    if (existError) throw existError;

    if (existing?.is_locked) {
      return NextResponse.json(
        { error: "Answer already locked", lockedOption: existing.selected_option },
        { status: 409 }
      );
    }

    // Get the correct option from the snapshot
    const { data: snapshot, error: snapError } = await supabase
      .from("mcq_attempt_questions")
      .select("correct_option")
      .eq("attempt_id", attemptId)
      .eq("question_index", questionIndex)
      .single();

    if (snapError || !snapshot) {
      return NextResponse.json({ error: "Question not found in attempt" }, { status: 404 });
    }

    const isCorrect = selectedOption === snapshot.correct_option;

    // Persist the locked answer
    const { error: updateError } = await supabase
      .from("mcq_attempt_answers")
      .update({
        selected_option: selectedOption,
        is_correct: isCorrect,
        is_locked: true,
        answered_at: new Date().toISOString(),
      })
      .eq("attempt_id", attemptId)
      .eq("question_index", questionIndex);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      isCorrect,
      correctOption: snapshot.correct_option,
    });
  } catch (error) {
    console.error("[POST /api/mcq/[attemptId]/answer]", error);
    return NextResponse.json({ error: "Failed to lock answer" }, { status: 500 });
  }
}
