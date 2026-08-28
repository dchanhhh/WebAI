"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * design.md §6 + CLAUDE.md quy tắc 3 — fade + rise nhẹ khi lọt viewport.
 *
 * Progressive enhancement:
 *  - Không JS / reduced-motion  -> nội dung hiển thị đầy đủ (opacity 1), không animation.
 *  - Có JS: chỉ những phần tử đang NẰM DƯỚI viewport lúc gắn observer mới bị ẩn tạm
 *    rồi fade vào. Phần tử đã ở trong/above viewport hiển thị ngay (không chớp).
 *  - Có timer dự phòng: sau 1500ms mọi thứ hiện, kể cả khi observer không kích hoạt.
 * Chỉ animate opacity/transform => không layout shift. Chạy một lần.
 */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  delay = 0,
  id,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setState("shown");
      return;
    }

    const belowFold = el.getBoundingClientRect().top > window.innerHeight * 0.9;
    if (!belowFold) {
      setState("shown");
      return;
    }

    setState("hidden");
    const fallback = setTimeout(() => setState("shown"), 1500);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState("shown");
            clearTimeout(fallback);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => {
      clearTimeout(fallback);
      io.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref as never}
      id={id}
      style={state === "hidden" ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        state !== "idle" && "transition-[opacity,transform] duration-300 ease-standard motion-reduce:transition-none",
        state === "hidden" && "opacity-0 translate-y-5",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
