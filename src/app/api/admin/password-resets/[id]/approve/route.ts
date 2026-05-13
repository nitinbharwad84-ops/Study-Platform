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
      .select("id, user_id, status")
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

    // 2. Generate a secure token (using crypto API or simple UUID for now)
    const token = crypto.randomUUID();
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24); // 24 hour expiry

    // 3. Update the request
    const { error: updateError } = await supabaseAdmin
      .from("password_reset_requests")
      .update({
        status: "approved",
        reviewed_by: session.id,
        reviewed_at: new Date().toISOString(),
        reset_token: token,
        token_expires_at: tokenExpiresAt.toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("[POST /api/admin/password-resets/[id]/approve]", updateError);
      return NextResponse.json({ error: "Failed to approve request." }, { status: 500 });
    }

    // Note: In a real app, you would send an email here with the link:
    // https://yourdomain.com/forgot-password/reset?token=abc...
    // For this MVP, we will assume the admin copies the link from the UI
    // or we just allow the user to see their approved state.
    // Actually, to make it work without SMTP, we will just return the link to the admin
    // so they can share it with the user out of band.

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/forgot-password/reset?token=${token}`;

    return NextResponse.json({ 
      success: true,
      resetLink,
    });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
