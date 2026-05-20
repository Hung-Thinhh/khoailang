import PromoBanner from "@/components/PromoBanner";
import FloatingEmojis from "@/components/FloatingEmojis";
import Potato3D from "@/components/Potato3D";
import LoginButton from "@/components/LoginButton";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <PromoBanner />

      {/* ===== HERO SECTION ===== */}
      <section className="hero" id="hero">
        <FloatingEmojis />
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="dot"></span>
            Subdomain miễn phí · DNS trong vài giây 🌱
          </div>
          <h1>
            <span className="gradient-text">Trồng Khoai.to</span>
          </h1>
          <p className="hero-subtitle">
            Đăng ký <strong>yourname.khoai.to</strong> và trỏ về server của bạn trong vài phút. 
            Miễn phí, nhanh chóng, bảo mật.
          </p>
          <div className="hero-buttons">
            <LoginButton className="btn-primary">
              🌱 Bắt đầu trồng ngay
            </LoginButton>
            <Link href="#features" className="btn-outline">
              Xem tính năng ↓
            </Link>
          </div>
          <div className="hero-potato">
            <Potato3D />
          </div>
        </div>
        {/* Background plan image at bottom */}
        <div className="hero-plan-bg"></div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header reveal visible">
            <h2>Tại sao chọn khoai.to? 🌿</h2>
            <p>Với phương châm: &quot;Khoai to không lo chết đói&quot;. Trải nghiệm để kiểm chứng ^^!</p>
          </div>
          <div className="features-grid">
            <div className="feature-card feature-card--yellow reveal visible">
              <span className="feature-icon">⚡</span>
              <h3>Cấp phát tức thì</h3>
              <p>Subdomain được tạo và DNS cập nhật ngay lập tức qua Cloudflare. Không cần chờ đợi, sẵn sàng sử dụng ngay.</p>
            </div>
            <div className="feature-card feature-card--purple reveal visible">
              <span className="feature-icon">🔒</span>
              <h3>Bảo mật & Riêng tư</h3>
              <p>Xác thực Google OAuth an toàn. Mỗi user chỉ quản lý subdomain của mình. Dữ liệu được bảo vệ tuyệt đối.</p>
            </div>
            <div className="feature-card feature-card--green reveal visible">
              <span className="feature-icon">🎉</span>
              <h3>Chiến dịch khuyến mãi</h3>
              <p>Nhận subdomain *.khoai.to miễn phí qua các chiến dịch định kỳ. Số lượng có hạn, nhanh tay đăng ký!</p>
            </div>
            <div className="feature-card feature-card--blue reveal visible">
              <span className="feature-icon">🔄</span>
              <h3>Cập nhật IP dễ dàng</h3>
              <p>Đổi IP server bất kỳ lúc nào qua dashboard. DNS propagation trong vài giây, không downtime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section" id="cta">
        <div className="cta-card">
          <h2>🥔 Hãy bắt đầu trồng khoai<br />ngay hôm nay!</h2>
          <p>Chỉ cần một tài khoản Google, bạn đã sẵn sàng sở hữu subdomain riêng.</p>
          <LoginButton className="btn-golden">
            🌱 Bắt đầu miễn phí
          </LoginButton>
          <div className="cta-tags">
            <span className="cta-tag">Miễn phí</span>
            <span className="cta-tag">Không cần thẻ tín dụng</span>
            <span className="cta-tag">Setup trong 2 phút</span>
          </div>
        </div>
      </section>
    </>
  );
}
