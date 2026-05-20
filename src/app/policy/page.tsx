export default function PolicyPage() {
  return (
    <div className="policy-page">
      {/* Header Section */}
      <section className="policy-header">
        <span className="hero-badge">📋 Chính sách &amp; Gói dịch vụ</span>
        <h1>Cách trồng khoai.</h1>
        <p className="policy-header-subtitle">Để có một vườn khoai to tươi tốt. 🌱</p>
        <p className="policy-header-desc">
          Mọi chính sách sử dụng và thông tin gói dịch vụ được trình bày rõ ràng ở đây.
        </p>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        {/* Card 1 - Chiến dịch khuyến mãi (highlighted) */}
        <div className="pricing-card pricing-card--highlighted">
          <span className="pricing-badge">🎉 CHIẾN DỊCH KHUYẾN MÃI</span>
          <div className="pricing-price">0đ</div>
          <div className="pricing-period">/ trong thời gian diễn ra</div>
          <p className="pricing-subtitle">
            Xem banner trên trang chủ khi có chiến dịch đang chạy
          </p>
          <ul className="pricing-features">
            <li>✅ Subdomain miễn phí qua chương trình KM định kỳ</li>
            <li>✅ Số lượng slot giới hạn — hết slot là kết thúc</li>
            <li>✅ Mỗi tài khoản nhận tối đa 1 lần / chiến dịch</li>
            <li>✅ Trỏ về bất kỳ IP nào</li>
            <li>✅ Cập nhật IP không giới hạn</li>
            <li>✅ DNS qua Cloudflare</li>
          </ul>
          <a href="#" className="pricing-cta pricing-cta--primary">
            🔔 Theo dõi để không bỏ lỡ
          </a>
        </div>

        {/* Card 2 - Gói thêm */}
        <div className="pricing-card">
          <span className="pricing-badge">🌾 GÓI THÊM</span>
          <div className="pricing-price">Liên hệ</div>
          <div className="pricing-period">/ theo nhu cầu</div>
          <p className="pricing-subtitle">
            Liên hệ admin@khoai.to để được tư vấn
          </p>
          <ul className="pricing-features">
            <li>🌿 Nhiều subdomain theo gói</li>
            <li>🌿 Không giới hạn thời gian chiến dịch</li>
            <li>🌿 Tên miền ưu tiên (ngắn, dễ nhớ)</li>
            <li>🌿 Hỗ trợ SSL / reverse proxy</li>
            <li>🌿 Hỗ trợ kỹ thuật ưu tiên</li>
            <li>🌿 Phù hợp cá nhân, nhóm, startup</li>
          </ul>
          <a
            href="https://www.facebook.com/www.khoai.to"
            className="pricing-cta pricing-cta--secondary"
          >
            📬 Liên hệ tư vấn
          </a>
        </div>
      </section>

      {/* Pricing Note */}
      <div className="pricing-note">
        🌱 Subdomain được tặng qua các chiến dịch khuyến mãi định kỳ — theo dõi trang chủ để nhận thông báo khi có chiến dịch mới.
      </div>

      {/* Terms Section */}
      <section className="terms-section">
        <div className="section-header">
          <h2>📜 Điều khoản sử dụng</h2>
          <p>Hãy là người nông dân chân chính!</p>
        </div>
        <div className="terms-grid">
          <div className="term-item">
            <div className="term-icon">✅</div>
            <h3>Sử dụng hợp lệ</h3>
            <p>
              Subdomain chỉ được dùng cho các mục đích hợp pháp. Nghiêm cấm dùng để phát tán malware, spam, hoặc nội dung vi phạm pháp luật.
            </p>
          </div>
          <div className="term-item">
            <div className="term-icon">🔒</div>
            <h3>Bảo mật tài khoản</h3>
            <p>
              Tài khoản được xác thực qua Google OAuth. Chúng tôi không lưu mật khẩu. Bạn chịu trách nhiệm bảo mật tài khoản Google của mình.
            </p>
          </div>
          <div className="term-item">
            <div className="term-icon">⚡</div>
            <h3>Tính sẵn sàng</h3>
            <p>
              Chúng tôi cố gắng duy trì uptime tối đa. DNS được quản lý qua Cloudflare. Tuy nhiên không cam kết SLA cho gói miễn phí.
            </p>
          </div>
          <div className="term-item">
            <div className="term-icon">🗑️</div>
            <h3>Thu hồi &amp; Chấm dứt</h3>
            <p>
              Chúng tôi có quyền thu hồi subdomain nếu phát hiện vi phạm chính sách, không hoạt động quá 6 tháng, hoặc hết hạn gói dịch vụ.
            </p>
          </div>
          <div className="term-item">
            <div className="term-icon">👤</div>
            <h3>Dữ liệu cá nhân</h3>
            <p>
              Chúng tôi chỉ lưu email và tên hiển thị từ Google để định danh tài khoản. Không bán hoặc chia sẻ thông tin cá nhân cho bên thứ ba.
            </p>
          </div>
          <div className="term-item">
            <div className="term-icon">📬</div>
            <h3>Liên hệ &amp; Hỗ trợ</h3>
            <p>
              Mọi thắc mắc về chính sách, ưu đãi hoặc hỗ trợ kỹ thuật vui lòng liên hệ qua email: admin@khoai.to
            </p>
          </div>
        </div>
      </section>

      {/* Policy CTA */}
      <section className="policy-cta">
        <div className="policy-cta-card">
          <h2>🌾 Cần nhiều subdomain hơn?</h2>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              marginBottom: "24px",
              fontSize: "1rem",
            }}
          >
            Liên hệ để được tư vấn gói lưu trữ và subdomain theo nhu cầu — giá hợp lý, hỗ trợ kỹ thuật tận tình.
          </p>
          <div className="policy-cta-links">
            <a href="https://www.facebook.com/www.khoai.to">📬 admin@khoai.to</a>
            <a href="/">🎉 Xem chiến dịch đang chạy</a>
          </div>
        </div>
      </section>
    </div>
  );
}
