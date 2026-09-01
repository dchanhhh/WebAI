---
paths:
  - "src/**/*.{tsx,css}"
  - "tailwind.config.ts"
---

# Website phải mobile-friendly

Áp dụng cho **mọi** thay đổi giao diện, không có ngoại lệ.

- **Mobile-first**: viết style cho mobile trước, mở rộng bằng `sm/md/lg/xl`.
- Không có cuộn ngang ở bất kỳ bề rộng nào ≥ 320px; ảnh/bảng/khối rộng phải
  `max-w-full` hoặc bọc trong vùng cuộn riêng.
- Vùng chạm (nút, link, icon) tối thiểu **44×44px**.
- Menu chính thu về drawer trên mobile; lưới sản phẩm **2 cột** ở mobile
  (`grid-cols-2 → md:grid-cols-3 → lg:grid-cols-4`).
- Không dùng `:hover` làm cách duy nhất để lộ hành động quan trọng (ví dụ nút
  "Thêm vào giỏ" phải luôn hiện trên mobile — xem `design.md §5.3`).
- Bắt buộc kiểm tra thủ công ở **360px** (và 768/1024/1280) trước khi coi là xong.
