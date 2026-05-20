# 🥔 Phân Tích Toàn Diện Website Khoai.to

> **URL:** https://khoai.to  
> **Mô tả:** Dịch vụ cấp subdomain miễn phí `*.khoai.to` cho cộng đồng developer Việt Nam  
> **Tech Stack gốc:** Next.js (App Router + Turbopack), Nunito font, Cloudflare DNS API, Google OAuth  

---

## 📑 Danh Sách Tất Cả Các Trang (Sitemap)

| # | Trang | URL | Trạng thái | Mô tả |
|---|-------|-----|------------|-------|
| 1 | 🏠 Trang chủ | `/` | Public | Landing page giới thiệu dịch vụ |
| 2 | 📋 Chính sách | `/policy` | Public | Điều khoản sử dụng + Gói dịch vụ |
| 3 | 🌾 Vườn khoai | `/garden` | Public | Showcase subdomain cộng đồng |
| 4 | 🔐 Đăng nhập | `/login` | Public | Google OAuth login |
| 5 | 📊 Dashboard | `/dashboard` | Protected | Quản lý subdomain, tạo mới, trỏ IP |
| 6 | 🔌 API Auth | `/api/auth/google` | API | Endpoint xác thực Google |
| 7 | 🔌 API Auth Check | `/api/auth/me` | API | Kiểm tra session đăng nhập |

---

## 🏠 1. Trang Chủ (`/`)
*Đã phân tích chi tiết ở các bước trước.* Bao gồm Header Glassmorphism, Promo Banner, Hero Section với Canvas Garden tương tác (trồng khoai 5 giai đoạn), Features Grid (4 thẻ) và CTA.

---

## 📋 2. Trang Chính Sách (`/policy`)
*Đã phân tích.* Gói miễn phí cấp subdomain qua chiến dịch, mỗi user 1 subdomain/chiến dịch. Gói trả phí liên hệ admin để cấp nhiều subdomain ưu tiên.

---

## 🌾 3. Trang Vườn Khoai (`/garden`)
Trang showcase/gallery công khai hiển thị các subdomain mà user chọn chia sẻ. Hiển thị dạng grid cards với thông tin tên subdomain, người sở hữu, icon tăng trưởng và nút copy/mở link.

---

## 📊 4. Dashboard (`/dashboard`) — Protected (CHI TIẾT SAU KHI ĐĂNG NHẬP)

Dựa trên hình ảnh giao diện thực tế của người dùng:

### 4.1 Header & Điều hướng
- **Logo:** `khoai.to`
- **Menu chính:** Có 2 tab là `🌿 Vườn của bạn` (đang chọn) và `🌐 Vườn khoai` (link sang public showcase).
- **Góc phải (User Menu):** Hiển thị Avatar + Tên người dùng (VD: `A anti veo`) và nút `Đăng xuất` màu outline cam.
- **Breadcrumb:** `🏠 Trang chủ` > `🌿 Vườn Khoai`

### 4.2 Khu vực Thống kê (Stat Cards)
Hiển thị 3 thẻ thông tin tài khoản (Theme bo góc, viền màu gradient nhẹ):
1. **🥔 KHOAI MIỄN PHÍ:** Hiển thị `0 / 0` (Số lượng subdomain miễn phí hiện có).
2. **💎 CREDITS CÒN LẠI:** Hiển thị `0` (Đã dùng: 0 credits) — Hệ thống tiền tệ nội bộ để mua tính năng.
3. **🌱 TỔNG ĐÃ TRỒNG:** Hiển thị `0 / 0` (Còn 0 ô đất trống) — Thể hiện tổng số lượng subdomain đã tạo.

### 4.3 Thông báo hệ thống (Alerts)
- Cảnh báo vàng: *"Bạn đã trồng đầy vườn! (0/0 ô đất). Vui lòng liên hệ admin để được cấp thêm đất."*
- Cảnh báo xanh dương: *"DNS propagation mất 1-5 phút. Mỗi tài khoản được 0 subdomain miễn phí. Cần thêm đất? Liên hệ admin để được nâng cấp."*
- Cảnh báo xanh lá: *"Bật nút Chia sẻ trên subdomain để xuất hiện tại Vườn Khoai — nơi mọi người có thể tham khảo và tìm cảm hứng đặt tên."*

### 4.4 Danh sách Subdomain
- Tiêu đề: **🌿 Danh sách Subdomain** (kèm mô tả nhỏ "0 subdomain · 0 ô đất trống").
- Nút Action chính: **🌱 Trồng thêm** (Màu xanh lá - Bật popup tạo subdomain mới).
- **Bảng dữ liệu:**
  - Tiêu đề bảng: "Danh sách đang trống" kèm badge "0 bản ghi".
  - Empty State: Hình ảnh củ khoai tây dễ thương với dòng chữ: *"Vườn đang trống! Bạn có 0 ô đất miễn phí. Hãy trồng khoai đầu tiên!"*

---

## 🛠️ 5. Luồng "Trồng Subdomain Mới" (Flow Tạo Subdomain)

Khi bấm nút **"🌱 Trồng thêm"**, một Modal 3 bước xuất hiện cực kỳ mượt mà:

### Bước 1/3 — Đặt tên
- Label: `Tên Subdomain *`
- Input có kèm hậu tố `.khoai.to` cố định. (Ví dụ nhập `myproject`).
- Nút: `Hủy bỏ` và `Tiếp theo →`.

### Bước 2/3 — Chọn loại hosting (Tính năng cực xịn)
Cho phép user chọn 1 trong 2 phương án lưu trữ:
1. **Trỏ về IP của tôi (Cơ bản) - Mặc định:** 
   - Mô tả: "DNS A record → máy chủ, VPS hoặc hosting của bạn. Bạn tự quản lý nội dung."
   - Thích hợp cho developer đã có sẵn server.
2. **Dùng trang HTML (hosting khoai.to) (✨ Mới):**
   - Mô tả: "Chọn template HTML đẹp, tự chỉnh sửa nội dung. DNS trỏ về server khoai.to."
   - *=> Chức năng này chứng tỏ Khoai.to có tích hợp sẵn một hệ thống Website Builder mini hoặc Template Engine cho phép user host trang web tĩnh (HTML) ngay trên server của Khoai.to mà không cần VPS riêng!*
- Nút: `← Quay lại` và `Tiếp theo →`.

### Bước 3/3 — Nhập địa chỉ IP (Nếu chọn option 1 ở Bước 2)
- Label: `Địa chỉ IP *`
- Input nhập IP (placeholder: `203.0.113.42`).
- Ghi chú: "IPv4 của server, VPS hoặc hosting của bạn".
- Khung Preview động: Hiển thị thời gian thực `🌐 [tên-subdomain].khoai.to → (chưa nhập) / (IP đang gõ)`.
- Nút: `← Quay lại` và `🌱 Trồng ngay`.

---

## ⚙️ Tech Stack & Kiến trúc Hệ thống (Đã xác nhận)

Dựa vào quy trình trên, kiến trúc của hệ thống cực kỳ hiện đại:
1. **Frontend:** Next.js (App Router), Tailwind CSS (các thành phần bo góc, gradient rất đặc trưng của Tailwind/Radix UI).
2. **Quản lý tài nguyên:** Sử dụng mô hình "Credit" và "Ô đất" (Slots) để giới hạn tài nguyên cấp cho mỗi user.
3. **Core Feature 1 (DNS):** Gọi trực tiếp Cloudflare API để tạo A Record khi user nhập IP ở Bước 3.
4. **Core Feature 2 (HTML Hosting):** Nếu user chọn "Dùng trang HTML", hệ thống có thể đang lưu trữ HTML snippets trong Database (VD: PostgreSQL) hoặc S3 Bucket, và sử dụng Next.js dynamic routing (`[subdomain].khoai.to`) để render template tĩnh.

---

## 📝 Tóm Tắt Tính Năng Cốt Lõi Để Clone / Phát Triển

Nếu muốn build một hệ thống tương tự, đây là những modules bắt buộc:
1. **Auth Module:** Google OAuth login.
2. **Quota/Billing Module:** Quản lý số "ô đất" (giới hạn subdomain) và Credits cho mỗi user.
3. **DNS Module:** Tích hợp Cloudflare API (`POST /client/v4/zones/:zone_id/dns_records`) để tự động mapping IP.
4. **HTML Hosting Module (Tùy chọn nâng cao):** Cung cấp các template HTML tĩnh sẵn có và cơ chế wildcard DNS (`*.khoai.to`) trỏ về server chính để render nội dung theo tên subdomain.
5. **Community Module:** Chức năng bật/tắt (Toggle) `is_public` để hiển thị subdomain lên trang "Vườn Khoai".
