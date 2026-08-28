# WebAI — Website bán quần áo thời trang

Website thương mại điện tử bán quần áo, giao diện **tiếng Việt**, tiền tệ **VND**.
Thẩm mỹ lấy cảm hứng từ demo "Fashion Designer Boutique 02": tối giản, trung tính,
nhiều khoảng trắng, điểm nhìn dồn vào ảnh sản phẩm.

Phạm vi: khách duyệt sản phẩm → thêm giỏ → **đặt hàng guest** (COD / chuyển khoản,
không cổng thanh toán) → nhận mã đơn. Admin đăng nhập tại `/admin` để quản lý sản
phẩm, danh mục và xử lý đơn.

## Trạng thái

🚧 Đang ở giai đoạn khởi tạo (mốc **M0**). Dự án chưa được scaffold.

## Stack dự kiến

- **Next.js 15** (App Router, React 19, Server Actions) + **TypeScript**
- **Tailwind CSS 3.4** — token thiết kế theo `design.md`
- **Prisma + SQLite** — tiền lưu dạng số nguyên VND
- **Zod** + **react-hook-form** — validation & form
- **Zustand** (`persist`) — giỏ hàng guest
- **jose** — cookie phiên admin đã ký
- **Vitest** + **Playwright** — kiểm thử

## Tài liệu

| Tệp | Nội dung |
|---|---|
| `design.md` | Design system — **nguồn token duy nhất** (màu, typography, spacing) |
| `CLAUDE.md` | Hướng dẫn & quy tắc bắt buộc khi phát triển |

Kế hoạch triển khai chi tiết theo mốc: `~/.claude/plans/h-y-l-p-k-ho-ch-kind-reddy.md`.

## Lệnh (sau khi scaffold xong)

```bash
npm run dev                 # dev server
npm run build && npm start  # production
npm run lint                # ESLint
npm run test                # Vitest (unit)
npm run test:e2e            # Playwright (e2e)

npx prisma migrate dev      # áp migration khi đổi schema
npx prisma db seed          # nạp dữ liệu mẫu
npx prisma studio           # xem/sửa dữ liệu
```
