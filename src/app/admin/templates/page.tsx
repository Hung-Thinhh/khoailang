"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Template {
  id: number;
  name: string;
  category: string;
  thumbnail: string;
  is_active: boolean;
  sort_order: number;
  html?: string;
}

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editHtml, setEditHtml] = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data } = await supabase
      .from("templates")
      .select("id, name, category, thumbnail, is_active, sort_order")
      .order("sort_order");
    if (data) setTemplates(data);
  }

  async function toggleActive(id: number, current: boolean) {
    await supabase.from("templates").update({ is_active: !current }).eq("id", id);
    loadData();
  }

  async function deleteTemplate(id: number) {
    if (!confirm("Xóa template này?")) return;
    await supabase.from("templates").delete().eq("id", id);
    loadData();
  }

  async function openEditor(id: number) {
    const { data } = await supabase.from("templates").select("html").eq("id", id).single();
    if (data) {
      setEditHtml(data.html || "");
      setEditingId(id);
    }
  }

  async function saveTemplate() {
    if (!editingId) return;
    await supabase.from("templates").update({ html: editHtml }).eq("id", editingId);
    setEditingId(null);
    alert("✅ Đã lưu template!");
  }

  // Editor view
  if (editingId !== null) {
    const tmpl = templates.find(t => t.id === editingId);
    const lineCount = editHtml.split("\n").length;

    return (
      <div className="admin-editor-page">
        <div className="admin-editor-header">
          <div className="admin-editor-header-left">
            <button className="admin-editor-back" onClick={() => setEditingId(null)}>← Quay lại</button>
            <span className="admin-editor-title">{tmpl?.thumbnail} {tmpl?.name}</span>
            <span className="admin-badge-sm green">Template #{editingId}</span>
          </div>
          <div className="admin-editor-header-right">
            <button className="admin-editor-save" onClick={saveTemplate}>💾 Lưu vào DB</button>
          </div>
        </div>
        <div className="admin-editor-body">
          <div className="admin-editor-code">
            <div className="admin-editor-code-header">
              <span>📄 template.html</span>
              <span>{lineCount} dòng · {editHtml.length.toLocaleString()} ký tự</span>
            </div>
            <div className="admin-editor-code-wrapper">
              <div className="admin-editor-lines">
                {Array.from({ length: lineCount }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <textarea
                className="admin-editor-textarea"
                value={editHtml}
                onChange={e => setEditHtml(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
          <div className="admin-editor-preview">
            <div className="admin-editor-preview-header">👁 Preview</div>
            <iframe
              className="admin-editor-iframe"
              srcDoc={editHtml}
              sandbox="allow-scripts allow-same-origin"
              title="Template Preview"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>📄 Quản lý Templates</h1>
      <p className="admin-subtitle">{templates.length} templates</p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Icon</th>
              <th>Tên</th>
              <th>Category</th>
              <th>Order</th>
              <th>Active</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {templates.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td style={{ fontSize: "1.5rem" }}>{t.thumbnail}</td>
                <td><strong>{t.name}</strong></td>
                <td>{t.category}</td>
                <td>{t.sort_order}</td>
                <td>
                  <span className={`admin-badge-sm ${t.is_active ? "green" : "red"}`}>
                    {t.is_active ? "Active" : "Off"}
                  </span>
                </td>
                <td className="admin-actions">
                  <button onClick={() => openEditor(t.id)}>✏️ Sửa</button>
                  <button onClick={() => toggleActive(t.id, t.is_active)}>
                    {t.is_active ? "Tắt" : "Bật"}
                  </button>
                  <button className="danger" onClick={() => deleteTemplate(t.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
