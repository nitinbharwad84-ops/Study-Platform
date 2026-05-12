import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * POST /api/mcq/[attemptId]/navigate
 * Body: { index: number }
 * Updates the current_index of the attempt so it can be restored on resume.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params;
    const { index } = await req.json();

    if (index === undefined || index < 0) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { error } = await supabase
      .from("mcq_attempts")
      .update({ current_index: index, updated_at: new Date().toISOString() })
      .eq("id", attemptId)
      .eq("status", "in_progress");

    if (error) throw error;

    return NextResponse.json({ success: true, currentIndex: index });
  } catch (error) {
    console.error("[POST /api/mcq/[attemptId]/navigate]", error);
    return NextResponse.json({ error: "Failed to navigate" }, { status: 500 });
  }
}
