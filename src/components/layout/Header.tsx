"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signInWithGoogle, getSession, isAdmin } from "@/lib/auth";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check auth + admin
    getSession().then(session => {
      setIsLoggedIn(!!session);
      if (session) {
        isAdmin().then(admin => setShowAdmin(admin));
      }
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDashboardClick = async () => {
    setIsMenuOpen(false);
    if (isLoggedIn) {
      window.location.href = "/garden";
    } else {
      await signInWithGoogle();
    }
  };

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
          {showAdmin && (
            <Link href="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              🔒 Admin
            </Link>
          )}
          <button className="nav-cta" onClick={handleDashboardClick}>
            🌱 Dashboard
          </button>
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
