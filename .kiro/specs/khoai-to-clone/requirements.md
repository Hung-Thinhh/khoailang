# Requirements Document

## Introduction

Clone lại toàn bộ giao diện và nội dung từ trang web live khoai.to thành dự án Next.js 16 với React 19 và Tailwind CSS 4. Dự án là static site (không cần backend/auth thực), responsive, có đầy đủ animations và effects giống trang gốc. Ngôn ngữ hiển thị: Tiếng Việt.

## Glossary

- **Ứng_dụng**: Dự án Next.js clone lại trang khoai.to
- **Trang_chủ**: Trang landing page chính tại route `/`
- **Trang_chính_sách**: Trang hiển thị chính sách và gói dịch vụ tại route `/policy`
- **Trang_vườn_khoai**: Trang hiển thị danh sách subdomain công khai tại route `/garden`
- **Header**: Component navigation cố định phía trên cùng
- **Footer**: Component chân trang
- **Promo_Banner**: Banner khuyến mãi với countdown timer và progress bar
- **Hero_Section**: Phần giới thiệu chính trên trang chủ
- **Features_Section**: Phần hiển thị 4 tính năng nổi bật
- **CTA_Section**: Phần kêu gọi hành động cuối trang
- **Floating_Emojis**: Hiệu ứng emoji bay nổi trên nền trang
- **Countdown_Timer**: Bộ đếm ngược hiển thị ngày:giờ:phút

## Requirements

### Yêu cầu 1: Header Navigation

**User Story:** Là người dùng, tôi muốn thấy thanh navigation cố định phía trên với logo, links và nút CTA, để tôi có thể điều hướng dễ dàng trên mọi trang.

#### Tiêu chí chấp nhận

1. THE Header SHALL hiển thị logo "🥔 KHOAI.TO" kèm nhãn "Free Subdomain DNS" ở phía bên trái
2. THE Header SHALL hiển thị các navigation links: "Tính năng", "Chính sách", "Vườn khoai" ở phía bên phải
3. THE Header SHALL hiển thị nút CTA "Bắt đầu trồng" với style nổi bật ở cuối navigation
4. WHEN người dùng cuộn trang xuống quá 30px, THE Header SHALL thêm hiệu ứng backdrop blur và border-bottom
5. WHILE màn hình có chiều rộng dưới 768px, THE Header SHALL hiển thị nút hamburger menu thay cho navigation links
6. WHEN người dùng nhấn nút hamburger menu, THE Header SHALL hiển thị menu dropdown dạng full-width với các navigation links

### Yêu cầu 2: Promo Banner

**User Story:** Là người dùng, tôi muốn thấy banner khuyến mãi với countdown timer và thông tin slot còn lại, để tôi biết được thời hạn và tình trạng khuyến mãi.

#### Tiêu chí chấp nhận

1. THE Promo_Banner SHALL hiển thị tiêu đề "Vườn khoai mở bán" với badge "KHUYẾN MÃI"
2. THE Promo_Banner SHALL hiển thị Countdown_Timer đếm ngược theo định dạng ngày:giờ:phút (DD:HH:MM)
3. THE Countdown_Timer SHALL cập nhật giá trị mỗi giây
4. THE Promo_Banner SHALL hiển thị progress bar với text "87/100 slots còn lại"
5. THE Promo_Banner SHALL hiển thị nút "Đăng nhập để nhận ngay"
6. THE Promo_Banner SHALL có hiệu ứng shimmer animation trên nền gradient xanh đậm
7. THE Promo_Banner SHALL có hiệu ứng pulse-glow trên badge khuyến mãi

### Yêu cầu 3: Hero Section

**User Story:** Là người dùng, tôi muốn thấy phần giới thiệu chính hấp dẫn với heading lớn và nút hành động, để tôi hiểu ngay dịch vụ cung cấp gì.

#### Tiêu chí chấp nhận

1. THE Hero_Section SHALL hiển thị badge "Subdomain miễn phí · DNS trong vài giây 🌱" với dot indicator nhấp nháy
2. THE Hero_Section SHALL hiển thị heading "Trồng Khoai.to" với gradient text (xanh đậm → xanh lá → vàng)
3. THE Hero_Section SHALL hiển thị subtitle mô tả dịch vụ đăng ký subdomain yourname.khoai.to
4. THE Hero_Section SHALL hiển thị 2 nút: "Bắt đầu trồng ngay" (primary) và "Xem tính năng" (outline)
5. THE Hero_Section SHALL có hiệu ứng fadeInUp animation cho các phần tử khi trang load
6. THE Hero_Section SHALL có Floating_Emojis bay nổi trên nền (🥔, 🌿, 🌱, 🍠, 🌾, ☘️, 🍃, 💧, 🌻, 🐛)

### Yêu cầu 4: Hình ảnh Vườn khoai

**User Story:** Là người dùng, tôi muốn thấy hình ảnh minh họa vườn khoai bên dưới hero section, để trang có visual hấp dẫn.

#### Tiêu chí chấp nhận

1. THE Ứng_dụng SHALL hiển thị hình ảnh plan.png (vườn khoai) bên dưới Hero_Section
2. THE Ứng_dụng SHALL hiển thị hình ảnh với border-radius bo tròn và shadow
3. THE Ứng_dụng SHALL hiển thị hình ảnh responsive, co giãn theo chiều rộng container
4. IF hình ảnh plan.png không tải được, THEN THE Ứng_dụng SHALL hiển thị placeholder với background gradient xanh

### Yêu cầu 5: Features Section

**User Story:** Là người dùng, tôi muốn thấy các tính năng nổi bật của dịch vụ được trình bày dạng cards, để tôi hiểu lợi ích khi sử dụng.

#### Tiêu chí chấp nhận

1. THE Features_Section SHALL hiển thị tiêu đề "Tại sao chọn khoai.to? 🌿" và mô tả phụ
2. THE Features_Section SHALL hiển thị 4 feature cards trong grid layout 2 cột
3. THE Features_Section SHALL hiển thị card "Cấp phát tức thì" (⚡) với nền vàng
4. THE Features_Section SHALL hiển thị card "Bảo mật & Riêng tư" (🔒) với nền tím
5. THE Features_Section SHALL hiển thị card "Chiến dịch khuyến mãi" (🎉) với nền xanh lá
6. THE Features_Section SHALL hiển thị card "Cập nhật IP dễ dàng" (🔄) với nền xanh dương
7. WHEN người dùng hover lên feature card, THE Features_Section SHALL di chuyển card lên 6px và thêm box-shadow
8. WHILE màn hình có chiều rộng dưới 768px, THE Features_Section SHALL chuyển grid thành 1 cột

### Yêu cầu 6: CTA Section

**User Story:** Là người dùng, tôi muốn thấy phần kêu gọi hành động cuối trang với nút đăng ký nổi bật, để tôi được khuyến khích bắt đầu sử dụng dịch vụ.

#### Tiêu chí chấp nhận

1. THE CTA_Section SHALL hiển thị heading "🥔 Hãy bắt đầu trồng khoai ngay hôm nay!" trên nền gradient xanh đậm
2. THE CTA_Section SHALL hiển thị mô tả "Chỉ cần một tài khoản Google, bạn đã sẵn sàng sở hữu subdomain riêng."
3. THE CTA_Section SHALL hiển thị nút "Bắt đầu miễn phí" với style golden gradient
4. THE CTA_Section SHALL hiển thị 3 tags: "Miễn phí", "Không cần thẻ tín dụng", "Setup trong 2 phút"
5. THE CTA_Section SHALL có hiệu ứng rotating radial gradient trên nền card
6. WHEN người dùng hover lên nút golden, THE CTA_Section SHALL di chuyển nút lên 3px và tăng box-shadow

### Yêu cầu 7: Trang Chính sách

**User Story:** Là người dùng, tôi muốn xem chi tiết chính sách sử dụng, gói dịch vụ và điều khoản, để tôi hiểu rõ quyền lợi và nghĩa vụ.

#### Tiêu chí chấp nhận

1. THE Trang_chính_sách SHALL hiển thị tiêu đề "Cách trồng khoai. Để có một vườn khoai to tươi tốt. 🌱"
2. THE Trang_chính_sách SHALL hiển thị 2 pricing cards: "Chiến dịch khuyến mãi" (0đ) và "Gói thêm" (liên hệ)
3. THE Trang_chính_sách SHALL hiển thị pricing card "Chiến dịch khuyến mãi" với danh sách tính năng miễn phí
4. THE Trang_chính_sách SHALL hiển thị pricing card "Gói thêm" với thông tin liên hệ để mua thêm
5. THE Trang_chính_sách SHALL hiển thị 6 mục điều khoản sử dụng: Sử dụng hợp lệ, Bảo mật tài khoản, Tính sẵn sàng, Thu hồi & Chấm dứt, Dữ liệu cá nhân, Liên hệ & Hỗ trợ
6. THE Trang_chính_sách SHALL hiển thị CTA "Cần nhiều subdomain hơn?" với email liên hệ admin@khoai.to
7. THE Trang_chính_sách SHALL sử dụng cùng Header và Footer đơn giản như trang gốc

### Yêu cầu 8: Trang Vườn khoai

**User Story:** Là người dùng, tôi muốn xem danh sách subdomain công khai mà cộng đồng chia sẻ, để tôi biết được các subdomain đang hoạt động.

#### Tiêu chí chấp nhận

1. THE Trang_vườn_khoai SHALL hiển thị danh sách subdomain công khai dạng list/grid
2. THE Trang_vườn_khoai SHALL hiển thị mỗi item gồm: tên subdomain, link, tên người dùng, ngày tạo
3. THE Trang_vườn_khoai SHALL hiển thị thanh tìm kiếm để lọc subdomain theo tên
4. THE Trang_vườn_khoai SHALL hiển thị CTA "Muốn chia sẻ subdomain của bạn?" với link đến Dashboard
5. THE Trang_vườn_khoai SHALL sử dụng dữ liệu mẫu (mock data) cho danh sách subdomain
6. THE Trang_vườn_khoai SHALL có Floating_Emojis với bộ emoji khác: 🦋, 🐝, 🌸, ✨
7. WHEN người dùng nhập text vào thanh tìm kiếm, THE Trang_vườn_khoai SHALL lọc danh sách subdomain theo keyword nhập vào

### Yêu cầu 9: Footer

**User Story:** Là người dùng, tôi muốn thấy footer với thông tin liên hệ và links mạng xã hội, để tôi có thể kết nối với dịch vụ.

#### Tiêu chí chấp nhận

1. THE Footer SHALL hiển thị logo "🥔 KHOAI.TO" và mô tả ngắn về dịch vụ
2. THE Footer SHALL hiển thị links mạng xã hội: Facebook và Telegram với icon SVG
3. THE Footer SHALL hiển thị copyright "© 2025 khoai.to"
4. THE Footer SHALL có nền màu charcoal (#0a1d0f) với text màu trắng mờ
5. WHEN người dùng hover lên social icon, THE Footer SHALL thêm hiệu ứng màu xanh emerald và di chuyển icon lên 3px

### Yêu cầu 10: Responsive Design

**User Story:** Là người dùng, tôi muốn trang web hiển thị tốt trên mọi kích thước màn hình, để tôi có trải nghiệm tốt trên cả mobile và desktop.

#### Tiêu chí chấp nhận

1. WHILE màn hình có chiều rộng dưới 768px, THE Ứng_dụng SHALL chuyển layout sang dạng mobile-friendly (1 cột, font nhỏ hơn)
2. WHILE màn hình có chiều rộng dưới 480px, THE Ứng_dụng SHALL ẩn promo badge và giảm padding các section
3. THE Ứng_dụng SHALL sử dụng font-size responsive với clamp() cho headings
4. THE Ứng_dụng SHALL đảm bảo các nút CTA chiếm full-width trên mobile
5. THE Ứng_dụng SHALL đảm bảo hình ảnh co giãn đúng tỷ lệ trên mọi kích thước màn hình

### Yêu cầu 11: Animations và Effects

**User Story:** Là người dùng, tôi muốn trang web có các hiệu ứng animation mượt mà, để trải nghiệm duyệt web thú vị và chuyên nghiệp.

#### Tiêu chí chấp nhận

1. THE Ứng_dụng SHALL có hiệu ứng floating emojis bay từ dưới lên trên với opacity thay đổi
2. THE Ứng_dụng SHALL có hiệu ứng wiggle animation cho logo emoji 🥔
3. THE Ứng_dụng SHALL có hiệu ứng shimmer trên Promo_Banner
4. THE Ứng_dụng SHALL có hiệu ứng fadeInUp cho các phần tử khi scroll vào viewport
5. THE Ứng_dụng SHALL có hiệu ứng hover transform (translateY, scale) cho các interactive elements
6. THE Ứng_dụng SHALL có hiệu ứng gradient shine trên nút primary khi hover
7. THE Ứng_dụng SHALL có hiệu ứng pulse cho dot indicator trong hero badge

### Yêu cầu 12: Cấu trúc kỹ thuật

**User Story:** Là developer, tôi muốn dự án sử dụng đúng tech stack và cấu trúc code chuẩn, để dễ bảo trì và phát triển tiếp.

#### Tiêu chí chấp nhận

1. THE Ứng_dụng SHALL sử dụng Next.js 16 với App Router
2. THE Ứng_dụng SHALL sử dụng React 19 và TypeScript
3. THE Ứng_dụng SHALL sử dụng Tailwind CSS 4 kết hợp custom CSS
4. THE Ứng_dụng SHALL tổ chức components trong thư mục `src/components/` với layout components riêng
5. THE Ứng_dụng SHALL sử dụng "use client" directive cho các components có state hoặc effects
6. THE Ứng_dụng SHALL sử dụng Next.js Link component cho internal navigation
7. THE Ứng_dụng SHALL hỗ trợ font Inter với subset Vietnamese
