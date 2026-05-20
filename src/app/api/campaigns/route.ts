import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// GET /api/campaigns - Get current active campaign (only 1 at a time)
export async function GET() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ campaign: null });
  }

  return NextResponse.json({ campaign: data });
}
