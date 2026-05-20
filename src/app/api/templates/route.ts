import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// GET /api/templates - List all active templates
export async function GET() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("templates")
    .select("id, name, category, description, thumbnail, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
