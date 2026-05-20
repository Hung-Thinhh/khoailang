"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Subdomain {
  id: number;
  name: string;
  hosting_type: string;
  ip_address: string | null;
  status: string;
  dns_status: string;
  is_shared: boolean;
  created_at: string;
  profiles: { email: string; name: string } | null;
}

export default function AdminSubdomains() {
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data } = await supabase
      .from("subdomains")
      .select("*, profiles(email, name)")
      .order("created_at", { ascending: false });
    if (data) setSubdomains(data as unknown as Subdomain[]);
  }

  async function deleteSubdomain(id: number) {
    if (!confirm("Xóa subdomain này?")) return;
    await supabase.from("subdomains").delete().eq("id", id);
    loadData();
  }

  async function toggleDns(id: number, current: string) {
    const next = current === "active" ? "pending" : "active";
    await supabase.from("subdomains").update({ dns_status: next }).eq("id", id);
    loadData();
  }

  return (
    <div className="admin-page">
      <h1>🌐 Quản lý Subdomains</h1>
      <p className="admin-subtitle">{subdomains.length} subdomains</p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Subdomain</th>
              <th>Owner</th>
              <th>Loại</th>
              <th>IP</th>
              <th>DNS</th>
              <th>Status</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {subdomains.map(s => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong>.khoai.to</td>
                <td>{s.profiles?.email || "—"}</td>
                <td>{s.hosting_type}</td>
                <td><code>{s.ip_address || "—"}</code></td>
                <td>
                  <span className={`admin-badge-sm ${s.dns_status === "active" ? "green" : "yellow"}`}>
                    {s.dns_status}
                  </span>
                </td>
                <td>{s.status}</td>
                <td>{new Date(s.created_at).toLocaleDateString("vi-VN")}</td>
                <td className="admin-actions">
                  <button onClick={() => toggleDns(s.id, s.dns_status)}>
                    {s.dns_status === "active" ? "Tắt DNS" : "Bật DNS"}
                  </button>
                  <button className="danger" onClick={() => deleteSubdomain(s.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
