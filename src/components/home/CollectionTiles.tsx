import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { IconArrowRight } from "@/components/ui/icons";
import { getAllCategories } from "@/lib/products";

export async function CollectionTiles() {
  const categories = (await getAllCategories()).slice(0, 4);
  if (categories.length === 0) return null;

  return (
    <Section id="bo-suu-tap" reveal={false}>
      <p className="text-overline text-muted">Danh mục</p>
      <h2 className="mt-2 max-w-md text-display text-ink">Mua theo bộ sưu tập</h2>

      <Reveal className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/danh-muc/${c.slug}`}
            className={`group block ${i % 2 === 1 ? "sm:mt-16" : ""}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
              {c.imageUrl ? (
                <Image
                  src={c.imageUrl}
                  alt={c.name}
                  fill
                  sizes="(min-width:640px) 50vw, 100vw"
                  className="object-cover transition-opacity duration-200 ease-standard group-hover:opacity-90"
                />
              ) : null}
            </div>
            <p className="mt-4 inline-flex items-center gap-2 text-overline text-ink transition-colors group-hover:text-accent">
              {c.name}
              <IconArrowRight width={16} height={16} />
            </p>
          </Link>
        ))}
      </Reveal>
    </Section>
  );
}
