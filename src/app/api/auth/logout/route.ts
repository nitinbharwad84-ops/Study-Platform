import { NextRequest, NextResponse } from "next/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

const ROLE_COOKIE = "sp-user-role";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });

    const supabase = createSSRClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return req.cookies.get(name)?.value; },
          set(name: string, value: string, options) { response.cookies.set(name, value, options); },
          remove(name: string, options) { response.cookies.set(name, "", { ...options, maxAge: 0 }); },
        },
      }
    );

    await supabase.auth.signOut();

    // Clear the role cookie too
    response.cookies.set(ROLE_COOKIE, "", {
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/logout]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
