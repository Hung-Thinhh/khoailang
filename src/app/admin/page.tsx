"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalUsers: number;
  totalSubdomains: number;
  activeSubdomains: number;
  totalTemplates: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalSubdomains: 0, activeSubdomains: 0, totalTemplates: 0 });

  useEffect(() => {
    async function loadStats() {
      const [users, subdomains, active, templates] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("subdomains").select("*", { count: "exact", head: true }),
        supabase.from("subdomains").select("*", { count: "exact", head: true }).eq("dns_status", "active"),
        supabase.from("templates").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        totalUsers: users.count || 0,
        totalSubdomains: subdomains.count || 0,
        activeSubdomains: active.count || 0,
        totalTemplates: templates.count || 0,
      });
    }
    loadStats();
  }, []);

  return (
    <div className="admin-page">
      <h1>📊 Admin Dashboard</h1>
      <p className="admin-subtitle">Tổng quan hệ thống khoai.to</p>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-icon">👥</span>
          <div className="admin-stat-value">{stats.totalUsers}</div>
          <div className="admin-stat-label">Tổng Users</div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">🌐</span>
          <div className="admin-stat-value">{stats.totalSubdomains}</div>
          <div className="admin-stat-label">Tổng Subdomains</div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">✅</span>
          <div className="admin-stat-value">{stats.activeSubdomains}</div>
          <div className="admin-stat-label">DNS Active</div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📄</span>
          <div className="admin-stat-value">{stats.totalTemplates}</div>
          <div className="admin-stat-label">Templates</div>
        </div>
      </div>
    </div>
  );
}
