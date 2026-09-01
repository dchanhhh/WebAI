# Hệ thống thiết kế — `design.md` là nguồn sự thật

`design.md` là **nguồn token duy nhất** cho `tailwind.config.ts` và
`src/app/globals.css`. Mọi màu / cỡ chữ / khoảng cách / bo góc trong code phải
tham chiếu token định nghĩa ở đó — **không hard-code** giá trị hex/px rời rạc.

- Khi cần một giá trị thiết kế chưa có token: **cập nhật `design.md` trước**, rồi
  mới ánh xạ xuống config/CSS và dùng trong component. Không đi tắt.
- Nếu yêu cầu của người dùng mâu thuẫn với `design.md`, nêu rõ mâu thuẫn và hỏi
  lại trước khi sửa.
- Trước khi coi phần UI là xong, đối chiếu checklist ở `design.md §8` và QA
  responsive ở các bề rộng **360 / 768 / 1024 / 1280px**.

## Quy ước bắt buộc rút từ `design.md`

Không lặp lại toàn bộ ở đây — luôn mở `design.md` để tra.

- Font tiêu đề **Montserrat**, font thân bài **Be Vietnam Pro**; nạp qua
  `next/font` với subset `latin`, `latin-ext`, `vietnamese` (Montserrat có
  `vietnamese` subset đầy đủ — không dùng Jost vì thiếu dấu tiếng Việt).
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
