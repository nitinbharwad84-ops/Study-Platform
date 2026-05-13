import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  return NextResponse.json({
    session_id: session?.id,
    session_email: session?.email,
    session_role: session?.role,
    cookies: req.cookies.getAll().map(c => c.name),
  });
}
