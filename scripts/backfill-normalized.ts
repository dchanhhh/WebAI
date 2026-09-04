// Script chạy MỘT LẦN: điền cột Product.nameNormalized cho các sản phẩm đã có
// sẵn trong DB trước khi cột này tồn tại (giá trị mặc định là chuỗi rỗng).
// Chạy: npx tsx scripts/backfill-normalized.ts
import { PrismaClient } from "@prisma/client";
import { normalizeVn } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, nameNormalized: true },
  });

  const stale = products.filter((p) => p.nameNormalized !== normalizeVn(p.name));

  if (stale.length === 0) {
    console.log("Không có sản phẩm nào cần backfill nameNormalized.");
    return;
  }

  for (const p of stale) {
    await prisma.product.update({
      where: { id: p.id },
      data: { nameNormalized: normalizeVn(p.name) },
    });
  }

  console.log(`Đã backfill nameNormalized cho ${stale.length}/${products.length} sản phẩm.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
