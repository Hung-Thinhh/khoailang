"use client";

import { useEffect, useRef } from "react";

interface FloatingEmojisProps {
  emojis?: string[];
}

const DEFAULT_EMOJIS = ["🥔", "🌿", "🌱", "🍠", "🌾", "☘️", "🍃", "💧", "🌻", "🐛"];

export default function FloatingEmojis({
  emojis = DEFAULT_EMOJIS,
}: FloatingEmojisProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function createEmoji() {
        if (!container) return;
      const el = document.createElement("span");
      el.className = "floating-emoji";
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const x = Math.random() * 100;
      const size = 1.2 + Math.random() * 1.5;
      const duration = 6 + Math.random() * 8;
      const delay = Math.random() * 2;

      el.style.left = x + "%";
      el.style.fontSize = size + "rem";
      el.style.animationDuration = duration + "s";
      el.style.animationDelay = delay + "s";

      container.appendChild(el);

      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, (duration + delay) * 1000);
    }

    for (let i = 0; i < 8; i++) {
      setTimeout(createEmoji, i * 400);
    }

    const intervalId = setInterval(createEmoji, 2000);

    return () => {
      clearInterval(intervalId);
      if (container) {
          container.innerHTML = "";
      }
    };
  }, [emojis]);

  return <div className="floating-emojis" id="floatingEmojis" ref={containerRef}></div>;
}
