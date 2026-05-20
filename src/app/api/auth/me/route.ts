import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// GET /api/auth/me - Get current user profile
export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    id: user.id,
    email: user.email,
    ...profile,
  });
}
