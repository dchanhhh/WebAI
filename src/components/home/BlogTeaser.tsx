import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { IconArrowRight } from "@/components/ui/icons";
import { prisma } from "@/lib/prisma";
import { formatDateVi } from "@/lib/utils";

export async function BlogTeaser() {
  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
  if (posts.length === 0) return null;

  return (
    <Section surface reveal={false}>
      <div className="mb-10 flex items-end justify-between gap-4 lg:mb-14">
        <div>
          <p className="text-overline text-muted mb-2">Từ nhật ký</p>
          <h2 className="text-h2 text-ink">Mới nhất trên blog</h2>
        </div>
        <Link
          href="/blog"
          className="hidden shrink-0 items-center gap-1.5 text-overline text-ink hover:text-accent sm:inline-flex"
        >
          Xem tất cả <IconArrowRight width={16} height={16} />
        </Link>
      </div>
      <Reveal className="grid gap-8 md:grid-cols-3">
        {posts.map((post) => (
            <article key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden bg-surface-2">
                  <Image
                    src={post.coverUrl}
                    alt={post.title}
                    fill
                    sizes="(min-width:768px) 33vw, 90vw"
                    className="object-cover transition-opacity duration-200 group-hover:opacity-90"
                  />
                </div>
                <p className="mt-3 text-sm text-muted">{formatDateVi(post.publishedAt)}</p>
                <h3 className="mt-1 text-h4 text-ink group-hover:text-accent">{post.title}</h3>
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{post.excerpt}</p>
            </article>
        ))}
      </Reveal>
    </Section>
  );
}
