"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PlantModal from "@/components/PlantModal";
import { getUser, signOut, signInWithGoogle } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface SubdomainEntry {
  id: number;
  name: string;
  hosting_type: string;
  ip_address: string | null;
  status: string;
  dns_status: string;
  is_shared: boolean;
  template_id: number | null;
  created_at: string;
  updated_at: string;
}

interface ProfileData {
  max_subdomains: number;
  credits: number;
}

export default function GardenPage() {
  const [subdomains, setSubdomains] = useState<SubdomainEntry[]>([]);
  const [profile, setProfile] = useState<ProfileData>({ max_subdomains: 1, credits: 0 });
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [userName, setUserName] = useState("Người dùng");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide global header and footer
    const header = document.getElementById("header");
    const footer = document.querySelector("footer.footer");
    if (header) header.style.display = "none";
    if (footer) (footer as HTMLElement).style.display = "none";

    // Check auth and load data
    getUser().then(async user => {
      if (!user) {
        signInWithGoogle();
      } else {
        setUserName(user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Người dùng");
        
        // Load profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("max_subdomains, credits")
          .eq("id", user.id)
          .single();
        if (profileData) setProfile(profileData);

        // Load subdomains
        const { data: subData } = await supabase
          .from("subdomains")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (subData) setSubdomains(subData);
        
        setLoading(false);
      }
    });

    return () => {
      if (header) header.style.display = "";
      if (footer) (footer as HTMLElement).style.display = "";
    };
  }, []);

  const totalSlots = profile.max_subdomains;
  const usedSlots = subdomains.length;
  const freeSlots = totalSlots - usedSlots;

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-nav">
        <div className="dashboard-nav-inner">
          <div className="dashboard-nav-left">
            <Link href="/" className="dashboard-logo">🥔 khoai.to</Link>
            <span className="dashboard-nav-sep">|</span>
            <span className="dashboard-nav-item active">🌿 Vườn của bạn</span>
            <Link href="/garden" className="dashboard-nav-badge">🌾 Vườn khoai</Link>
          </div>
          <div className="dashboard-nav-right">
            <div className="dashboard-user">
              <span className="dashboard-avatar">{userName.charAt(0).toUpperCase()}</span>
              <span>{userName}</span>
            </div>
            <button className="dashboard-logout" onClick={() => signOut()}>Đăng xuất</button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="dashboard-container">
        <div className="dashboard-breadcrumb">
          <Link href="/">🏠 Trang chủ</Link>
          <span>/</span>
          <span>🌿 Vườn Khoai</span>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card stat-card--green">
            <div className="stat-label">🥔 KHOAI MIỄN PHÍ</div>
            <div className="stat-value">{usedSlots} <span className="stat-total">/ {totalSlots}</span></div>
            <div className="stat-bar">
              <div className="stat-bar-fill" style={{ width: `${(usedSlots / totalSlots) * 100}%` }}></div>
            </div>
          </div>
          <div className="stat-card stat-card--yellow">
            <div className="stat-label">💎 CREDITS CÒN LẠI</div>
            <div className="stat-value">{profile.credits}</div>
            <div className="stat-sub">Đã dùng: 0 credits</div>
          </div>
          <div className="stat-card stat-card--blue">
            <div className="stat-label">🌱 TỔNG ĐÃ TRỒNG</div>
            <div className="stat-value">{usedSlots} <span className="stat-total">/ {totalSlots}</span></div>
            <div className="stat-sub">Còn {freeSlots} ô đất trống</div>
            <div className="stat-bar stat-bar--blue">
              <div className="stat-bar-fill" style={{ width: `${(usedSlots / totalSlots) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="dashboard-alert dashboard-alert--warning">
          <span className="alert-icon">⚠️</span>
          <p>Bạn đã trồng đầy vườn! ({usedSlots}/{totalSlots} ô đất). Vui lòng <a href="mailto:admin@khoai.to">liên hệ admin</a> để được cấp thêm đất.</p>
        </div>

        {/* Subdomain List */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>🌿 Danh sách Subdomain</h2>
            <p>{usedSlots} subdomain · {freeSlots} ô đất trống</p>
          </div>
          <button className="btn-plant" onClick={() => setShowPlantModal(true)}>🌱 Trồng thêm</button>
        </div>

        <div className="dashboard-table-wrapper">
          <div className="dashboard-table-header">
            <span>📋 Danh sách đang trồng</span>
            <span className="table-count">{usedSlots} bản ghi</span>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>SUBDOMAIN</th>
                <th>IP ADDRESS</th>
                <th>LOẠI</th>
                <th>CHIA SẺ</th>
                <th>CẬP NHẬT</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {subdomains.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td className="td-subdomain">
                    <span className="subdomain-status">{item.dns_status === "active" ? "🟢" : "🟡"}</span>
                    <strong>{item.name}</strong>.khoai.to
                    <span className="subdomain-icons">
                      <a href={`/s/${item.name}`} target="_blank" rel="noopener noreferrer" className="preview-link">
                        {item.hosting_type === "html" ? "👁 Preview" : "🔗 IP"}
                      </a>
                    </span>
                  </td>
                  <td><code className="ip-badge">{item.ip_address || "—"}</code></td>
                  <td>
                    <span className="badge badge--free">🔓 Miễn phí</span>
                    <span className="badge badge--html">
                      {item.hosting_type === "html" ? "🌐 Trang HTML" : "🔗 Trỏ IP"}
                    </span>
                  </td>
                  <td>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={item.is_shared}
                        onChange={async () => {
                          await supabase.from("subdomains").update({ is_shared: !item.is_shared }).eq("id", item.id);
                          setSubdomains(prev => prev.map(s => s.id === item.id ? { ...s, is_shared: !s.is_shared } : s));
                        }}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td>{new Date(item.updated_at).toLocaleDateString("vi-VN")}</td>
                  <td className="td-actions">
                    {item.hosting_type === "html" && (
                      <Link href={`/dashboard/editor/${item.template_id || item.id}`} className="action-btn action-btn--edit">✏️ Chỉnh sửa trang</Link>
                    )}
                    <button
                      className="action-btn action-btn--delete"
                      onClick={async () => {
                        if (!confirm(`Xóa ${item.name}.khoai.to?`)) return;
                        await supabase.from("subdomains").delete().eq("id", item.id);
                        setSubdomains(prev => prev.filter(s => s.id !== item.id));
                      }}
                    >🗑️ Xóa</button>
                  </td>
                </tr>
              ))}
              {subdomains.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    Chưa có subdomain nào. Nhấn &quot;Trồng thêm&quot; để bắt đầu!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info notices */}
        <div className="dashboard-alert dashboard-alert--info">
          <span className="alert-icon">ℹ️</span>
          <p>DNS propagation mất 1-5 phút. Mỗi tài khoản được <strong>1 subdomain miễn phí</strong>. Cần thêm đất? <a href="mailto:admin@khoai.to">Liên hệ admin</a> để được nâng cấp.</p>
        </div>
        <div className="dashboard-alert dashboard-alert--success">
          <span className="alert-icon">🌐</span>
          <p>Bật nút <strong>Chia sẻ</strong> trên subdomain để xuất hiện tại <Link href="/garden"><strong>Vườn Khoai</strong></Link> — nơi mọi người có thể tham khảo và tìm cảm hứng đặt tên.</p>
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          © 2026 khoai.to - Vườn Khoai to🥔
        </div>
      </div>

      {showPlantModal && <PlantModal onClose={() => setShowPlantModal(false)} />}
    </div>
  );
}
