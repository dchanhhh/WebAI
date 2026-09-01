---
paths:
  - "src/**/*.{tsx,css}"
---

# Mọi section phải có animation khi scroll

Áp dụng cho **mọi** thay đổi giao diện, không có ngoại lệ.

- Mỗi section trên các trang mặt tiền xuất hiện bằng hiệu ứng **fade + rise nhẹ**
  khi lọt vào viewport, đúng thông số `design.md §6` (~300ms, easing
  `cubic-bezier(0.4, 0, 0.2, 1)`, dịch lên ~16–24px).
- Dùng **một component dùng chung** (ví dụ `components/ui/Reveal.tsx`) bọc quanh
  section, cài trên `IntersectionObserver`; không tự viết lại mỗi nơi.
- **Progressive enhancement**: nếu JS chưa chạy, nội dung vẫn hiển thị đầy đủ
  (trạng thái mặc định là `opacity: 1`, animation chỉ thêm vào khi observer gắn).
- **Tôn trọng `prefers-reduced-motion: reduce`** → tắt hoàn toàn hiệu ứng, hiện
  ngay nội dung.
- Animation không được gây layout shift (chỉ animate `opacity`/`transform`), chỉ
  chạy một lần khi section xuất hiện lần đầu.
