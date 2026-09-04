import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/constants";
import { parseStringArray, normalizeVn } from "@/lib/utils";

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  priceVnd: number;
  salePriceVnd: number | null;
  stock: number;
  categoryName: string;
  isNew: boolean;
  sizeList: string[];
  colorList: string[];
  images: { url: string; alt: string }[];
};

function toListItem(p: {
  id: string;
  slug: string;
  name: string;
  priceVnd: number;
  salePriceVnd: number | null;
  isNew: boolean;
  sizes: string;
  colors: string;
  category: { name: string };
  images: { url: string; alt: string }[];
  variants: { stock: number }[];
}): ProductListItem {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    priceVnd: p.priceVnd,
    salePriceVnd: p.salePriceVnd,
    stock: p.variants.reduce((sum, v) => sum + v.stock, 0),
    categoryName: p.category.name,
    isNew: p.isNew,
    sizeList: parseStringArray(p.sizes),
    colorList: parseStringArray(p.colors),
    images: p.images,
  };
}

export type SortKey = "moi-nhat" | "gia-tang" | "gia-giam" | "ten-az";

const orderByMap: Record<SortKey, Prisma.ProductOrderByWithRelationInput> = {
  "moi-nhat": { createdAt: "desc" },
  "gia-tang": { priceVnd: "asc" },
  "gia-giam": { priceVnd: "desc" },
  "ten-az": { name: "asc" },
};

export type ListProductsParams = {
  categorySlug?: string;
  sort?: string;
  priceMin?: number;
  priceMax?: number;
  onSale?: boolean;
  isNew?: boolean;
  page?: number;
  pageSize?: number;
  search?: string;
};

export async function listProducts(params: ListProductsParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? PAGE_SIZE;
  const sort = (params.sort as SortKey) in orderByMap ? (params.sort as SortKey) : "moi-nhat";

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (params.categorySlug) where.category = { slug: params.categorySlug };
  if (params.isNew) where.isNew = true;
  if (params.onSale) where.salePriceVnd = { not: null };
  if (params.priceMin != null || params.priceMax != null) {
    where.priceVnd = {};
    if (params.priceMin != null) where.priceVnd.gte = params.priceMin;
    if (params.priceMax != null) where.priceVnd.lte = params.priceMax;
  }
  if (params.search) {
    where.nameNormalized = { contains: normalizeVn(params.search) };
  }

  const [total, rows] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: orderByMap[sort],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        category: { select: { name: true } },
        images: { orderBy: { sortOrder: "asc" }, select: { url: true, alt: true } },
        variants: { select: { stock: true } },
      },
    }),
  ]);

  const items: ProductListItem[] = rows.map(toListItem);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getProductBySlug(slug: string) {
  const p = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });
  if (!p) return null;
  return {
    ...p,
    stock: p.variants.reduce((sum, v) => sum + v.stock, 0),
    sizeList: parseStringArray(p.sizes),
    colorList: parseStringArray(p.colors),
  };
}

export async function getFeaturedProducts(limit = 4) {
  const rows = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: "asc" }, select: { url: true, alt: true } },
      variants: { select: { stock: true } },
    },
  });
  return rows.map(toListItem);
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  const rows = await prisma.product.findMany({
    where: { isActive: true, categoryId, id: { not: productId } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: "asc" }, select: { url: true, alt: true } },
      variants: { select: { stock: true } },
    },
  });
  return rows.map(toListItem);
}

export type ProductSuggestion = {
  id: string;
  slug: string;
  name: string;
  priceVnd: number;
  salePriceVnd: number | null;
  imageUrl: string | null;
};

/** Gợi ý sản phẩm theo từ khoá, dùng cho ô tìm kiếm gợi ý tức thời (tối đa `limit` kết quả). */
export async function searchProductSuggestions(
  query: string,
  limit = 5,
): Promise<ProductSuggestion[]> {
  const q = query.trim();
  if (!q) return [];

  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      nameNormalized: { contains: normalizeVn(q) },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      slug: true,
      name: true,
      priceVnd: true,
      salePriceVnd: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
    },
  });

  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    priceVnd: p.priceVnd,
    salePriceVnd: p.salePriceVnd,
    imageUrl: p.images[0]?.url ?? null,
  }));
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}
