# Lệnh thường dùng

```bash
npm run dev                 # chạy dev server
npm run build && npm start  # build production
npm run lint                # ESLint
npm run test                # Vitest (unit)
npm run test:e2e            # Playwright (e2e)

npx prisma migrate dev      # tạo/áp migration khi đổi schema.prisma
npx prisma db seed          # nạp dữ liệu mẫu (prisma/seed.ts)
npx prisma studio           # xem/sửa dữ liệu trực quan
```
