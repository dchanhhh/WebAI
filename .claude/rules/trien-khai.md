---
paths:
  - "prisma/**/*"
  - ".env.example"
  - "next.config.*"
  - "src/lib/auth.ts"
  - "src/middleware.ts"
---

# Lưu ý triển khai

- SQLite hợp với chạy local / VPS / Fly.io / Railway (cần volume gắn kèm cho
  `dev.db` và `public/uploads`). Nếu chuyển sang serverless (Vercel), đổi sang
  **Turso/libSQL** — vẫn dùng Prisma nên chi phí chuyển đổi thấp.
- Bí mật trong `.env` (không commit): `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`
  (bcrypt), `SESSION_SECRET`, thông tin ngân hàng nhận chuyển khoản, phí ship
  mặc định. Giữ `.env.example` cập nhật.
