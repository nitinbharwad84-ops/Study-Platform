import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/mcq/banks
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission("can_manage_content", req);

    const supabaseAdmin = createServerClient();

    const { data: banks, error } = await supabaseAdmin
      .from("mcq_question_banks")
      .select(`
        *,
        subjects (name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch question banks." }, { status: 500 });
    }

    return NextResponse.json({ banks });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}

/**
 * POST /api/admin/mcq/banks
 */
export async function POST(req: NextRequest) {
  try {
    await requirePermission("can_manage_content", req);
    const { name, subject_id, source_file } = await req.json();

    if (!name || !subject_id) {
      return NextResponse.json({ error: "Name and subject_id are required." }, { status: 400 });
    }

    const supabaseAdmin = createServerClient();

    const { data: bank, error } = await supabaseAdmin
      .from("mcq_question_banks")
      .insert({
        name,
        subject_id,
        source_file,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create question bank." }, { status: 500 });
    }

    return NextResponse.json({ bank });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
