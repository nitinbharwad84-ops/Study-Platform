import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, reason } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createServerClient();

    // Find user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (userError || !user) {
      // Return 200 even if user not found to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    // Check if there's already a pending request
    const { data: existingRequest } = await supabaseAdmin
      .from("password_reset_requests")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .single();

    if (existingRequest) {
      // Again, pretend it succeeded or tell them it's pending
      return NextResponse.json({ 
        success: true, 
        message: "A password reset request is already pending for this account." 
      });
    }

    // Insert new request
    const { error: insertError } = await supabaseAdmin
      .from("password_reset_requests")
      .insert({
        user_id: user.id,
        email: email.toLowerCase().trim(),
        reason,
        status: "pending",
      });

    if (insertError) {
      console.error("[POST /api/auth/request-reset] Insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit request." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/request-reset]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
