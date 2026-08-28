import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/constants";
import { parseStringArray } from "@/lib/utils";

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
  stock: number;
  isNew: boolean;
  sizes: string;
  colors: string;
  category: { name: string };
  images: { url: string; alt: string }[];
}): ProductListItem {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    priceVnd: p.priceVnd,
    salePriceVnd: p.salePriceVnd,
    stock: p.stock,
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
    where.OR = [
      { name: { contains: params.search } },
      { description: { contains: params.search } },
    ];
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
    },
  });
  if (!p) return null;
  return {
    ...p,
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
    },
  });
  return rows.map(toListItem);
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}
