# Implementation Plan: khoai-to-clone

## Overview

Clone lại giao diện trang khoai.to bằng cách sửa đổi các components hiện có và tạo mới các trang/data cần thiết. Thứ tự: shared components → mock data → pages → cleanup.

## Tasks

- [x] 1. Cập nhật shared components
  - [x] 1.1 Sửa FloatingEmojis - thêm prop `emojis`
    - Thêm interface `FloatingEmojisProps` với prop `emojis?: string[]`
    - Default value: `["🥔", "🌿", "🌱", "🍠", "🌾", "☘️", "🍃", "💧", "🌻", "🐛"]`
    - Sử dụng prop `emojis` thay vì hardcoded array trong useEffect
    - _Requirements: 3.6, 8.6_

  - [x] 1.2 Sửa PromoBanner - countdown DD:HH:MM, tiêu đề mới, nút CTA
    - Đổi tiêu đề thành "Vườn khoai mở bán"
    - Đổi countdown logic: đếm ngược đến TARGET_DATE cố định (2025-08-01), format DD:HH:MM
    - Thêm nút CTA "Đăng nhập để nhận ngay"
    - Đổi progress text thành "87/100 slots còn lại"
    - Giữ nguyên shimmer animation và pulse-glow
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x] 1.3 Sửa Header - đổi navigation links
    - Đổi link "Tính năng" href từ `/features` → `#features` (anchor trên trang chủ)
    - Đổi link "Vườn khoai" href từ `/#garden` → `/garden`
    - Giữ nguyên logic scroll, mobile menu, logo
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 1.4 Sửa Footer - bỏ GitHub, đổi links, đổi copyright
    - Xóa GitHub social icon (chỉ giữ Facebook + Telegram)
    - Đổi copyright thành "© 2025 khoai.to"
    - Đổi link "Tính năng" trong footer sang `/#features`
    - Đổi link "Vườn khoai" trong footer sang `/garden`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 2. Tạo mock data và assets
  - [x] 2.1 Tạo file mock data `src/data/mock-subdomains.ts`
    - Định nghĩa interface `SubdomainItem` với fields: id, subdomain, url, owner, createdAt
    - Tạo mảng `MOCK_SUBDOMAINS` với 6 items mẫu (blog, portfolio, api, shop, docs, game)
    - Export cả interface và data
    - _Requirements: 8.1, 8.2, 8.5_

  - [x] 2.2 Thêm placeholder `public/plan.png`
    - Tạo file placeholder SVG hoặc hình ảnh đơn giản cho vườn khoai
    - Nếu không có hình thật, tạo placeholder gradient xanh với text "🌱 Vườn khoai"
    - _Requirements: 4.1, 4.4_

- [x] 3. Checkpoint - Đảm bảo shared components hoạt động
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Sửa trang chủ `src/app/page.tsx`
  - [x] 4.1 Cập nhật Hero Section
    - Đổi badge text thành "Subdomain miễn phí · DNS trong vài giây 🌱"
    - Đổi nút "Xem tính năng" href từ `/features` → `#features`
    - Giữ nguyên FloatingEmojis, heading gradient, subtitle, nút primary
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 4.2 Thay GardenCanvas bằng Image
    - Xóa import `GardenCanvas`
    - Thêm import `Image` từ `next/image`
    - Thay `<GardenCanvas />` bằng section chứa `<Image src="/plan.png" .../>` với styling bo tròn và shadow
    - Thêm CSS class `.garden-image-section`, `.garden-image-wrapper`, `.garden-image` vào custom.css
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 4.3 Merge Features Section inline vào trang chủ
    - Copy nội dung 4 feature cards từ `src/app/features/page.tsx` vào page.tsx
    - Thêm `id="features"` cho section để anchor link hoạt động
    - Bỏ `pt-[120px]` padding (không cần vì inline)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [x] 4.4 Sửa CTA Section
    - Đổi text nút từ "🌱 Đăng nhập với Google" → "🌱 Bắt đầu miễn phí"
    - Giữ nguyên heading, description, tags, styling
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 5. Tạo trang mới `/garden`
  - [x] 5.1 Tạo file `src/app/garden/page.tsx`
    - Đánh dấu `"use client"` (cần state cho search)
    - Import FloatingEmojis với prop `emojis={["🦋", "🐝", "🌸", "✨"]}`
    - Import mock data từ `src/data/mock-subdomains.ts`
    - Tạo state `searchQuery` và logic filter subdomain theo tên/owner
    - Render: header với tiêu đề "🌾 Vườn khoai cộng đồng", search input, danh sách subdomain cards, CTA "Muốn chia sẻ subdomain của bạn?"
    - Hiển thị message "Không tìm thấy subdomain nào phù hợp" khi search không có kết quả
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [x] 5.2 Thêm CSS cho Garden page vào `src/app/custom.css`
    - Thêm styles: `.garden-header`, `.garden-search`, `.garden-list`, `.subdomain-card`, `.garden-cta`
    - Follow pattern hiện tại: dùng CSS variables, border-radius 20px, hover translateY
    - Responsive: 1 cột trên mobile (< 768px)
    - _Requirements: 8.1, 10.1_

- [x] 6. Redesign trang `/policy`
  - [x] 6.1 Viết lại `src/app/policy/page.tsx`
    - Tạo header section: "Cách trồng khoai. Để có một vườn khoai to tươi tốt. 🌱"
    - Tạo 2 pricing cards: "Chiến dịch khuyến mãi" (0đ) và "Gói thêm" (Liên hệ)
    - Tạo 6 mục điều khoản: Sử dụng hợp lệ, Bảo mật tài khoản, Tính sẵn sàng, Thu hồi & Chấm dứt, Dữ liệu cá nhân, Liên hệ & Hỗ trợ
    - Tạo CTA cuối: "Cần nhiều subdomain hơn?" với email admin@khoai.to
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [x] 6.2 Thêm CSS cho Policy page vào `src/app/custom.css`
    - Thêm styles: `.policy-header`, `.pricing-section`, `.pricing-card`, `.terms-section`, `.term-item`, `.policy-cta`
    - Dùng cùng color palette và shadow variables
    - Responsive: stack pricing cards trên mobile
    - _Requirements: 7.1, 10.1_

- [x] 7. Checkpoint - Đảm bảo tất cả trang hoạt động đúng
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Cleanup - Xóa files không cần thiết
  - [x] 8.1 Xóa `src/components/GardenCanvas.tsx`
    - File không còn được import ở đâu sau khi thay bằng Image
    - _Requirements: 4.1_

  - [x] 8.2 Xóa thư mục `src/app/features/` (bao gồm `page.tsx`)
    - Nội dung đã merge vào trang chủ, route `/features` không còn cần thiết
    - _Requirements: 5.1_

- [x] 9. Final checkpoint - Đảm bảo build thành công
  - Chạy `npm run build` để verify không có lỗi TypeScript hay import thiếu.
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Không sử dụng Property-Based Testing vì feature này chủ yếu là UI rendering và layout
- Mỗi task tham chiếu đến requirements cụ thể để đảm bảo traceability
- Checkpoints đảm bảo kiểm tra incremental
- CSS mới được append vào file `custom.css` hiện có, không tạo file CSS riêng
- Dự án dùng TypeScript + Next.js 16 + React 19 + Tailwind CSS 4

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4", "2.1", "2.2"] },
    { "id": 1, "tasks": ["4.1", "4.2", "4.3", "4.4", "5.2", "6.2"] },
    { "id": 2, "tasks": ["5.1", "6.1"] },
    { "id": 3, "tasks": ["8.1", "8.2"] }
  ]
}
```
