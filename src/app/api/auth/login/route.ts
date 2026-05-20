import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// POST /api/auth/login - Initiate Google OAuth
export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: data.url });
}
