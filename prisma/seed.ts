import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const img = (slug: string, n: 1 | 2, ext: "jpg" | "png" = "jpg") =>
  `/images/products/${slug}-${n}.${ext}`;

/** Sinh danh sách tổ hợp size × màu. Rỗng cả hai -> 1 tổ hợp tồn kho chung "". */
function buildCombos(sizes: string[], colors: string[]): { size: string; color: string }[] {
  if (sizes.length === 0 && colors.length === 0) return [{ size: "", color: "" }];
  if (sizes.length === 0) return colors.map((color) => ({ size: "", color }));
  if (colors.length === 0) return sizes.map((size) => ({ size, color: "" }));
  const combos: { size: string; color: string }[] = [];
  for (const size of sizes) for (const color of colors) combos.push({ size, color });
  return combos;
}

/** Chia đều `total` cho `n` phần, số dư dồn vào các phần đầu, tổng luôn khớp `total`. */
function splitEvenly(total: number, n: number): number[] {
  const base = Math.floor(total / n);
  const remainder = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}

type SeedProduct = {
  slug: string;
  name: string;
  category: string;
  priceVnd: number;
  salePriceVnd?: number;
  stock: number;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  ext?: "jpg" | "png";
  description: string;
};

const CATEGORIES = [
  { slug: "dam", name: "Đầm", sortOrder: 1, description: "Đầm suông, đầm voan và đầm hoạ tiết cho ngày thường đến dự tiệc.", image: "/images/products/dam-da-hoi-alnich-xanh-navy-1.jpg" },
  { slug: "ao", name: "Áo", sortOrder: 2, description: "Áo sơ mi, áo kiểu, áo len và áo phông phom chuẩn.", image: "/images/products/ao-len-co-be-1.jpg" },
  { slug: "quan", name: "Quần", sortOrder: 3, description: "Quần âu, quần jeans ống rộng và quần xếp ly.", image: "/images/products/quan-jeans-straight-xanh-1.jpg" },
  { slug: "chan-vay", name: "Chân váy", sortOrder: 4, description: "Chân váy xếp ly, chân váy voan hoạ tiết dáng midi.", image: "/images/products/chan-vay-midi-xep-ly-nau-1.jpg" },
  { slug: "set-do", name: "Set đồ", sortOrder: 5, description: "Set áo và chân váy / váy phối sẵn, mặc là đẹp.", image: "/images/products/set-bo-thiet-ke-hw6905-1.jpg" },
];

const PRODUCTS: SeedProduct[] = [
  // ── Đầm ──────────────────────────────────────────────────────────────
  {
    slug: "dam-lua-eterna-den",
    name: "Đầm suông Eterna",
    category: "dam",
    priceVnd: 1390000,
    salePriceVnd: 990000,
    stock: 12,
    sizes: ["S", "M", "L"],
    colors: ["Cam đất"],
    isFeatured: true,
    description:
      "Đầm suông cotton dáng midi, thân dưới xếp ly buông nhẹ và hai túi hông tiện dụng. Phom rộng thoải mái, tôn dáng mà vẫn thanh lịch.",
  },
  {
    slug: "dam-du-tiec-spark-xanh-reu",
    name: "Đầm sơ mi Spark",
    category: "dam",
    priceVnd: 1390000,
    stock: 8,
    sizes: ["S", "M", "L"],
    colors: ["Nâu camel"],
    isFeatured: true,
    description:
      "Đầm sơ mi cài khuy suốt thân, chất đũi mềm rũ, xẻ tà nhẹ hai bên. Dễ mặc đi làm, đi cà phê hay dạo phố cuối tuần.",
  },
  {
    slug: "dam-da-hoi-alnich-xanh-navy",
    name: "Đầm voan hoa nhí Alnich",
    category: "dam",
    priceVnd: 1990000,
    stock: 5,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Trắng hoa xanh"],
    isFeatured: true,
    description:
      "Đầm voan hoa nhí dáng xoè, eo chun nhún, tay cánh tiên. Chất voan hai lớp bay bổng, hợp tiệc ngoài trời và chụp ảnh.",
  },
  {
    slug: "dam-suong-meena-do-man",
    name: "Đầm suông Meena",
    category: "dam",
    priceVnd: 1090000,
    salePriceVnd: 545000,
    stock: 15,
    sizes: ["S", "M", "L"],
    colors: ["Cam đất"],
    description:
      "Đầm suông tay ngắn dáng chữ A, cổ tròn tối giản, có túi hông. Một thiết kế cơ bản dễ phối phụ kiện.",
  },
  {
    slug: "dam-hoa-tiet-co-beo",
    name: "Đầm hoạ tiết cổ bèo",
    category: "dam",
    priceVnd: 1590000,
    stock: 10,
    sizes: ["S", "M", "L"],
    colors: ["Hồng hoạ tiết"],
    isNew: true,
    isFeatured: true,
    description:
      "Đầm hoạ tiết hoa nước, cổ bèo dây rút, thân dưới tầng bồng. Sắc hồng phấn dịu dàng cho những dịp đặc biệt.",
  },

  // ── Áo ───────────────────────────────────────────────────────────────
  {
    slug: "ao-so-mi-lua-camille-trang",
    name: "Áo sơ mi bèo ngực Camille",
    category: "ao",
    priceVnd: 1090000,
    stock: 20,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Đỏ mận"],
    isNew: true,
    description:
      "Áo sơ mi chất lụa mờ, bèo dún chạy dọc nẹp ngực, tay bồng chít cổ tay. Sắc đỏ mận trầm sang trọng.",
  },
  {
    slug: "ao-kieu-dap-hoa-noi",
    name: "Áo kiểu đáp hoa nổi",
    category: "ao",
    priceVnd: 999000,
    stock: 18,
    sizes: ["S", "M", "L"],
    colors: ["Trắng"],
    isNew: true,
    description:
      "Áo kiểu trắng tay dài, chi tiết hoa đáp nổi 3D trước ngực, cổ tròn cài khuy. Nhẹ nhàng, nữ tính, dễ layering.",
  },
  {
    slug: "ao-thun-cotton-basic-xam",
    name: "Áo phông dáng rộng",
    category: "ao",
    priceVnd: 499000,
    stock: 40,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Nâu be", "Đen", "Trắng"],
    description:
      "Áo phông cotton dày dặn, phom oversize tay lỡ, gấu vạt buông. Món nền dễ mặc mọi ngày trong tuần.",
  },
  {
    slug: "ao-len-co-be",
    name: "Áo len cổ trụ tay ngắn",
    category: "ao",
    priceVnd: 599000,
    stock: 22,
    sizes: ["S", "M", "L"],
    colors: ["Xanh rêu", "Kem"],
    isNew: true,
    description:
      "Áo len dệt kim tăm nhỏ, cổ trụ bẻ, tay ngắn ôm nhẹ. Dáng gọn, tôn eo, phối chân váy hay quần đều hợp.",
  },

  // ── Quần ─────────────────────────────────────────────────────────────
  {
    slug: "quan-au-ong-suong-den",
    name: "Quần âu ống suông đen",
    category: "quan",
    priceVnd: 999000,
    stock: 22,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Đen"],
    ext: "png",
    description:
      "Quần âu lưng cao, ống suông rộng, ly chính giữa tạo phom đứng. Chất tuyết mưa ít nhăn, dài chạm mắt cá.",
  },
  {
    slug: "quan-jeans-straight-xanh",
    name: "Quần jeans ống rộng xanh",
    category: "quan",
    priceVnd: 799000,
    stock: 16,
    sizes: ["27", "28", "29", "30"],
    colors: ["Xanh"],
    description:
      "Quần jeans lưng cao, ống rộng thẳng, chất denim wash xanh trung tính. Che khuyết điểm chân, dễ phối áo.",
  },
  {
    slug: "quan-baggy-den",
    name: "Quần âu xếp ly ống côn",
    category: "quan",
    priceVnd: 799000,
    salePriceVnd: 399000,
    stock: 18,
    sizes: ["S", "M", "L"],
    colors: ["Đen"],
    description:
      "Quần âu lưng cao xếp ly, ống côn nhẹ về gấu, có túi hông. Dáng thanh gọn, đi làm hay đi chơi đều được.",
  },

  // ── Chân váy ─────────────────────────────────────────────────────────
  {
    slug: "chan-vay-midi-xep-ly-nau",
    name: "Chân váy xếp ly hoạ tiết nâu",
    category: "chan-vay",
    priceVnd: 1099000,
    stock: 14,
    sizes: ["S", "M", "L"],
    colors: ["Nâu hoạ tiết"],
    isNew: true,
    description:
      "Chân váy midi xếp ly nhuyễn, hoạ tiết hoa loang nâu trên nền kem, lưng chun. Chuyển động mềm mại khi bước đi.",
  },
  {
    slug: "chan-vay-voan-hoa-tiet",
    name: "Chân váy voan xếp ly hoạ tiết",
    category: "chan-vay",
    priceVnd: 1099000,
    stock: 12,
    sizes: ["S", "M", "L"],
    colors: ["Đen trắng"],
    description:
      "Chân váy voan xếp ly dáng midi, hoạ tiết hoa mực đen trên nền trắng. Thanh lịch, dễ phối áo trơn cơ bản.",
  },

  // ── Set đồ ───────────────────────────────────────────────────────────
  {
    slug: "set-bo-thiet-ke-hw6905",
    name: "Set áo khoác & váy lụa",
    category: "set-do",
    priceVnd: 2099000,
    stock: 6,
    sizes: ["S", "M", "L"],
    colors: ["Xám khói"],
    isFeatured: true,
    description:
      "Set hai món: áo khoác croptop tay bồng chất đũi và đầm lụa hai dây dáng xoè. Mặc cùng hoặc tách riêng đều hợp.",
  },
  {
    slug: "set-bo-linen-thanh-lich",
    name: "Set áo polo & chân váy",
    category: "set-do",
    priceVnd: 1399000,
    salePriceVnd: 699000,
    stock: 9,
    sizes: ["S", "M", "L"],
    colors: ["Xanh navy"],
    isNew: true,
    description:
      "Set áo polo dệt kim tay ngắn và chân váy bút chì xẻ sau cùng tông xanh navy. Năng động mà vẫn chỉn chu.",
  },
];

const POSTS = [
  {
    slug: "cach-phoi-do-toi-gian-quanh-nam",
    title: "Cách phối đồ tối giản mặc quanh năm",
    excerpt: "Một tủ đồ gọn gàng bắt đầu từ vài món cơ bản phom chuẩn và bảng màu trung tính.",
    coverUrl: "/images/blog/cach-phoi-do-toi-gian-quanh-nam.svg",
    contentMd:
      "## Bắt đầu từ những món nền\n\nÁo sơ mi trắng, quần âu đen, blazer be — ba món này ghép được hàng chục set.\n\n## Giữ bảng màu hẹp\n\nTrung tính giúp mọi món ăn nhập nhau. Điểm nhấn chỉ nên là một chi tiết nhỏ.\n\n## Ưu tiên phom dáng\n\nQuần áo vừa vặn luôn trông chỉn chu hơn món đắt tiền nhưng rộng thùng thình.",
  },
  {
    slug: "chon-chat-lieu-ben-dep",
    title: "Chọn chất liệu bền đẹp cho đồ mặc lâu",
    excerpt: "Linen, cotton và lụa tự nhiên — ưu nhược điểm và cách bảo quản để mặc được nhiều mùa.",
    coverUrl: "/images/blog/chon-chat-lieu-ben-dep.svg",
    contentMd:
      "## Linen\n\nThoáng, càng giặt càng mềm. Nhược điểm là dễ nhăn — hãy xem nếp nhăn là một phần vẻ đẹp của nó.\n\n## Cotton\n\nDễ mặc, dễ giặt. Chọn loại dệt dày để giữ phom.\n\n## Lụa\n\nRủ đẹp, mát. Giặt tay với nước lạnh và phơi trong bóng râm.",
  },
  {
    slug: "bang-mau-trung-tinh-cho-tu-do",
    title: "Dựng bảng màu trung tính cho tủ đồ",
    excerpt: "Bốn sắc độ nền và một màu nhấn ấm là đủ để mọi món trong tủ phối được với nhau.",
    coverUrl: "/images/blog/bang-mau-trung-tinh-cho-tu-do.svg",
    contentMd:
      "## Bốn sắc nền\n\nTrắng, kem, xám và than chì. Đây là khung xương của tủ đồ.\n\n## Một màu nhấn\n\nNâu camel ấm áp, dùng ở giày, túi hoặc khăn.\n\n## Quy tắc 80/20\n\n80% trang phục thuộc nhóm nền, 20% còn lại là màu nhấn và hoạ tiết.",
  },
];

async function main() {
  console.log("Xoá dữ liệu cũ...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.post.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();

  console.log("Tạo danh mục...");
  const catBySlug = new Map<string, string>();
  for (const c of CATEGORIES) {
    const created = await prisma.category.create({
      data: {
        slug: c.slug,
        name: c.name,
        sortOrder: c.sortOrder,
        description: c.description,
        imageUrl: c.image,
      },
    });
    catBySlug.set(c.slug, created.id);
  }

  console.log("Tạo sản phẩm...");
  for (const p of PRODUCTS) {
    const combos = buildCombos(p.sizes, p.colors);
    const shares = splitEvenly(p.stock, combos.length);
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        priceVnd: p.priceVnd,
        salePriceVnd: p.salePriceVnd ?? null,
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        isNew: p.isNew ?? false,
        isFeatured: p.isFeatured ?? false,
        isActive: true,
        categoryId: catBySlug.get(p.category)!,
        images: {
          create: [
            { url: img(p.slug, 1, p.ext), alt: p.name, sortOrder: 0 },
            { url: img(p.slug, 2, p.ext), alt: `${p.name} — góc khác`, sortOrder: 1 },
          ],
        },
        variants: {
          create: combos.map((c, i) => ({ size: c.size, color: c.color, stock: shares[i] })),
        },
      },
    });
  }

  console.log("Tạo bài blog...");
  for (const [i, post] of POSTS.entries()) {
    await prisma.post.create({
      data: {
        ...post,
        publishedAt: new Date(Date.now() - i * 7 * 24 * 3600 * 1000),
      },
    });
  }

  console.log(
    `Xong: ${CATEGORIES.length} danh mục, ${PRODUCTS.length} sản phẩm, ${POSTS.length} bài viết.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
