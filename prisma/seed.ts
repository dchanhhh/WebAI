import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (slug: string, n: 1 | 2) => `/images/products/${slug}-${n}.svg`;

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
  description: string;
};

const CATEGORIES = [
  { slug: "dam", name: "Đầm", sortOrder: 1, description: "Đầm thiết kế cho ngày thường đến dự tiệc." },
  { slug: "ao", name: "Áo", sortOrder: 2, description: "Áo sơ mi, áo kiểu, blazer và áo thun cơ bản." },
  { slug: "quan", name: "Quần & chân váy", sortOrder: 3, description: "Quần âu, jeans và chân váy phom chuẩn." },
  { slug: "giay-dep", name: "Giày dép", sortOrder: 4, description: "Giày loafer, cao gót và sandal tối giản." },
  { slug: "phu-kien", name: "Phụ kiện", sortOrder: 5, description: "Túi, khăn và phụ kiện hoàn thiện set đồ." },
];

const LOREM =
  "Thiết kế tối giản trên chất liệu chọn lọc, đường may tinh tế, phom dáng tôn người mặc và dễ phối. Sản phẩm được kiểm tra kỹ trước khi giao.";

const PRODUCTS: SeedProduct[] = [
  { slug: "dam-lua-eterna-den", name: "Đầm lụa Eterna đen", category: "dam", priceVnd: 1290000, salePriceVnd: 990000, stock: 12, sizes: ["S", "M", "L"], colors: ["Đen"], isFeatured: true, description: LOREM },
  { slug: "dam-du-tiec-spark-xanh-reu", name: "Đầm dự tiệc Spark xanh rêu", category: "dam", priceVnd: 890000, stock: 8, sizes: ["S", "M", "L"], colors: ["Xanh rêu"], isFeatured: true, description: LOREM },
  { slug: "dam-da-hoi-alnich-xanh-navy", name: "Đầm dạ hội Alnich xanh navy", category: "dam", priceVnd: 1990000, stock: 5, sizes: ["S", "M", "L", "XL"], colors: ["Xanh navy"], isFeatured: true, description: LOREM },
  { slug: "dam-suong-meena-do-man", name: "Đầm suông Meena đỏ mận", category: "dam", priceVnd: 720000, stock: 15, sizes: ["S", "M", "L"], colors: ["Đỏ mận"], isFeatured: true, description: LOREM },
  { slug: "ao-so-mi-lua-camille-trang", name: "Áo sơ mi lụa Camille trắng", category: "ao", priceVnd: 520000, stock: 20, sizes: ["S", "M", "L", "XL"], colors: ["Trắng", "Kem"], isNew: true, description: LOREM },
  { slug: "ao-blazer-linen-be", name: "Áo blazer linen be", category: "ao", priceVnd: 980000, salePriceVnd: 780000, stock: 10, sizes: ["S", "M", "L"], colors: ["Be"], isNew: true, description: LOREM },
  { slug: "ao-thun-cotton-basic-xam", name: "Áo thun cotton basic xám", category: "ao", priceVnd: 260000, stock: 40, sizes: ["S", "M", "L", "XL"], colors: ["Xám", "Đen", "Trắng"], description: LOREM },
  { slug: "ao-kieu-tay-phong-nu", name: "Áo kiểu tay phồng", category: "ao", priceVnd: 390000, stock: 18, sizes: ["S", "M", "L"], colors: ["Trắng", "Hồng nhạt"], isNew: true, description: LOREM },
  { slug: "chan-vay-midi-xep-ly-nau", name: "Chân váy midi xếp ly nâu", category: "quan", priceVnd: 480000, stock: 14, sizes: ["S", "M", "L"], colors: ["Nâu"], isNew: true, description: LOREM },
  { slug: "quan-au-ong-suong-den", name: "Quần âu ống suông đen", category: "quan", priceVnd: 550000, stock: 22, sizes: ["S", "M", "L", "XL"], colors: ["Đen"], description: LOREM },
  { slug: "quan-jeans-straight-xanh", name: "Quần jeans straight xanh", category: "quan", priceVnd: 620000, salePriceVnd: 490000, stock: 16, sizes: ["27", "28", "29", "30"], colors: ["Xanh"], description: LOREM },
  { slug: "chan-vay-but-chi-kem", name: "Chân váy bút chì kem", category: "quan", priceVnd: 430000, stock: 12, sizes: ["S", "M", "L"], colors: ["Kem"], description: LOREM },
  { slug: "giay-loafer-da-nau", name: "Giày loafer da nâu", category: "giay-dep", priceVnd: 890000, stock: 9, sizes: ["36", "37", "38", "39"], colors: ["Nâu"], isFeatured: true, description: LOREM },
  { slug: "giay-cao-got-mule-be", name: "Giày cao gót mule be", category: "giay-dep", priceVnd: 760000, stock: 7, sizes: ["35", "36", "37", "38", "39"], colors: ["Be"], description: LOREM },
  { slug: "tui-tote-canvas-be", name: "Túi tote canvas be", category: "phu-kien", priceVnd: 350000, stock: 25, sizes: [], colors: ["Be", "Đen"], isNew: true, description: LOREM },
  { slug: "khan-lua-vuong-hoa-tiet", name: "Khăn lụa vuông hoạ tiết", category: "phu-kien", priceVnd: 280000, stock: 30, sizes: [], colors: ["Hoạ tiết"], description: LOREM },
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
        imageUrl: `/images/categories/${c.slug}.svg`,
      },
    });
    catBySlug.set(c.slug, created.id);
  }

  console.log("Tạo sản phẩm...");
  for (const p of PRODUCTS) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        priceVnd: p.priceVnd,
        salePriceVnd: p.salePriceVnd ?? null,
        stock: p.stock,
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        isNew: p.isNew ?? false,
        isFeatured: p.isFeatured ?? false,
        isActive: true,
        categoryId: catBySlug.get(p.category)!,
        images: {
          create: [
            { url: img(p.slug, 1), alt: p.name, sortOrder: 0 },
            { url: img(p.slug, 2), alt: `${p.name} — góc khác`, sortOrder: 1 },
          ],
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
