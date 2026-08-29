"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { heroSlides } from "@/data/hero-slides";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 10_000;

/**
 * Banner trang chủ tự chuyển (design.md §6):
 *  - Tự chuyển mỗi 10s; crossfade opacity 500ms (chỉ opacity → không layout shift).
 *  - Dừng khi hover / focus trong banner / tab ẩn.
 *  - `prefers-reduced-motion: reduce` → tắt tự chuyển, chỉ còn nút điều khiển.
 *  - Progressive enhancement: chưa có JS vẫn hiển thị đầy đủ slide đầu.
 * Các slide xếp chồng bằng CSS grid (mọi slide ở cùng ô 1/1) nên khối cao bằng
 * slide cao nhất — không cần định vị tuyệt đối.
 */
export function HeroCarousel() {
  const slides = heroSlides;
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const pausedRef = useRef(false);

  const goTo = useCallback((i: number) => setActive(((i % count) + count) % count), [count]);
  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    setEnhanced(true);
    if (count <= 1) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      setActive((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [count]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Bộ sưu tập nổi bật"
      className="relative isolate overflow-hidden bg-surface"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      <div className="grid">
        {slides.map((slide, i) => {
          const current = i === active;
          return (
            <div
              key={slide.image}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              aria-hidden={!current}
              inert={!current}
              className={cn(
                "col-start-1 row-start-1",
                enhanced &&
                  "transition-opacity duration-500 ease-standard motion-reduce:transition-none",
                current ? "opacity-100" : "opacity-0",
              )}
            >
              {/* Ảnh nền tràn viền phải (desktop) */}
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] md:block">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={i === 0}
                  sizes="56vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface to-transparent" />
              </div>

              {/* Ảnh dạng dải trên cùng (mobile) */}
              <div className="relative aspect-[4/3] w-full md:hidden">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover object-top"
                />
              </div>

              <Container className="relative flex min-h-[420px] flex-col justify-center py-12 pb-20 md:min-h-[560px] md:py-24 lg:min-h-[640px]">
                <div className="max-w-xl md:max-w-md lg:max-w-xl">
                  {slide.eyebrow ? (
                    <p className="text-overline text-muted">{slide.eyebrow}</p>
                  ) : null}
                  <h1 className="mt-2 text-hero text-ink">
                    {slide.titleLines.map((line, li) => (
                      <span key={li} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="mt-5 max-w-md text-lg text-ink-soft">{slide.body}</p>
                  <div className="mt-8">
                    <ButtonLink href={slide.ctaHref} variant="primary" size="lg">
                      {slide.ctaLabel}
                    </ButtonLink>
                  </div>
                </div>
              </Container>
            </div>
          );
        })}
      </div>

      {/* Điều khiển */}
      {count > 1 ? (
        <Container className="pointer-events-none absolute inset-x-0 bottom-5 md:bottom-7">
          <div className="pointer-events-auto flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Slide trước"
              className="grid h-11 w-11 place-items-center rounded-sm border border-ink/15 bg-bg/80 text-ink backdrop-blur transition-colors hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15"
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Slide kế tiếp"
              className="grid h-11 w-11 place-items-center rounded-sm border border-ink/15 bg-bg/80 text-ink backdrop-blur transition-colors hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15"
            >
              <IconChevronRight />
            </button>

            <div className="ml-1 flex items-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Đến slide ${i + 1}`}
                  aria-current={i === active}
                  className={cn(
                    "h-2 rounded-full transition-all duration-200 ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15",
                    i === active ? "w-6 bg-ink" : "w-2 bg-ink/25 hover:bg-ink/40",
                  )}
                />
              ))}
            </div>
          </div>
        </Container>
      ) : null}
    </section>
  );
}
