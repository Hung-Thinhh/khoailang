import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// GET /api/subdomains - List user's subdomains
export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("subdomains")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/subdomains - Create new subdomain
export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, hosting_type, ip_address, template_id, html_content } = body;

  if (!name || name.length < 3 || !/^[a-z0-9-]+$/.test(name)) {
    return NextResponse.json({ error: "Tên subdomain không hợp lệ" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("subdomains")
    .select("id")
    .eq("name", name)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Subdomain đã tồn tại" }, { status: 409 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("max_subdomains")
    .eq("id", user.id)
    .single();

  const { count } = await supabase
    .from("subdomains")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (count !== null && profile && count >= profile.max_subdomains) {
    return NextResponse.json({ error: "Đã đạt giới hạn subdomain" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("subdomains")
    .insert({
      user_id: user.id,
      name,
      hosting_type,
      ip_address: hosting_type === "ip" ? ip_address : null,
      template_id: hosting_type === "html" ? template_id : null,
      html_content: hosting_type === "html" ? html_content : null,
      status: hosting_type === "html" ? "draft" : "published",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
