# Stack công nghệ

- **Tailwind CSS** — cấu hình theo `design.md §7.1–7.2`.
- **Prisma + SQLite** (`prisma/dev.db`). Tiền lưu dạng **số nguyên VND** (đồng);
  format qua `Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })`
  trong `src/lib/money.ts`.
- **Zustand** + `persist` (localStorage) cho giỏ hàng guest.
- **jose** cho cookie phiên admin đã ký; `src/middleware.ts` chặn `/admin/*`.
