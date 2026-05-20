"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  max_subdomains: number;
  credits: number;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setUsers(data);
  }

  async function toggleAdmin(userId: string, current: boolean) {
    await supabase.from("profiles").update({ is_admin: !current }).eq("id", userId);
    loadUsers();
  }

  async function updateSlots(userId: string, slots: number) {
    await supabase.from("profiles").update({ max_subdomains: slots }).eq("id", userId);
    loadUsers();
  }

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <h1>👥 Quản lý Users</h1>
      <p className="admin-subtitle">{users.length} users đã đăng ký</p>

      <input
        className="admin-search"
        placeholder="Tìm theo email hoặc tên..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Tên</th>
              <th>Admin</th>
              <th>Max Slots</th>
              <th>Credits</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.name || "—"}</td>
                <td>
                  <span className={`admin-badge-sm ${user.is_admin ? "green" : "gray"}`}>
                    {user.is_admin ? "Admin" : "User"}
                  </span>
                </td>
                <td>{user.max_subdomains}</td>
                <td>{user.credits}</td>
                <td>{new Date(user.created_at).toLocaleDateString("vi-VN")}</td>
                <td className="admin-actions">
                  <button onClick={() => toggleAdmin(user.id, user.is_admin)}>
                    {user.is_admin ? "Bỏ admin" : "Set admin"}
                  </button>
                  <button onClick={() => {
                    const slots = prompt("Số slots mới:", String(user.max_subdomains));
                    if (slots) updateSlots(user.id, Number(slots));
                  }}>
                    Sửa slots
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
