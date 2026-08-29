export type HeroSlide = {
  eyebrow?: string;
  /** Mỗi phần tử là một dòng của tiêu đề (xuống dòng thủ công). */
  titleLines: string[];
  body: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
};

/**
 * Nội dung banner trang chủ (carousel tự chuyển mỗi 10s — xem
 * `components/home/HeroCarousel.tsx` và design.md §6).
 * Ảnh dùng lại từ `public/images/` (đã tải bằng scripts/fetch-nem-images.mjs).
 */
export const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Bộ sưu tập",
    titleLines: ["Trang phục", "dự tiệc"],
    body: "Những thiết kế tối giản, phom dáng tôn người mặc trên chất liệu chọn lọc — sẵn sàng cho mọi buổi hẹn quan trọng.",
    ctaLabel: "Xem bộ sưu tập",
    ctaHref: "/shop",
    image: "/images/hero.jpg",
    imageAlt: "Người mẫu trong đầm voan hoạ tiết của Nhà May",
  },
  {
    eyebrow: "Hàng mới về",
    titleLines: ["Nét mới", "mỗi tuần"],
    body: "Đầm, áo và chân váy vừa lên kệ — bảng màu trung tính, dễ phối, cập nhật liên tục theo mùa.",
    ctaLabel: "Khám phá ngay",
    ctaHref: "/shop?sort=moi-nhat",
    image: "/images/new-arrivals.jpg",
    imageAlt: "Đầm dáng đuôi cá sắc xanh nhạt",
  },
  {
    eyebrow: "Ưu đãi",
    titleLines: ["Thiết kế", "chọn lọc"],
    body: "Một số mẫu đầm, set đồ và chân váy đang có giá ưu đãi. Số lượng có hạn theo từng size.",
    ctaLabel: "Mua ngay",
    ctaHref: "/shop?on-sale=1",
    image: "/images/products/set-bo-thiet-ke-hw6905-1.jpg",
    imageAlt: "Set áo khoác và váy lụa tông xám khói",
  },
];
