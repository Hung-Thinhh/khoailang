"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUser } from "@/lib/auth";

interface Campaign {
  id: number;
  name: string;
  total_slots: number;
  used_slots: number;
  end_date: string | null;
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
}

export default function PromoBanner() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [timeLeft, setTimeLeft] = useState<CountdownState>({ days: 0, hours: 0, minutes: 0 });
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    // Fetch active campaign
    async function load() {
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setCampaign(data);
        // Check if user already claimed
        const user = await getUser();
        if (user) {
          const { data: claim } = await supabase
            .from("campaign_claims")
            .select("id")
            .eq("user_id", user.id)
            .eq("campaign_id", data.id)
            .single();
          if (claim) setClaimed(true);
        }
      }
    }
    load();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!campaign?.end_date) return;
    const target = new Date(campaign.end_date);

    function update() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [campaign]);

  async function handleClaim() {
    setClaiming(true);
    try {
      const res = await fetch("/api/campaigns/claim", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setClaimed(true);
        alert(data.message);
        // Refresh campaign data
        if (campaign) {
          setCampaign({ ...campaign, used_slots: campaign.used_slots + 1 });
        }
      } else {
        alert(data.error);
      }
    } catch {
      alert("Lỗi kết nối");
    }
    setClaiming(false);
  }

  // Don't render if no campaign
  if (!campaign) return null;

  const slotsLeft = campaign.total_slots - campaign.used_slots;
  const usedPercent = Math.round((campaign.used_slots / campaign.total_slots) * 100);

  return (
    <section className="promo-banner" id="promo">
      <div className="container promo-row">
        {/* Left: Badge + Title */}
        <div className="promo-left">
          <span className="promo-badge">
            <span>🎉</span>
            KHUYẾN MÃI
          </span>
          <div className="promo-main">
            <h3 className="promo-heading">{campaign.name}</h3>
            <p className="promo-subtitle">
              Cơ hội sở hữu Khoai.to của bạn trong hôm nay
            </p>
          </div>
        </div>

        {/* Center: Progress + Countdown */}
        <div className="promo-center">
          <div className="progress-bar-wrapper">
            <span className="progress-text">Còn {slotsLeft} / {campaign.total_slots} slot</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${usedPercent}%` }}></div>
            </div>
            <span className="progress-text">{usedPercent}%</span>
          </div>
          {campaign.end_date && (
            <div className="promo-countdown">
              <span className="countdown-label">⏱ Kết thúc sau:</span>
              <div className="countdown-timer">
                <span className="countdown-unit" suppressHydrationWarning>
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="countdown-separator">ngày</span>
                <span className="countdown-colon">:</span>
                <span className="countdown-unit" suppressHydrationWarning>
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="countdown-separator">giờ</span>
                <span className="countdown-colon">:</span>
                <span className="countdown-unit" suppressHydrationWarning>
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="countdown-separator">phút</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: CTA */}
        <div className="promo-right">
          {claimed ? (
            <span className="promo-cta-btn promo-cta-claimed">✅ Đã nhận ưu đãi</span>
          ) : (
            <button
              className="promo-cta-btn"
              onClick={handleClaim}
              disabled={claiming || slotsLeft <= 0}
            >
              {claiming ? "⏳..." : slotsLeft <= 0 ? "Hết slot" : "🌱 Nhận +1 subdomain miễn phí"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
