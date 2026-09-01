---
paths:
  - "src/**/*.{ts,tsx}"
---

# Quy ước kiến trúc

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
