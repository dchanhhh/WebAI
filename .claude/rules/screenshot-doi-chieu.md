---
paths:
  - "src/**/*.{tsx,css}"
  - "tailwind.config.ts"
---

# Chụp screenshot và đối chiếu design gốc sau mỗi thay đổi lớn

Áp dụng cho **mọi** thay đổi giao diện, không có ngoại lệ.

- "Thay đổi lớn" = thêm/dựng lại một section, đổi layout, đổi component dùng
  chung, hoặc bất kỳ thay đổi nào ảnh hưởng nhiều trang.
- Chạy app (dùng skill `run` hoặc Playwright) và chụp trang/section vừa sửa ở
  **cả 4 bề rộng QA: 360 / 768 / 1024 / 1280px**.
- Đối chiếu trực quan với design gốc:
  - Demo tham chiếu: <https://websitedemos.net/fashion-designer-boutique-02/>
  - Design system: `design.md` (spacing, typography scale, token màu).
- Lưu ảnh vào `screenshots/<ten-section>/<width>.png` (thư mục này **gitignore**),
  và tóm tắt điểm khác biệt so với design gốc trong phần trả lời cho người dùng.
- Nếu lệch so với `design.md`: sửa cho khớp hoặc nêu rõ lý do trước khi tiếp tục.
