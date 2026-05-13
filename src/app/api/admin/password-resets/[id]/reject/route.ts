import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission("can_approve_resets", req);
    const { id } = params;

    const supabaseAdmin = createServerClient();

    // 1. Verify request is pending
    const { data: resetRequest, error: fetchError } = await supabaseAdmin
      .from("password_reset_requests")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !resetRequest) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    if (resetRequest.status !== "pending") {
      return NextResponse.json(
        { error: `Request is already ${resetRequest.status}.` },
        { status: 400 }
      );
    }

    // 2. Update the request to rejected
    const { error: updateError } = await supabaseAdmin
      .from("password_reset_requests")
      .update({
        status: "rejected",
        reviewed_by: session.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("[POST /api/admin/password-resets/[id]/reject]", updateError);
      return NextResponse.json({ error: "Failed to reject request." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
