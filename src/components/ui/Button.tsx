import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "on-dark";
type Size = "sm" | "md" | "lg";

// design.md §5.1
const base =
  "inline-flex items-center justify-center gap-2 text-overline rounded-sm border transition-colors duration-150 ease-standard disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg border-accent hover:bg-accent-hover hover:border-accent-hover",
  secondary: "bg-transparent text-ink border-ink hover:bg-ink hover:text-bg",
  ghost: "bg-transparent text-ink border-transparent underline-offset-4 hover:underline px-0",
  "on-dark": "bg-bg text-ink border-bg hover:bg-transparent hover:text-bg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-[52px] px-8",
};

export function buttonClasses(opts?: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const { variant = "primary", size = "md", className } = opts ?? {};
  return cn(base, variants[variant], variant !== "ghost" && sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  prefetch,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  prefetch?: boolean;
}) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  if (external) {
    return (
      <a href={href} className={buttonClasses({ variant, size, className })}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} prefetch={prefetch} className={buttonClasses({ variant, size, className })}>
      {children}
    </Link>
  );
}
