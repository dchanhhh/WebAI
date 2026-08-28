import type { Config } from "tailwindcss";

// Nguồn token: design.md §7.2. Không thêm giá trị rời rạc ở đây —
// cập nhật design.md trước rồi mới ánh xạ xuống.
export default {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", md: "1.5rem", lg: "2.5rem" },
      screens: { xl: "1280px" },
    },
    extend: {
      colors: {
        ink: { DEFAULT: "var(--color-ink)", soft: "var(--color-ink-soft)" },
        muted: "var(--color-muted)",
        line: "var(--color-line)",
        surface: { DEFAULT: "var(--color-surface)", 2: "var(--color-surface-2)" },
        bg: "var(--color-bg)",
        footer: {
          bg: "var(--color-footer-bg)",
          fg: "var(--color-footer-fg)",
          "fg-strong": "var(--color-footer-fg-strong)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          fg: "var(--color-accent-fg)",
        },
        sale: "var(--color-sale)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        rating: "var(--color-rating)",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
      fontSize: {
        // `display` và `overline` là component-class trong globals.css (cần
        // responsive bump + uppercase) — xem design.md §2.3 / §7.1.
        h2: ["1.625rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        h3: ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        h4: ["1rem", { lineHeight: "1.35" }],
        lg: ["1rem", { lineHeight: "1.7" }],
        base: ["0.9375rem", { lineHeight: "1.7" }],
        sm: ["0.8125rem", { lineHeight: "1.6" }],
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.12em" }],
      },
      borderRadius: { sm: "2px", DEFAULT: "2px" },
      maxWidth: { prose: "70ch" },
      transitionTimingFunction: { standard: "cubic-bezier(0.4, 0, 0.2, 1)" },
      // design.md §6 — fade khối vào màn hình (~300ms). Chỉ animate opacity/transform.
      keyframes: {
        reveal: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        reveal: "reveal 300ms cubic-bezier(0.4, 0, 0.2, 1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
