"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { checkAdmin } from "@/lib/admin";
import { signOut } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide global header/footer
    const header = document.getElementById("header");
    const footer = document.querySelector("footer.footer");
    if (header) header.style.display = "none";
    if (footer) (footer as HTMLElement).style.display = "none";

    checkAdmin().then(profile => {
      if (!profile) {
        router.replace("/");
      } else {
        setIsAuthorized(true);
      }
      setLoading(false);
    });

    return () => {
      if (header) header.style.display = "";
      if (footer) (footer as HTMLElement).style.display = "";
    };
  }, [router]);

  if (loading) {
    return (
      <div className="admin-loading">
        <p>🔒 Đang xác thực quyền admin...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="admin-loading">
        <p>⛔ Không có quyền truy cập</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link href="/admin">🥔 Admin</Link>
          <span className="admin-badge">khoai.to</span>
        </div>
        <nav className="admin-nav">
          <Link href="/admin" className="admin-nav-item">📊 Dashboard</Link>
          <Link href="/admin/users" className="admin-nav-item">👥 Users</Link>
          <Link href="/admin/subdomains" className="admin-nav-item">🌐 Subdomains</Link>
          <Link href="/admin/templates" className="admin-nav-item">📄 Templates</Link>
          <Link href="/admin/campaigns" className="admin-nav-item">🎉 Campaigns</Link>
          <Link href="/admin/dns-logs" className="admin-nav-item">📋 DNS Logs</Link>
        </nav>
        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-item">← Về trang chủ</Link>
          <button className="admin-logout" onClick={() => signOut()}>Đăng xuất</button>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
