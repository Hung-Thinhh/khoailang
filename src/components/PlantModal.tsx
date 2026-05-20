"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATE_HTML } from "@/data/template-html";

const TEMPLATES = [
  { id: 1, name: "Sắp Ra Mắt – Xanh Lá", category: "Coming Soon", description: "Trang chờ chủ đề xanh lá tươi, có đồng hồ đếm ngược JS và ô nhập email.", thumbnail: "🌱" },
  { id: 2, name: "Sắp Ra Mắt – Tối Giản", category: "Coming Soon", description: "Thiết kế tối giản kiểu dark, chữ to, đẹp mắt và sang trọng.", thumbnail: "🌑" },
  { id: 3, name: "Sắp Ra Mắt – Gradient", category: "Coming Soon", description: "Nền gradient tím-hồng sống động, phong cách hiện đại, kết hợp với thanh tiến trình.", thumbnail: "💜" },
  { id: 4, name: "Portfolio Lập Trình Viên", category: "Portfolio", description: "Portfolio dành cho developer: giới thiệu bản thân, kỹ năng, dự án và liên hệ.", thumbnail: "💻" },
  { id: 5, name: "CV Cá Nhân", category: "Portfolio", description: "CV online dạng một trang, có ảnh đại diện, kinh nghiệm và học vấn.", thumbnail: "📄" },
  { id: 6, name: "Portfolio Sáng Tạo", category: "Portfolio", description: "Portfolio nghệ thuật với layout bất đối xứng, phong cách bold và màu sắc nổi bật.", thumbnail: "🎨" },
  { id: 7, name: "Landing Page Sản Phẩm", category: "Landing Page", description: "Trang giới thiệu sản phẩm với hero section, tính năng và call-to-action mạnh.", thumbnail: "🚀" },
  { id: 8, name: "Landing Page Dịch Vụ", category: "Landing Page", description: "Giới thiệu dịch vụ chuyên nghiệp với testimonials, pricing và form liên hệ.", thumbnail: "🏢" },
  { id: 9, name: "Nhà Hàng", category: "Nhà Hàng & Ẩm Thực", description: "Trang giới thiệu nhà hàng với menu nổi bật, giờ mở cửa và bản đồ địa chỉ.", thumbnail: "🍽️" },
  { id: 10, name: "Quán Cà Phê", category: "Nhà Hàng & Ẩm Thực", description: "Landing page cho quán cà phê với menu đồ uống, không gian và địa chỉ.", thumbnail: "☕" },
  { id: 11, name: "Sự Kiện / Hội Nghị", category: "Sự Kiện", description: "Trang giới thiệu sự kiện với lịch trình, diễn giả và đăng ký tham dự.", thumbnail: "🎤" },
  { id: 12, name: "Tiệc / Buổi Biểu Diễn", category: "Sự Kiện", description: "Trang sự kiện nhạc sống, party hoặc show diễn với bầu không khí sôi động.", thumbnail: "🎵" },
  { id: 13, name: "Blog Cá Nhân", category: "Cá Nhân", description: "Trang blog cá nhân với danh sách bài viết, giới thiệu tác giả và newsletter.", thumbnail: "✍️" },
  { id: 14, name: "Link in Bio", category: "Cá Nhân", description: "Trang tổng hợp link dành cho mạng xã hội, kiểu Linktree. Đẹp, đơn giản.", thumbnail: "🔗" },
  { id: 15, name: "Giới Thiệu Công Ty", category: "Doanh Nghiệp", description: "Trang giới thiệu công ty chuyên nghiệp với đội ngũ, dịch vụ và liên hệ.", thumbnail: "🏢" },
  { id: 16, name: "Cửa Hàng Online", category: "Doanh Nghiệp", description: "Trang giới thiệu cửa hàng online với sản phẩm nổi bật và giỏ hàng đơn giản.", thumbnail: "🛍️" },
  { id: 17, name: "CV Matrix Dark", category: "CV Cá Nhân", description: "CV nền đen với hiệu ứng mưa ký tự matrix xanh lá, thanh kỹ năng animated.", thumbnail: "💻" },
  { id: 18, name: "CV Timeline Reveal", category: "CV Cá Nhân", description: "CV với timeline dọc, các mục hiện ra mượt mà khi cuộn trang.", thumbnail: "📋" },
  { id: 19, name: "CV Neon Cyberpunk", category: "CV Cá Nhân", description: "CV phong cách cyberpunk neon tím hồng, chữ glitch và các ô kỹ năng phát sáng.", thumbnail: "⚡" },
  { id: 20, name: "CV 3D Glass Card", category: "CV Cá Nhân", description: "CV phong cách glassmorphism với hiệu ứng 3D tilt khi di chuyển chuột.", thumbnail: "🔮" },
  { id: 21, name: "Portfolio Particle Network", category: "Portfolio", description: "Portfolio với mạng lưới hạt particles canvas tương tác theo chuột.", thumbnail: "✨" },
  { id: 22, name: "Portfolio 3D Tilt", category: "Portfolio", description: "Portfolio tối giản với hiệu ứng 3D perspective tilt trên từng project card.", thumbnail: "🎯" },
  { id: 23, name: "Portfolio Neon Glitch", category: "Portfolio", description: "Portfolio phong cách neon với hiệu ứng glitch text, glow và màu tím hồng.", thumbnail: "🌈" },
  { id: 24, name: "Portfolio Typewriter", category: "Portfolio", description: "Portfolio tối giản với hiệu ứng typewriter gõ chữ, scroll reveal mượt mà.", thumbnail: "⌨️" },
  { id: 25, name: "Landing SaaS Counter", category: "Landing Page", description: "Landing page SaaS chuyên nghiệp với số liệu animated counter.", thumbnail: "📈" },
  { id: 26, name: "Landing Wave Hero", category: "Landing Page", description: "Landing page với sóng SVG động ở hero, gradient đẹp.", thumbnail: "🌊" },
  { id: 27, name: "Landing Particle Mouse", category: "Landing Page", description: "Landing page với hạt sáng bay theo con trỏ chuột.", thumbnail: "🎆" },
  { id: 28, name: "Landing 3D CSS Hero", category: "Landing Page", description: "Landing page với hero section 3D CSS perspective ấn tượng.", thumbnail: "🎭" },
  { id: 29, name: "Blog Dark Progress", category: "Blog Cá Nhân", description: "Blog tối màu với thanh tiến trình đọc ở trên cùng.", thumbnail: "📖" },
  { id: 30, name: "Blog Glassmorphism", category: "Blog Cá Nhân", description: "Blog với card bài viết glassmorphism trong suốt.", thumbnail: "💎" },
  { id: 31, name: "Blog Magazine Grid", category: "Blog Cá Nhân", description: "Blog bố cục magazine dạng grid CSS đa dạng.", thumbnail: "📰" },
  { id: 32, name: "Blog Terminal", category: "Blog Cá Nhân", description: "Blog phong cách terminal hacker với giao diện dòng lệnh.", thumbnail: "💾" },
  { id: 33, name: "Link in Bio Neon", category: "Link in Bio", description: "Link in Bio neon cyberpunk với các nút phát sáng.", thumbnail: "⚡" },
  { id: 34, name: "Link in Bio 3D Tilt", category: "Link in Bio", description: "Link in Bio với các nút có hiệu ứng 3D tilt khi hover.", thumbnail: "🎪" },
  { id: 35, name: "Link in Bio Matrix", category: "Link in Bio", description: "Link in Bio với nền mưa matrix xanh lá rơi.", thumbnail: "🟩" },
  { id: 36, name: "Link in Bio Aurora", category: "Link in Bio", description: "Link in Bio với hiệu ứng sóng aurora borealis động CSS.", thumbnail: "🌌" },
];

const CATEGORIES = ["Tất cả", "Coming Soon", "Portfolio", "Landing Page", "Nhà Hàng & Ẩm Thực", "CV Cá Nhân", "Sự Kiện", "Blog Cá Nhân", "Link in Bio", "Cá Nhân", "Doanh Nghiệp"];

interface PlantModalProps {
  onClose: () => void;
}

export default function PlantModal({ onClose }: PlantModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [subdomain, setSubdomain] = useState("");
  const [hostingType, setHostingType] = useState<"ip" | "html">("ip");
  const [ipAddress, setIpAddress] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [previewId, setPreviewId] = useState<number | null>(null);

  const isSubdomainValid = subdomain.length >= 3 && /^[a-z0-9-]+$/.test(subdomain);

  const filteredTemplates = activeCategory === "Tất cả"
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  const handleSubmit = () => {
    if (hostingType === "ip") {
      alert(`✅ Đã trồng thành công!\n\n${subdomain}.khoai.to → ${ipAddress}\n\nDNS sẽ cập nhật trong 1-5 phút.`);
      onClose();
    } else {
      // Save selected template ID to localStorage and navigate to editor
      if (selectedTemplate) {
        localStorage.setItem("editor_template_id", String(selectedTemplate));
        localStorage.setItem("editor_subdomain", subdomain);
        onClose();
        router.push(`/dashboard/editor/${selectedTemplate}`);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>🌱 Trồng Subdomain mới</h2>
            <p className="modal-step">
              {step}/3 — {step === 1 ? "Đặt tên" : step === 2 ? "Chọn loại hosting" : hostingType === "ip" ? "Nhập địa chỉ IP" : "Chọn template HTML"}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {step === 1 && (
            <div className="modal-step-content">
              <label className="modal-label">Tên Subdomain <span className="required">*</span></label>
              <div className="subdomain-input-row">
                <input
                  type="text"
                  className="modal-input"
                  placeholder="yourname"
                  value={subdomain}
                  onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  autoFocus
                />
                <span className="subdomain-suffix">.khoai.to</span>
              </div>
              {subdomain && (
                <p className={`subdomain-check ${isSubdomainValid ? "valid" : "invalid"}`}>
                  {isSubdomainValid ? "✅ Có thể sử dụng!" : "❌ Tối thiểu 3 ký tự, chỉ a-z, 0-9, dấu -"}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="modal-step-content">
              <p className="modal-info">Subdomain <strong>{subdomain}.khoai.to</strong> sẽ trỏ đến:</p>
              <div className="hosting-options">
                <div
                  className={`hosting-option ${hostingType === "ip" ? "selected" : ""}`}
                  onClick={() => setHostingType("ip")}
                >
                  <span className="hosting-icon">🔗</span>
                  <div className="hosting-text">
                    <strong>Trỏ về IP của tôi</strong> <span className="hosting-badge">Cơ bản</span>
                    <p>DNS A record → máy chủ, VPS hoặc hosting của bạn. Bạn tự quản lý nội dung.</p>
                  </div>
                  <span className="hosting-check">{hostingType === "ip" ? "☑️" : "☐"}</span>
                </div>
                <div
                  className={`hosting-option ${hostingType === "html" ? "selected" : ""}`}
                  onClick={() => setHostingType("html")}
                >
                  <span className="hosting-icon">🌐</span>
                  <div className="hosting-text">
                    <strong>Dùng trang HTML (hosting khoai.to)</strong> <span className="hosting-badge new">✨ Mới</span>
                    <p>Chọn template HTML đẹp, tự chỉnh sửa nội dung. DNS trỏ về server khoai.to.</p>
                  </div>
                  <span className="hosting-check">{hostingType === "html" ? "☑️" : "☐"}</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && hostingType === "ip" && (
            <div className="modal-step-content">
              <label className="modal-label">Địa chỉ IP <span className="required">*</span></label>
              <input
                type="text"
                className="modal-input"
                placeholder="203.0.113.42"
                value={ipAddress}
                onChange={e => setIpAddress(e.target.value)}
                autoFocus
              />
              <p className="modal-hint">IPv4 của server, VPS hoặc hosting của bạn</p>
              <div className="ip-preview">
                🌐 {subdomain}.khoai.to → {ipAddress || "(chưa nhập)"}
              </div>
            </div>
          )}

          {step === 3 && hostingType === "html" && (
            <div className="modal-step-content">
              <div className="template-categories">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="template-grid">
                {filteredTemplates.map(tmpl => (
                  <div
                    key={tmpl.id}
                    className={`template-card ${selectedTemplate === tmpl.id ? "selected" : ""}`}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                  >
                    <span className="template-thumb">{tmpl.thumbnail}</span>
                    <div className="template-info">
                      <strong>{tmpl.name}</strong>
                      <span className="template-cat">{tmpl.category}</span>
                      <p>{tmpl.description.slice(0, 60)}...</p>
                    </div>
                    <button
                      className="template-view-btn"
                      onClick={e => { e.stopPropagation(); setPreviewId(tmpl.id); }}
                    >
                      👁 Xem
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {step > 1 && (
            <button className="modal-btn modal-btn--back" onClick={() => setStep(step - 1)}>
              ← Quay lại
            </button>
          )}
          {step === 1 && (
            <button className="modal-btn modal-btn--cancel" onClick={onClose}>Hủy bỏ</button>
          )}
          {step < 3 && (
            <button
              className="modal-btn modal-btn--next"
              disabled={step === 1 && !isSubdomainValid}
              onClick={() => setStep(step + 1)}
            >
              Tiếp theo →
            </button>
          )}
          {step === 3 && (
            <button
              className="modal-btn modal-btn--submit"
              disabled={hostingType === "ip" ? !ipAddress : !selectedTemplate}
              onClick={handleSubmit}
            >
              {hostingType === "ip" ? "🌱 Trồng ngay" : "🌐 Tạo & Mở editor"}
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen template preview */}
      {previewId !== null && (
        <div className="tpl-preview-fullscreen" onClick={e => e.stopPropagation()}>
          <div className="tpl-preview-header">
            <div className="tpl-preview-header-left">
              <span className="tpl-preview-thumb">
                {TEMPLATES.find(t => t.id === previewId)?.thumbnail}
              </span>
              <div>
                <strong>{TEMPLATES.find(t => t.id === previewId)?.name}</strong>
                <span className="tpl-preview-cat">{TEMPLATES.find(t => t.id === previewId)?.category}</span>
              </div>
            </div>
            <div className="tpl-preview-header-right">
              <button className="tpl-choose-btn" onClick={() => { setSelectedTemplate(previewId); setPreviewId(null); }}>
                ☑️ Chọn template này
              </button>
              <button className="tpl-close-btn" onClick={() => setPreviewId(null)}>✕</button>
            </div>
          </div>
          <iframe
            className="tpl-preview-iframe"
            srcDoc={TEMPLATE_HTML[previewId] || TEMPLATE_HTML[1]}
            sandbox="allow-scripts allow-same-origin"
            title="Template Preview"
          />
          <div className="tpl-preview-footer">
            👁 Đây là preview tĩnh · Nội dung thực tế có thể tùy chỉnh sau khi chọn
          </div>
        </div>
      )}
    </div>
  );
}
