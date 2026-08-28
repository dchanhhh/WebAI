import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";
import { formatDateVi } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Ghi chép về phong cách tối giản, chất liệu và cách chăm sóc trang phục.",
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <>
      <PageHeader
        eyebrow="Nhật ký"
        title="Blog"
        breadcrumb={[{ label: "Blog" }]}
        description="Ghi chép về phong cách tối giản, chất liệu và cách chăm sóc trang phục."
      />
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 60}>
              <article>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden bg-surface-2">
                    <Image
                      src={post.coverUrl}
                      alt={post.title}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 90vw"
                      className="object-cover transition-opacity duration-200 group-hover:opacity-90"
                    />
                  </div>
                  <p className="mt-3 text-sm text-muted">{formatDateVi(post.publishedAt)}</p>
                  <h2 className="mt-1 text-h4 text-ink group-hover:text-accent">{post.title}</h2>
                </Link>
                <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{post.excerpt}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
