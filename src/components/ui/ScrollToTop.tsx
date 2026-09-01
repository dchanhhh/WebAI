"use client";

import { useEffect, useState } from "react";
import { IconChevronRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Nút lướt về đầu trang — cố định góc dưới phải, dưới Header (z-40 < z-50).
 *
 * Progressive enhancement:
 *  - SSR / không JS: render nhưng ẩn sẵn (opacity-0 pointer-events-none) nên
 *    không chớp ở lần vẽ đầu và không cản thao tác.
 *  - Có JS: hiện khi cuộn quá ~1 màn hình; nhấn để cuộn lên đầu.
 *
 * design.md §6 — chỉ chuyển động opacity ở 150ms với easing chuẩn
 * (ease-standard = cubic-bezier(0.4,0,0.2,1)); tôn trọng prefers-reduced-motion.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Guard SSR — chỉ chạy trên client.
    if (typeof window === "undefined") return;

    const onScroll = () => setVisible(window.scrollY > 600);

    onScroll(); // đọc vị trí cuộn ngay khi gắn
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    // design.md §6 — bỏ cuộn mượt khi người dùng yêu cầu giảm chuyển động.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Lên đầu trang"
      onClick={handleClick}
      className={cn(
        "fixed bottom-4 right-4 z-40 grid h-11 w-11 place-items-center sm:bottom-6 sm:right-6",
        "rounded-sm border border-line bg-bg text-ink shadow-sm",
        "hover:border-accent hover:text-accent",
        // design.md §6 — hover đổi màu + fade hiện/ẩn cùng ở 150ms, easing chuẩn;
        // gộp thành một khai báo transition để tránh twMerge loại bớt class.
        "transition-[color,border-color,opacity] duration-150 ease-standard motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      {/* chevron-right xoay -90° => mũi tên chỉ lên */}
      <IconChevronRight className="-rotate-90" />
    </button>
  );
}
