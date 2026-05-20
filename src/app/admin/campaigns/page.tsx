"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Campaign {
  id: number;
  name: string;
  total_slots: number;
  used_slots: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", total_slots: 100, start_date: "", end_date: "" });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
    if (data) setCampaigns(data);
  }

  async function toggleActive(id: number, current: boolean) {
    await supabase.from("campaigns").update({ is_active: !current }).eq("id", id);
    loadData();
  }

  async function createCampaign() {
    if (!form.name) return alert("Nhập tên chiến dịch");
    await supabase.from("campaigns").insert({
      name: form.name,
      total_slots: form.total_slots,
      used_slots: 0,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      is_active: true,
    });
    setShowForm(false);
    setForm({ name: "", total_slots: 100, start_date: "", end_date: "" });
    loadData();
  }

  async function deleteCampaign(id: number) {
    if (!confirm("Xóa chiến dịch này?")) return;
    await supabase.from("campaigns").delete().eq("id", id);
    loadData();
  }

  return (
    <div className="admin-page">
      <h1>🎉 Quản lý Campaigns</h1>
      <p className="admin-subtitle">{campaigns.length} chiến dịch</p>

      <button className="admin-create-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "✕ Đóng" : "+ Tạo chiến dịch mới"}
      </button>

      {showForm && (
        <div className="admin-form-card">
          <h3>Tạo chiến dịch mới</h3>
          <div className="admin-form-grid">
            <div>
              <label>Tên chiến dịch *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VD: Khuyến mãi tháng 6" />
            </div>
            <div>
              <label>Tổng slots</label>
              <input type="number" value={form.total_slots} onChange={e => setForm({ ...form, total_slots: Number(e.target.value) })} />
            </div>
            <div>
              <label>Ngày bắt đầu</label>
              <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <label>Ngày kết thúc</label>
              <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          <button className="admin-form-submit" onClick={createCampaign}>🎉 Tạo chiến dịch</button>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Slots</th>
              <th>Đã dùng</th>
              <th>Còn lại</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Active</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Chưa có chiến dịch nào</td></tr>
            ) : campaigns.map(c => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.total_slots}</td>
                <td>{c.used_slots}</td>
                <td><strong>{c.total_slots - c.used_slots}</strong></td>
                <td>{c.start_date ? new Date(c.start_date).toLocaleDateString("vi-VN") : "—"}</td>
                <td>{c.end_date ? new Date(c.end_date).toLocaleDateString("vi-VN") : "—"}</td>
                <td>
                  <span className={`admin-badge-sm ${c.is_active ? "green" : "red"}`}>
                    {c.is_active ? "Active" : "Off"}
                  </span>
                </td>
                <td className="admin-actions">
                  <button onClick={() => toggleActive(c.id, c.is_active)}>
                    {c.is_active ? "Tắt" : "Bật"}
                  </button>
                  <button className="danger" onClick={() => deleteCampaign(c.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
