"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TEMPLATE_HTML } from "@/data/template-html";

const TEMPLATES: Record<number, { name: string; category: string; thumbnail: string }> = {
  1: { name: "Sắp Ra Mắt – Xanh Lá", category: "Coming Soon", thumbnail: "🌱" },
  2: { name: "Sắp Ra Mắt – Tối Giản", category: "Coming Soon", thumbnail: "🌑" },
  3: { name: "Sắp Ra Mắt – Gradient", category: "Coming Soon", thumbnail: "💜" },
  4: { name: "Portfolio Lập Trình Viên", category: "Portfolio", thumbnail: "💻" },
  5: { name: "CV Cá Nhân", category: "Portfolio", thumbnail: "📄" },
  6: { name: "Portfolio Sáng Tạo", category: "Portfolio", thumbnail: "🎨" },
};

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const template = TEMPLATES[id];

  useEffect(() => {
    const header = document.getElementById("header");
    const footer = document.querySelector("footer.footer");
    if (header) header.style.display = "none";
    if (footer) (footer as HTMLElement).style.display = "none";
    return () => {
      if (header) header.style.display = "";
      if (footer) (footer as HTMLElement).style.display = "";
    };
  }, []);

  const html = TEMPLATE_HTML[id] || TEMPLATE_HTML[1];

  const handleChoose = () => {
    alert(`✅ Đã chọn template: ${template?.name || "Template"}`);
    window.close();
  };

  return (
    <div className="tpl-preview-page">
      {/* Header bar */}
      <div className="tpl-preview-header">
        <div className="tpl-preview-header-left">
          <span className="tpl-preview-thumb">{template?.thumbnail || "📄"}</span>
          <div>
            <strong>{template?.name || `Template #${id}`}</strong>
            <span className="tpl-preview-cat">{template?.category || "Template"}</span>
          </div>
        </div>
        <div className="tpl-preview-header-right">
          <button className="tpl-choose-btn" onClick={handleChoose}>
            ☑️ Chọn template này
          </button>
          <button className="tpl-close-btn" onClick={() => router.back()}>✕</button>
        </div>
      </div>

      {/* Preview iframe */}
      <iframe
        className="tpl-preview-iframe"
        srcDoc={html}
        sandbox="allow-scripts allow-same-origin"
        title="Template Preview"
      />

      {/* Footer notice */}
      <div className="tpl-preview-footer">
        👁 Đây là preview tĩnh · Nội dung thực tế có thể tùy chỉnh sau khi chọn
      </div>
    </div>
  );
}
