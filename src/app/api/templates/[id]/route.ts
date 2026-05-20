import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// GET /api/templates/[id] - Get template with HTML content
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) return NextResponse.json({ error: "Template not found" }, { status: 404 });
  return NextResponse.json(data);
}
