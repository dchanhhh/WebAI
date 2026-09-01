import { cn } from "@/lib/utils";

/**
 * Khối placeholder dùng chung cho mọi skeleton trong site — design.md §6.
 * Nền `surface-2` (token đã ghi "nền ảnh rỗng / skeleton") + `animate-pulse`;
 * tắt pulse khi `prefers-reduced-motion: reduce`, chỉ giữ nền tĩnh.
 *
 * Không tự set bo góc — nơi gọi quyết theo đối tượng đang mô phỏng: ảnh sản
 * phẩm không bo góc (design.md §2), còn nút/thẻ/input thì truyền `rounded-sm`.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse bg-surface-2 motion-reduce:animate-none", className)}
    />
  );
}
