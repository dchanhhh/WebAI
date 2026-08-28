# WebAI — Website bán quần áo thời trang ("Nhà May")

Website thương mại điện tử bán quần áo, giao diện **tiếng Việt**, tiền tệ **VND**.
Thẩm mỹ lấy cảm hứng từ demo "Fashion Designer Boutique 02": tối giản, trung tính,
nhiều khoảng trắng, điểm nhìn dồn vào ảnh sản phẩm.

Khách duyệt sản phẩm → thêm giỏ → **đặt hàng guest** (COD / chuyển khoản, không
cổng thanh toán) → nhận mã đơn. Admin đăng nhập tại `/admin` để quản lý sản phẩm,
danh mục và xử lý đơn.

## Stack

- **Next.js 15** (App Router, React 19, Server Actions) · **TypeScript**
- **Tailwind CSS 3.4** — token thiết kế theo `design.md`
- **Prisma + SQLite** (`prisma/dev.db`) — tiền lưu dạng số nguyên VND
- **Zod** + **react-hook-form** · **Zustand** (`persist`) cho giỏ hàng guest
- **jose** cho cookie phiên admin · `src/middleware.ts` chặn `/admin/*`
- **Vitest** (unit) · **Playwright** (e2e)

## Chạy lần đầu

```bash
npm install
cp .env.example .env         # rồi điền giá trị (xem mục Biến môi trường)
npx prisma migrate dev       # tạo prisma/dev.db
npm run prisma:seed          # nạp 5 danh mục, 16 sản phẩm, 3 bài blog
npm run gen:placeholders     # sinh ảnh SVG placeholder trong public/images
npm run dev                  # http://localhost:3000
```

## Lệnh

```bash
npm run dev                  # dev server
npm run build && npm start   # production
npm run lint                 # ESLint
npm run test                 # Vitest (unit)
npm run test:e2e             # Playwright — luồng mua hàng xương sống
npm run prisma:seed          # nạp lại dữ liệu mẫu
npm run gen:placeholders     # sinh lại ảnh placeholder
node scripts/screenshots.mjs # chụp screenshot QA (360/768/1024/1280) vào screenshots/

npx prisma studio            # xem/sửa dữ liệu
npx prisma migrate dev       # tạo/áp migration khi đổi schema.prisma
```

## Tài khoản admin (mặc định khi seed theo `.env.example`)

- URL: `/admin`
- Email: `admin@webai.local`
- Mật khẩu: `admin12345`

Đổi mật khẩu: tạo giá trị base64 mới rồi cập nhật `.env`:

```bash
node -e "console.log(Buffer.from(require('bcryptjs').hashSync(process.argv[1],10)).toString('base64'))" "MatKhauMoi"
# dán vào ADMIN_PASSWORD_HASH_B64 trong .env, khởi động lại dev server
```

> **Vì sao base64?** Hash bcrypt chứa ký tự `$`; `dotenv-expand` của Next.js sẽ
> bóc mất phần sau `$` nếu để hash thô trong `.env`. Lưu base64 để tránh hoàn toàn.

## Biến môi trường (`.env`)

| Biến | Ý nghĩa |
|---|---|
| `DATABASE_URL` | `file:./dev.db` |
| `SESSION_SECRET` | chuỗi ngẫu nhiên ≥ 32 ký tự (ký cookie phiên admin) |
| `ADMIN_EMAIL` | email đăng nhập admin |
| `ADMIN_PASSWORD_HASH_B64` | bcrypt hash của mật khẩu, mã hoá base64 |
| `BANK_*` | thông tin nhận chuyển khoản (hiện ở trang đặt hàng thành công) |
| `SHIPPING_FEE_VND` | phí ship mặc định (đồng) |
| `FREE_SHIPPING_THRESHOLD_VND` | ngưỡng miễn phí ship; `0` = tắt |

## Cấu trúc

```
src/app/(store)/        # mặt tiền: trang chủ, shop, san-pham/[slug], danh-muc/[slug],
                        # gio-hang, thanh-toan, dat-hang-thanh-cong/[code],
                        # tra-cuu-don-hang, blog, gioi-thieu, lien-he
src/app/admin/          # login + (panel): dashboard, san-pham, danh-muc, don-hang
src/app/api/admin/upload/  # nhận ảnh sản phẩm → public/uploads
src/components/         # ui/ · layout/ · product/ · cart/ · home/ · checkout/ · admin/
src/lib/               # money · cart-store · validators · orders · products · auth · ...
src/actions/           # server actions: checkout · admin · newsletter
prisma/               # schema.prisma · seed.ts · dev.db
scripts/              # gen-placeholders.mjs · screenshots.mjs
```

## Triển khai

SQLite hợp với chạy local / VPS / Fly.io / Railway (gắn volume cho `prisma/dev.db`
và `public/uploads`). Nếu chuyển sang serverless (Vercel) → đổi datasource sang
**Turso/libSQL**, giữ nguyên Prisma.
