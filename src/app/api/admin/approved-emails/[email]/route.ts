import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";

/**
 * DELETE /api/admin/approved-emails/[email]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    await requirePermission("can_manage_admins", req);
    // decode email from URL
    const email = decodeURIComponent(params.email);

    const supabaseAdmin = createServerClient();

    const { error } = await supabaseAdmin
      .from("approved_emails")
      .delete()
      .eq("email", email);

    if (error) {
      return NextResponse.json({ error: "Failed to revoke approval." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
