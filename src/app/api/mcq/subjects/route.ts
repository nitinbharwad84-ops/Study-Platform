import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * GET /api/mcq/subjects
 * Returns all active subjects with their active question counts.
 */
export async function GET() {
  try {
    const supabase = createServerClient();

    // Fetch active subjects
    const { data: subjects, error: subjectsError } = await supabase
      .from("subjects")
      .select("id, name, description, status")
      .eq("status", "active")
      .order("name");

    if (subjectsError) throw subjectsError;

    // Fetch question counts per subject (active questions only)
    const { data: counts, error: countsError } = await supabase
      .from("mcq_questions")
      .select("subject_id")
      .eq("status", "active");

    if (countsError) throw countsError;

    // Build count map
    const countMap: Record<string, number> = {};
    for (const q of counts || []) {
      countMap[q.subject_id] = (countMap[q.subject_id] || 0) + 1;
    }

    const result = (subjects || []).map((s) => ({
      ...s,
      question_count: countMap[s.id] || 0,
    }));

    return NextResponse.json({ subjects: result });
  } catch (error) {
    console.error("[GET /api/mcq/subjects]", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
