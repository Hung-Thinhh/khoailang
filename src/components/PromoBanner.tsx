"use client";

import { useEffect, useState } from "react";

// Target date cố định cho countdown
const TARGET_DATE = new Date("2025-08-01T00:00:00");

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
}

function getTimeRemaining(): CountdownState {
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
  };
}

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState<CountdownState>(getTimeRemaining);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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
            <h3 className="promo-heading">Vườn khoai mở bán</h3>
            <p className="promo-subtitle">
              Cơ hội sở hữu Khoai.to của bạn trong hôm nay
            </p>
          </div>
        </div>

        {/* Center: Progress + Countdown */}
        <div className="promo-center">
          <div className="progress-bar-wrapper">
            <span className="progress-text">Còn 87 / 100 slot</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "13%" }}></div>
            </div>
            <span className="progress-text">13%</span>
          </div>
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
        </div>

        {/* Right: CTA */}
        <div className="promo-right">
          <a href="#" className="promo-cta-btn">
            🌱 Đã nhận ưu đãi
          </a>
        </div>
      </div>
    </section>
  );
}
