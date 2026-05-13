import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getSession, authErrorResponse } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit/log";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/user/profile
 * Allows users to update their own profile details.
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName } = await req.json();

    if (!firstName || !lastName) {
      return NextResponse.json({ error: "First and last name are required" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { error } = await supabase
      .from("users")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      })
      .eq("id", session.id);

    if (error) {
      console.error("[PATCH /api/user/profile] DB Error:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    // Log the event
    await logAuditEvent({
      actorId: session.id,
      actorEmail: session.email,
      action: "update_profile_success",
      entityType: "user",
      entityId: session.id,
      severity: "info",
      details: { firstName, lastName }
    });

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
