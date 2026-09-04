// Chạy MỘT LẦN: di trú Product.stock (tồn kho gộp cũ) sang ProductVariant
// (tồn kho tách theo size × màu). Vì không biết tồn kho cũ vốn chia thế nào
// theo từng tổ hợp, script này CHIA ĐỀU stock cũ cho số tổ hợp size×color của
// từng sản phẩm (số dư được cộng thêm 1 vào các tổ hợp đầu để tổng khớp tuyệt
// đối với stock cũ), rồi ghi log rõ ràng để admin biết cần vào sửa lại cho
// đúng tồn kho thực tế của từng biến thể sau này.
//
// Idempotent: nếu một sản phẩm đã có ProductVariant (đã chạy backfill trước
// đó), script sẽ bỏ qua sản phẩm đó thay vì tạo trùng.
//
// Chạy: node scripts/backfill-variants.mjs
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

function parseStringArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function buildCombos(sizes, colors) {
  if (sizes.length === 0 && colors.length === 0) return [{ size: "", color: "" }];
  if (sizes.length === 0) return colors.map((color) => ({ size: "", color }));
  if (colors.length === 0) return sizes.map((size) => ({ size, color: "" }));
  const combos = [];
  for (const size of sizes) {
    for (const color of colors) combos.push({ size, color });
  }
  return combos;
}

/** Chia đều `total` cho `n` phần, số dư dồn vào các phần đầu, tổng luôn khớp `total`. */
function splitEvenly(total, n) {
  const base = Math.floor(total / n);
  const remainder = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, stock: true, sizes: true, colors: true },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Tìm thấy ${products.length} sản phẩm. Bắt đầu di trú tồn kho sang biến thể…\n`);

  let migrated = 0;
  let skipped = 0;

  for (const p of products) {
    const existingCount = await prisma.productVariant.count({ where: { productId: p.id } });
    if (existingCount > 0) {
      skipped++;
      console.log(`- [BỎ QUA] "${p.name}" (${p.slug}) đã có ${existingCount} biến thể sẵn.`);
      continue;
    }

    const sizes = parseStringArray(p.sizes);
    const colors = parseStringArray(p.colors);
    const combos = buildCombos(sizes, colors);
    const shares = splitEvenly(p.stock, combos.length);

    const data = combos.map((c, i) => ({
      productId: p.id,
      size: c.size,
      color: c.color,
      stock: shares[i],
    }));

    await prisma.productVariant.createMany({ data });
    migrated++;

    const detail = combos
      .map((c, i) => `${c.size || "—"}/${c.color || "—"}=${shares[i]}`)
      .join(", ");
    console.log(
      `- [OK] "${p.name}" (${p.slug}): stock cũ=${p.stock} → ${combos.length} biến thể chia đều [${detail}]. ` +
        (combos.length > 1
          ? `CẦN ADMIN VÀO SỬA LẠI TỒN KHO TỪNG BIẾN THỂ CHO ĐÚNG THỰC TẾ.`
          : ``),
    );
  }

  console.log(
    `\nHoàn tất: ${migrated} sản phẩm được di trú, ${skipped} sản phẩm đã có biến thể (bỏ qua).`,
  );
  if (migrated > 0) {
    console.log(
      "LƯU Ý: tồn kho biến thể vừa tạo chỉ là chia đều tạm thời từ tổng tồn kho cũ — " +
        "vào /admin/san-pham để cập nhật lại số lượng chính xác cho từng size/màu.",
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
