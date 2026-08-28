# CLAUDE.md

Hướng dẫn cho Claude Code khi làm việc trong repo này.

## Dự án

Website bán quần áo thời trang, giao diện **tiếng Việt** (`lang="vi"`), tiền tệ
**VND**. Thẩm mỹ lấy cảm hứng từ demo "Fashion Designer Boutique 02": tối giản,
trung tính, nhiều khoảng trắng, điểm nhìn dồn vào ảnh sản phẩm.

Phạm vi: khách duyệt sản phẩm → thêm giỏ → **đặt hàng guest** (COD / chuyển
khoản, không cổng thanh toán) → nhận mã đơn. Admin đăng nhập tại `/admin` để
quản lý sản phẩm, danh mục và xử lý đơn.

Kế hoạch triển khai chi tiết theo mốc: xem
`C:\Users\Hanh\.claude\plans\h-y-l-p-k-ho-ch-kind-reddy.md`.

## Nguyên tắc số 1 — `design.md` là nguồn sự thật về thiết kế

- `design.md` là **nguồn token duy nhất** cho `tailwind.config.ts` và
  `src/app/globals.css`. Mọi màu / cỡ chữ / khoảng cách / bo góc trong code phải
  tham chiếu token định nghĩa ở đó — **không hard-code** giá trị hex/px rời rạc.
- Khi cần một giá trị thiết kế chưa có token: **cập nhật `design.md` trước**, rồi
  mới ánh xạ xuống config/CSS và dùng trong component. Không đi tắt.
- Nếu yêu cầu của người dùng mâu thuẫn với `design.md`, nêu rõ mâu thuẫn và hỏi
  lại trước khi sửa.
- Các quy ước bắt buộc rút từ `design.md` (không lặp lại toàn bộ ở đây — luôn mở
  `design.md` để tra):
  - Font tiêu đề **Jost**, font thân bài **Be Vietnam Pro**; nạp qua `next/font`
    với subset `latin`, `latin-ext`, `vietnamese`.
  - Màu nhấn duy nhất: nâu camel `accent` `#8A6A4F` — dùng rất tiết chế.
  - Menu / nhãn nút / eyebrow / badge: **VIẾT HOA + letter-spacing rộng**
    (`text-overline` hoặc `text-xs`).
  - Tiêu đề khối = cặp eyebrow (`text-overline text-muted`) + `h2` (`text-h2`).
  - Ảnh sản phẩm: `aspect-[3/4]`, `object-cover`, **không bo góc**. Nút / input /
    thẻ bo `2px` (`radius-sm`).
  - Nhịp nền các dải khối: `bg → surface → bg` xen kẽ; footer luôn `footer-bg`.
  - Giá khuyến mãi màu `sale`; giá gốc `line-through text-muted`.
  - Giai đoạn 1: **không làm dark mode**.
  - Tôn trọng `prefers-reduced-motion`; tương phản văn bản đạt WCAG AA.
  - **Không dùng chữ nghiêng** cho nội dung tiếng Việt (nhấn mạnh bằng weight 500).
- Trước khi coi phần UI là xong, đối chiếu checklist ở `design.md §8` và QA
  responsive ở các bề rộng **360 / 768 / 1024 / 1280px**.

## Quy tắc bắt buộc

Ba quy tắc dưới đây áp dụng cho **mọi** thay đổi giao diện, không có ngoại lệ.

### 1. Chụp screenshot và so sánh với design gốc sau mỗi thay đổi lớn

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

### 2. Website phải mobile-friendly

- **Mobile-first**: viết style cho mobile trước, mở rộng bằng `sm/md/lg/xl`.
- Không có cuộn ngang ở bất kỳ bề rộng nào ≥ 320px; ảnh/bảng/khối rộng phải
  `max-w-full` hoặc bọc trong vùng cuộn riêng.
- Vùng chạm (nút, link, icon) tối thiểu **44×44px**.
- Menu chính thu về drawer trên mobile; lưới sản phẩm **2 cột** ở mobile
  (`grid-cols-2 → md:grid-cols-3 → lg:grid-cols-4`).
- Không dùng `:hover` làm cách duy nhất để lộ hành động quan trọng (ví dụ nút
  "Thêm vào giỏ" phải luôn hiện trên mobile — xem `design.md §5.3`).
- Bắt buộc kiểm tra thủ công ở **360px** (và 768/1024/1280) trước khi coi là xong.

### 3. Mọi section phải có animation khi scroll

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

## Stack

- **Next.js 15** (App Router, React 19, Server Actions), **TypeScript**.
- **Tailwind CSS 3.4** — cấu hình theo `design.md §7.1–7.2`.
- **Prisma + SQLite** (`prisma/dev.db`). Tiền lưu dạng **số nguyên VND** (đồng);
  format qua `Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })`
  trong `src/lib/money.ts`.
- **Zod** (validation dùng chung) + **react-hook-form** (form).
- **Zustand** + `persist` (localStorage) cho giỏ hàng guest.
- **jose** cho cookie phiên admin đã ký; `src/middleware.ts` chặn `/admin/*`.
- **Vitest** (unit) + **Playwright** (e2e).

## Lệnh thường dùng

> Dự án chưa được scaffold; các lệnh dưới đây áp dụng sau khi mốc M0 hoàn tất.

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

## Quy ước kiến trúc

- **App Router, ưu tiên Server Components.** Chỉ thêm `"use client"` khi thật cần
  (giỏ hàng, form, tương tác). Không lấy secret vào client component.
- **Mutation = Server Actions.** Không tạo REST endpoint trừ khi bắt buộc
  (ví dụ `POST /api/admin/upload` cho tải ảnh).
- **Không tin dữ liệu client.** Trong `createOrder` và mọi action, đọc lại
  giá/tồn kho **từ DB**, validate lại bằng zod phía server, chạy trong transaction.
- Mọi Server Action dưới `/admin` phải gọi `getAdminSession()` ở đầu hàm.
- Trạng thái lọc/sắp xếp/phân trang của trang shop lưu trong **URL search params**
  (chia sẻ link được, render phía server).
- `PrismaClient` dùng singleton từ `src/lib/prisma.ts` (tránh tạo nhiều kết nối
  khi hot-reload).
- Logic nghiệp vụ đặt trong `src/lib/*` (`money`, `cart-store`, `validators`,
  `orders`, `products`, `auth`, `constants`), không nhét vào component.
- Slug là duy nhất và sinh từ tên khi tạo sản phẩm/danh mục.
- Trạng thái đơn: `pending | confirmed | shipping | completed | cancelled` —
  hiển thị bằng Badge theo bảng màu ở `design.md §5.5`. Xoá sản phẩm = xoá mềm
  (`isActive = false`).
- Đường dẫn route dùng tiếng Việt không dấu (`san-pham`, `danh-muc`, `gio-hang`,
  `thanh-toan`, `tra-cuu-don-hang`).

## Cấu trúc thư mục (tóm tắt)

```
src/app/          # routes: trang chủ, shop, san-pham/[slug], danh-muc/[slug],
                  # gio-hang, thanh-toan, dat-hang-thanh-cong/[code],
                  # tra-cuu-don-hang, blog, admin/**
src/components/   # ui/ (primitives) · layout/ · product/ · cart/ · home/ ·
                  # checkout/ · admin/
src/lib/          # logic dùng chung (xem trên)
src/data/         # nội dung tĩnh (testimonials)
prisma/           # schema.prisma, seed.ts, dev.db
public/uploads/   # ảnh sản phẩm admin tải lên
```

## Lưu ý triển khai

- SQLite hợp với chạy local / VPS / Fly.io / Railway (cần volume gắn kèm cho
  `dev.db` và `public/uploads`). Nếu chuyển sang serverless (Vercel), đổi sang
  **Turso/libSQL** — vẫn dùng Prisma nên chi phí chuyển đổi thấp.
- Bí mật trong `.env` (không commit): `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`
  (bcrypt), `SESSION_SECRET`, thông tin ngân hàng nhận chuyển khoản, phí ship
  mặc định. Giữ `.env.example` cập nhật.
