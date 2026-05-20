import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// Google OAuth callback handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/garden", request.url));
}
