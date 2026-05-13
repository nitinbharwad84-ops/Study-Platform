import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit/log";
import Papa from "papaparse";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/mcq-questions/import
 * Batch imports questions from a CSV/JSON payload.
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requirePermission("can_manage_content", req);
    const { csvData, format } = await req.json();

    if (!csvData) {
      return NextResponse.json({ error: "No data provided." }, { status: 400 });
    }

    let parsedRows: Record<string, string>[] = [];
    if (format === "csv") {
      const results = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      if (results.errors.length > 0) {
        return NextResponse.json({ error: "CSV Parsing Error", details: results.errors }, { status: 400 });
      }
      parsedRows = results.data as Record<string, string>[];
    } else {
      parsedRows = csvData as Record<string, string>[]; // Assume JSON
    }

    if (parsedRows.length === 0) {
      return NextResponse.json({ error: "Empty data set." }, { status: 400 });
    }

    const supabaseAdmin = createServerClient();

    // 1. Fetch all subjects to map name -> id
    const { data: subjects } = await supabaseAdmin.from("subjects").select("id, name");
    const subjectMap = new Map(subjects?.map(s => [s.name.toLowerCase(), s.id]));

    // 2. Map and Validate rows
    const questionsToInsert = parsedRows.map((row, index) => {
      const subjectName = (row.subject || "").toLowerCase().trim();
      const subjectId = subjectMap.get(subjectName);

      if (!subjectId) {
        throw new Error(`Row ${index + 1}: Subject "${row.subject}" not found.`);
      }

      return {
        subject_id: subjectId,
        question_text: row.question,
        options: {
          A: row.optionA,
          B: row.optionB,
          C: row.optionC,
          D: row.optionD
        },
        correct_option: row.correct?.toUpperCase(),
        explanations: {
          A: row.explanationA || "",
          B: row.explanationB || "",
          C: row.explanationC || "",
          D: row.explanationD || ""
        },
        difficulty: (row.difficulty || "medium").toLowerCase(),
        status: "active"
      };
    });

    // 3. Bulk Insert
    const { data: inserted, error } = await supabaseAdmin
      .from("mcq_questions")
      .insert(questionsToInsert)
      .select();

    if (error) {
      console.error("[import] insert error:", error);
      return NextResponse.json({ error: "Failed to insert questions.", details: error.message }, { status: 500 });
    }

    // 4. Log the event
    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      action: "batch_import_questions",
      entityType: "mcq_question",
      severity: "success",
      details: { count: inserted.length, format }
    });

    return NextResponse.json({
      success: true,
      count: inserted.length
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("[POST /api/admin/mcq-questions/import]", err);
    if (err.message?.includes("Row")) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return authErrorResponse(err);
  }
}
