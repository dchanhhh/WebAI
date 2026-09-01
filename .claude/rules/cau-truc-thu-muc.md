# Cấu trúc thư mục (tóm tắt)

```
src/app/          # routes: trang chủ, shop, san-pham/[slug], danh-muc/[slug],
                  # gio-hang, thanh-toan, dat-hang-thanh-cong/[code],
                  # tra-cuu-don-hang, blog, admin/**
src/components/   # ui/ (primitives) · layout/ · product/ · cart/ · home/ ·
                  # checkout/ · admin/
src/lib/          # logic dùng chung (xem rule "Quy ước kiến trúc")
src/data/         # nội dung tĩnh (testimonials)
prisma/           # schema.prisma, seed.ts, dev.db
public/uploads/   # ảnh sản phẩm admin tải lên
```
