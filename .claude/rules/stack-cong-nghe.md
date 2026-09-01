# Stack công nghệ

- **Next.js 15** (App Router, React 19, Server Actions), **TypeScript**.
- **Tailwind CSS 3.4** — cấu hình theo `design.md §7.1–7.2`.
- **Prisma + SQLite** (`prisma/dev.db`). Tiền lưu dạng **số nguyên VND** (đồng);
  format qua `Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })`
  trong `src/lib/money.ts`.
- **Zod** (validation dùng chung) + **react-hook-form** (form).
- **Zustand** + `persist` (localStorage) cho giỏ hàng guest.
- **jose** cho cookie phiên admin đã ký; `src/middleware.ts` chặn `/admin/*`.
- **Vitest** (unit) + **Playwright** (e2e).
