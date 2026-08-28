"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: { url: string; alt: string }[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [{ url: "", alt: name }];
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {list.length > 1 ? (
        <div className="flex gap-3 sm:flex-col">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-[3/4] w-16 flex-none overflow-hidden bg-surface-2 sm:w-20",
                i === active ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-ink",
              )}
            >
              {img.url ? (
                <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-2">
        {current.url ? (
          <Image
            src={current.url}
            alt={current.alt || name}
            fill
            priority
            sizes="(min-width:1024px) 45vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}
