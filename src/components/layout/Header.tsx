"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`} id="header">
      <div className="container flex items-center justify-between">
        <Link href="/" className="logo">
          <span className="emoji">🥔</span>
          <div className="logo-text">
            <span className="logo-name">KHOAI.TO</span>
            <span className="logo-sub">Free Subdomain DNS</span>
          </div>
        </Link>
        <nav className={`nav ${isMenuOpen ? "active" : ""}`} id="nav">
          <Link href="/#features" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            🌿 Tính năng
          </Link>
          <Link href="/policy" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            📋 Chính sách
          </Link>
          <Link href="/garden" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            🌾 Vườn khoai
          </Link>
          <Link href="/garden" className="nav-cta" onClick={() => setIsMenuOpen(false)}>
            🌱 Dashboard
          </Link>
        </nav>
        <button
          className="mobile-menu-btn block md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
