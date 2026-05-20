"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PlantModal from "@/components/PlantModal";

interface SubdomainEntry {
  id: number;
  name: string;
  domain: string;
  ip: string;
  type: string;
  category: string;
  shared: boolean;
  updatedAt: string;
}

const MOCK_DATA: SubdomainEntry[] = [
  {
    id: 1,
    name: "myass1",
    domain: ".khoai.to",
    ip: "45.77.246.20",
    type: "Preview",
    category: "Trang HTML",
    shared: false,
    updatedAt: "18/05/2026",
  },
];

export default function GardenPage() {
  const [subdomains] = useState<SubdomainEntry[]>(MOCK_DATA);
  const [showPlantModal, setShowPlantModal] = useState(false);

  useEffect(() => {
    // Hide global header and footer on dashboard page
    const header = document.getElementById("header");
    const footer = document.querySelector("footer.footer");
    if (header) header.style.display = "none";
    if (footer) (footer as HTMLElement).style.display = "none";
    return () => {
      if (header) header.style.display = "";
      if (footer) (footer as HTMLElement).style.display = "";
    };
  }, []);

  const totalSlots = 1;
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
              <span className="dashboard-avatar">H</span>
              <span>Hung Thinh Nguyễn</span>
            </div>
            <button className="dashboard-logout">Đăng xuất</button>
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
            <div className="stat-value">0</div>
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
                    <span className="subdomain-status">🟢</span>
                    <strong>{item.name}</strong>{item.domain}
                    <span className="subdomain-icons">📋 🔗 👁 {item.type}</span>
                  </td>
                  <td><code className="ip-badge">{item.ip}</code></td>
                  <td>
                    <span className="badge badge--free">🔓 Miễn phí</span>
                    <span className="badge badge--html">🌐 {item.category}</span>
                  </td>
                  <td>
                    <label className="toggle">
                      <input type="checkbox" checked={item.shared} readOnly />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td>{item.updatedAt}</td>
                  <td className="td-actions">
                    <Link href={`/dashboard/editor/${item.id}`} className="action-btn action-btn--edit">✏️ Chỉnh sửa trang</Link>
                    <button className="action-btn action-btn--delete">🗑️ Xóa</button>
                  </td>
                </tr>
              ))}
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
