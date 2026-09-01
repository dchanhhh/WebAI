"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * design.md §6 — Ảnh `next/image` hiển thị skeleton nền `surface-2`
 * (token design.md §7.1) với `animate-pulse` cho tới khi ảnh tải xong.
 * Khi `prefers-reduced-motion: reduce` → `motion-reduce:animate-none`
 * giữ nền tĩnh, tắt pulse.
 *
 * API — dùng cho ảnh `fill`:
 *  - Mặc định chỉ render `<>{skeleton}{<Image fill/>}</>`, nên CALLER phải tự
 *    bọc trong một hộp `position: relative` (ví dụ
 *    `relative aspect-[3/4] overflow-hidden bg-surface-2`).
 *  - Nếu caller KHÔNG có sẵn hộp positioned, truyền `wrapperClassName` để
 *    component tự bọc trong `<span class="relative block ...">`.
 *
 * Progressive enhancement / no-JS: ảnh KHÔNG bao giờ `opacity-0` mặc định.
 * Không JS thì ảnh vẫn tải và ảnh sản phẩm `object-cover` đục sẽ phủ kín
 * skeleton bình thường. State `loaded` chỉ dùng để gỡ skeleton khi JS chạy.
 */
type Props = Pick<
  ImageProps,
  "src" | "alt" | "fill" | "sizes" | "priority"
> & {
  /** Class cho phần tử `<Image>`. */
  className?: string;
  /** Chỉ truyền khi caller CHƯA có hộp `position: relative` bao ngoài. */
  wrapperClassName?: string;
};

export function ImageWithSkeleton({
  alt,
  className,
  wrapperClassName,
  ...imageProps
}: Props) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Ảnh đã nằm trong cache: `<img>.complete` = true ngay lúc mount → bỏ skeleton.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  const done = () => setLoaded(true);

  const content = (
    <>
      {/* Skeleton nằm DƯỚI ảnh, nền `surface-2`, tự gỡ khi ảnh vẽ xong. design.md §6 */}
      {!loaded ? (
        <span
          aria-hidden
          className="absolute inset-0 bg-surface-2 animate-pulse motion-reduce:animate-none"
        />
      ) : null}
      <Image
        {...imageProps}
        alt={alt}
        ref={ref}
        onLoad={done}
        onError={done}
        className={className}
      />
    </>
  );

  if (wrapperClassName) {
    return (
      <span className={cn("relative block", wrapperClassName)}>{content}</span>
    );
  }
  return content;
}
