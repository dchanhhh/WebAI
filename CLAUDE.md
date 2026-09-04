# CLAUDE.md

Hướng dẫn cho Claude Code khi làm việc trong repo này.

Website bán quần áo thời trang, giao diện **tiếng Việt** (`lang="vi"`), tiền tệ
**VND**, thẩm mỹ lấy cảm hứng từ demo "Fashion Designer Boutique 02". Phạm vi:
khách duyệt sản phẩm → giỏ hàng → **đặt hàng guest** (COD / chuyển khoản, không
cổng thanh toán) → nhận mã đơn; admin quản lý sản phẩm, danh mục và đơn tại
`/admin`.

## Quy tắc chi tiết — `.claude/rules/`

Các quy tắc được tách theo chủ đề trong `.claude/rules/`, tuân theo Claude Code
rule specification. Rule không có `paths` nạp vào ngữ cảnh mỗi phiên (ưu tiên
ngang file này); rule có `paths` chỉ nạp khi Claude mở file khớp mẫu.

| File | Chủ đề | Phạm vi (`paths`) |
| --- | --- | --- |
| `tong-quan-du-an.md` | Bối cảnh, phạm vi, link kế hoạch triển khai theo mốc | toàn cục |
| `he-thong-thiet-ke.md` | `design.md` là nguồn token duy nhất; quy ước typography / màu / spacing | toàn cục |
| `screenshot-doi-chieu.md` | Chụp screenshot 360/768/1024/1280 và đối chiếu design gốc sau thay đổi lớn | `src/**/*.{tsx,css}`, `tailwind.config.ts` |
| `mobile-first.md` | Mobile-first, không cuộn ngang, vùng chạm ≥ 44px, QA 360px | `src/**/*.{tsx,css}`, `tailwind.config.ts` |
| `animation-scroll.md` | Mọi section fade + rise khi vào viewport qua component `Reveal` dùng chung | `src/**/*.{tsx,css}` |
| `stack-cong-nghe.md` | Quy ước tiền VND, giỏ hàng Zustand, phiên admin qua jose | toàn cục |
| `kien-truc.md` | Server Components, Server Actions, không tin client, `getAdminSession()`, URL params, singleton Prisma, xoá mềm | `src/**/*.{ts,tsx}` |
| `trien-khai.md` | SQLite → Turso/libSQL khi serverless; biến môi trường bí mật | `prisma/**`, `.env.example`, `next.config.*`, `src/lib/auth.ts`, `src/middleware.ts` |

**Nguyên tắc số 1:** nếu yêu cầu của người dùng mâu thuẫn với `design.md`, nêu rõ
mâu thuẫn và hỏi lại trước khi sửa.

Quy trình làm nhiều tính năng song song bằng git worktree: xem skill `git-worktrees`.
