import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.post.findMany({ select: { slug: true, publishedAt: true } }),
  ]);

  const staticRoutes = ["", "/shop", "/blog", "/gioi-thieu", "/lien-he", "/tra-cuu-don-hang"].map(
    (path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date() }),
  );

  return [
    ...staticRoutes,
    ...categories.map((c) => ({ url: `${SITE_URL}/danh-muc/${c.slug}`, lastModified: c.updatedAt })),
    ...products.map((p) => ({ url: `${SITE_URL}/san-pham/${p.slug}`, lastModified: p.updatedAt })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.publishedAt })),
  ];
}
