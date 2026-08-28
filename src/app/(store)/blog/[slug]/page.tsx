import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Markdown } from "@/components/blog/Markdown";
import { prisma } from "@/lib/prisma";
import { formatDateVi } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.coverUrl], type: "article" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) notFound();

  return (
    <Container className="max-w-3xl py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
      <article className="mt-8">
        <p className="text-overline text-muted">{formatDateVi(post.publishedAt)}</p>
        <h1 className="mt-2 text-h2 text-ink">{post.title}</h1>
        <div className="relative mt-6 aspect-[3/2] w-full overflow-hidden bg-surface-2">
          <Image src={post.coverUrl} alt={post.title} fill priority sizes="(min-width:768px) 768px, 100vw" className="object-cover" />
        </div>
        <p className="mt-6 text-lg text-ink-soft">{post.excerpt}</p>
        <div className="mt-6">
          <Markdown source={post.contentMd} />
        </div>
      </article>
      <div className="mt-12 border-t border-line pt-6">
        <Link href="/blog" className="text-overline text-ink hover:text-accent">
          ← Tất cả bài viết
        </Link>
      </div>
    </Container>
  );
}
