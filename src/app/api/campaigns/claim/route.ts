import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// POST /api/campaigns/claim - Claim a free slot from active campaign
export async function POST() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  // Get active campaign
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!campaign) {
    return NextResponse.json({ error: "Không có chiến dịch nào đang diễn ra" }, { status: 404 });
  }

  // Check if campaign has slots left
  if (campaign.used_slots >= campaign.total_slots) {
    return NextResponse.json({ error: "Hết slot! Chiến dịch đã đầy." }, { status: 409 });
  }

  // Check if campaign expired
  if (campaign.end_date && new Date(campaign.end_date) < new Date()) {
    return NextResponse.json({ error: "Chiến dịch đã kết thúc" }, { status: 410 });
  }

  // Check if user already claimed this campaign (prevent spam)
  const { data: existingClaim } = await supabase
    .from("campaign_claims")
    .select("id")
    .eq("user_id", user.id)
    .eq("campaign_id", campaign.id)
    .single();

  if (existingClaim) {
    return NextResponse.json({ error: "Bạn đã nhận slot từ chiến dịch này rồi!" }, { status: 409 });
  }

  // Claim: increase user's max_subdomains by 1
  const { data: profile } = await supabase
    .from("profiles")
    .select("max_subdomains")
    .eq("id", user.id)
    .single();

  const newMax = (profile?.max_subdomains || 1) + 1;

  await supabase
    .from("profiles")
    .update({ max_subdomains: newMax })
    .eq("id", user.id);

  // Record the claim
  await supabase
    .from("campaign_claims")
    .insert({
      user_id: user.id,
      campaign_id: campaign.id,
    });

  // Increment used_slots
  await supabase
    .from("campaigns")
    .update({ used_slots: campaign.used_slots + 1 })
    .eq("id", campaign.id);

  return NextResponse.json({
    success: true,
    message: `Đã nhận +1 slot! Bạn có ${newMax} slots.`,
    new_max: newMax,
  });
}
