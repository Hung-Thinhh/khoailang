"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface DnsLog {
  id: number;
  action: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  subdomains: { name: string } | null;
}

export default function AdminDnsLogs() {
  const [logs, setLogs] = useState<DnsLog[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from("dns_logs")
        .select("*, subdomains(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (data) setLogs(data as unknown as DnsLog[]);
    }
    loadData();
  }, []);

  return (
    <div className="admin-page">
      <h1>📋 DNS Logs</h1>
      <p className="admin-subtitle">100 logs gần nhất</p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Subdomain</th>
              <th>Action</th>
              <th>Old</th>
              <th>New</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>Chưa có logs</td></tr>
            ) : logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleString("vi-VN")}</td>
                <td><strong>{log.subdomains?.name || "—"}</strong>.khoai.to</td>
                <td><span className="admin-badge-sm yellow">{log.action}</span></td>
                <td><code>{log.old_value || "—"}</code></td>
                <td><code>{log.new_value || "—"}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
