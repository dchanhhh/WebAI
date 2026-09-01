# Design System — Website bán quần áo thời trang

Nguồn tham chiếu thẩm mỹ: demo "Fashion Designer Boutique 02"
(https://websitedemos.net/fashion-designer-boutique-02/) — tối giản, trung tính,
chữ đen trên nền trắng, sans-serif thanh lịch, nhiều khoảng trắng.

Tài liệu này là **nguồn token duy nhất** cho `tailwind.config.ts` và
`src/app/globals.css`. Mọi màu / cỡ chữ / khoảng cách trong code phải tham chiếu
token ở đây, không hard-code giá trị rời rạc.

- Ngôn ngữ giao diện: tiếng Việt (`lang="vi"`), đơn vị tiền: VND.
- Chốt: font tiêu đề **Montserrat**, font thân bài **Be Vietnam Pro**, màu nhấn **nâu camel `#8A6A4F`**.
- Giai đoạn 1: **không làm dark mode**.

---

## 1. Nguyên tắc chung

- Phong cách: tối giản – sang trọng – nhiều khoảng trắng. Điểm nhìn dồn vào ảnh sản phẩm.
- Nền trắng chủ đạo; xen kẽ dải nền kem/xám rất nhạt (`surface`) để phân tách khối.
- Màu nhấn dùng **rất tiết chế**: chủ yếu ở nút chính, link hover, badge.
- Bo góc nhỏ **2px** cho nút / input / thẻ. **Ảnh sản phẩm không bo góc.**
- Đổ bóng gần như không dùng; phân tách bằng đường kẻ `line` và khoảng trắng.
- Container tối đa **1280px**; lưới sản phẩm 2 cột (mobile) → 3 → 4 (desktop); ảnh tỉ lệ **3:4**.
- Tôn trọng `prefers-reduced-motion`.
- Tương phản văn bản đạt tối thiểu WCAG AA (≥ 4.5:1 cho chữ thường, ≥ 3:1 cho chữ lớn).

---

## 2. Quy ước chữ (Typography)

### 2.1. Font chữ

| Vai trò | Font | Nguồn | Cân nặng nạp | CSS var |
|---|---|---|---|---|
| Tiêu đề / hiển thị | **Montserrat** | Google Fonts, `next/font` | 500, 600, 700 | `--font-heading` |
| Thân bài / UI | **Be Vietnam Pro** | Google Fonts, `next/font` | 400, 500, 600, 700 | `--font-body` |

- Cả hai font đều có **`vietnamese` subset** trên Google Fonts → hiển thị đủ dấu
  tiếng Việt, không bị rơi ký tự sang font hệ thống (nguyên nhân "chữ to chữ nhỏ"
  khi trước dùng Jost — Jost chỉ có `latin` / `latin-ext`).
- Nạp qua `next/font/google` với `display: "swap"`, `subsets: ["latin", "latin-ext", "vietnamese"]`.
- Fallback stack: `--font-body` → `"Be Vietnam Pro", system-ui, "Segoe UI", Roboto, Arial, sans-serif`;
  `--font-heading` → `"Montserrat", system-ui, "Segoe UI", Arial, sans-serif`.

### 2.2. Cân nặng dùng

| Ngữ cảnh | Cân nặng |
|---|---|
| Tiêu đề (h1–h4) | 500 (mặc định), 600 (khi cần nhấn mạnh) |
| Thân bài | 400 |
| Nhấn mạnh trong đoạn (`<strong>`) | 500 |
| Nhãn nút, menu, eyebrow | 500 |

> Không dùng chữ **nghiêng** cho tiếng Việt (dấu dễ bị lệch/khó đọc). Nhấn mạnh bằng cân nặng 500.

### 2.3. Thang cỡ chữ

Gốc `html { font-size: 16px }`. Giá trị dạng `desktop / mobile`.

| Vai trò | Token Tailwind | Desktop | Mobile | line-height | letter-spacing | Font / weight |
|---|---|---|---|---|---|---|
| Hero mặt tiền (dải full-bleed) | `text-hero` | 64px (4rem) | 38px (2.375rem) | 1.05 | -0.03em | Montserrat 500 |
| Hero / H1 | `text-display` | 56px (3.5rem) | 34px (2.125rem) | 1.1 | -0.02em | Montserrat 500 |
| H2 – tiêu đề khối | `text-h2` | 36px (2.25rem) | 26px (1.625rem) | 1.15 | -0.01em | Montserrat 500 |
| H3 | `text-h3` | 24px (1.5rem) | 20px (1.25rem) | 1.25 | -0.01em | Montserrat 500 |
| H4 / tên sản phẩm | `text-h4` | 18px (1.125rem) | 16px (1rem) | 1.35 | 0 | Montserrat 500 / Be Vietnam Pro 500 |
| Body lớn (intro, mô tả) | `text-lg` | 18px | 16px | 1.7 | 0 | Be Vietnam Pro 400 |
| Body mặc định | `text-base` | 16px | 15px | 1.7 | 0 | Be Vietnam Pro 400 |
| Nhỏ / phụ chú (meta, breadcrumb) | `text-sm` | 14px | 13px | 1.6 | 0 | Be Vietnam Pro 400 |
| Rất nhỏ / nhãn | `text-xs` | 12px | 12px | 1.5 | 0.12em | Be Vietnam Pro 500, VIẾT HOA |
| Eyebrow / nhãn nút / menu | `text-overline` | 13px | 12px | 1.4 | 0.16em | Montserrat 500, VIẾT HOA |

### 2.4. Quy tắc dùng

- **VIẾT HOA + letter-spacing rộng** cho: menu điều hướng, nhãn nút, eyebrow, badge,
  tiêu đề cột footer (dùng `text-overline` hoặc `text-xs`).
- **Tiêu đề khối trang chủ** luôn đi theo cặp:
  `<p class="text-overline text-muted">` (eyebrow) + `<h2 class="text-h2 text-ink">`.
- **Giá sản phẩm**: `text-base`/`text-lg`, weight 500, màu `ink`.
  - Giá gốc bị gạch: thêm class `line-through`, màu `muted`.
  - Giá khuyến mãi: màu `sale`, weight 500.
- Đoạn văn dài giới hạn ~70 ký tự/dòng (`max-w-[70ch]` hoặc `max-w-prose`).
- Khoảng cách sau tiêu đề khối: 48–72px (`mb-12` … `mb-18`).

### 2.5. Logo / wordmark

Thương hiệu **Luméa** dùng logo ảnh raster (chữ serif riêng + nhánh lá nâu/kem,
không phải Montserrat). Đây là **ngoại lệ có chủ đích** với quy ước "wordmark =
chữ Montserrat" ở trên — chỉ áp dụng cho phần nhận diện thương hiệu, không lan
sang tiêu đề nội dung.

- **Hai file**, mỗi bản nền raster bệt sẵn (không alpha), tỉ lệ ~2:1 (1774×887):
  - `public/images/logo_light.png` — chữ nâu đậm trên **nền trắng**, dùng cho
    **nền sáng**. Nền trắng khớp `--color-bg` (`#ffffff`) nên hoà liền ở header,
    không cần blend-mode.
  - `public/images/logo_dark.png` — chữ kem trên **nền gần đen**, dùng cho
    **nền tối**. Đặt trên `--color-footer-bg` (`#161616`) kèm
    `mix-blend-lighten` để nền bệt của ảnh nhoà đúng vào nền footer, chỉ còn
    phần chữ sáng.
- **Header** (nền sáng): `logo_light.png` trong `next/image` (`priority`,
  `alt` = `SITE_NAME`), cao **32px** (mobile) → **40px** (≥ `lg`), `w-auto`.
  Drawer mobile dùng cùng ảnh, cao 28px.
- **Footer** (nền tối): `logo_dark.png`, cao **40px** (`h-10`), bọc trong
  `<Link href="/">` có `mix-blend-lighten`. Ảnh `logo_dark.png` chừa ~11.6%
  khoảng trắng bên trái nên link thêm `-ml-[9px]` để mép chữ "L" thẳng cột với
  đoạn tagline ngay dưới.
- Hằng `SITE_NAME = "Luméa"` vẫn là nguồn cho `alt`, `<title>`, metadata.
- Tagline hệ thống giữ nguyên **"Thời trang thiết kế tối giản"** — không đổi theo
  chữ "OFFICE FASHION" trên bản logo lockup.

---

## 3. Quy ước màu sắc

Định nghĩa bằng CSS custom properties trong `:root`, ánh xạ sang Tailwind `theme.extend.colors`.

### 3.1. Nhóm trung tính (chủ đạo)

| Token | Hex | Dùng cho |
|---|---|---|
| `ink` | `#1A1A1A` | Màu chữ chính, tiêu đề, icon |
| `ink-soft` | `#3D3D3D` | Chữ phụ đậm vừa |
| `muted` | `#6B6B6B` | Chữ phụ, meta, placeholder, giá gạch |
| `line` | `#E5E2DD` | Viền, đường kẻ phân cách |
| `surface` | `#F6F4F1` | Nền dải khối xen kẽ (kem rất nhạt) |
| `surface-2` | `#EEEBE6` | Nền hover ô, nền ảnh rỗng / skeleton |
| `bg` | `#FFFFFF` | Nền trang mặc định |
| `footer-bg` | `#161616` | Nền footer |
| `footer-fg` | `#B8B4AE` | Chữ trong footer |
| `footer-fg-strong` | `#FFFFFF` | Tiêu đề cột footer, hover link footer |

### 3.2. Màu nhấn & trạng thái

| Token | Hex | Dùng cho |
|---|---|---|
| `accent` | `#8A6A4F` | Nút chính, link hover, chi tiết nhấn (nâu camel) |
| `accent-hover` | `#6F5540` | Trạng thái hover của nút chính |
| `accent-fg` | `#FFFFFF` | Chữ / icon trên nền `accent` |
| `sale` | `#B23B3B` | Giá khuyến mãi, badge "-30%" |
| `success` | `#2E7D5B` | Thông báo đặt hàng thành công |
| `error` | `#C0392B` | Lỗi form, trạng thái hết hàng |
| `info` | `#2F6F8F` | Ghi chú chuyển khoản / thông tin |
| `rating` | `#C99700` | Sao đánh giá |

### 3.3. Quy tắc dùng màu

- **Nút chính** (Thêm vào giỏ, Đặt hàng): nền `accent`, chữ `accent-fg`, hover nền `accent-hover`.
- **Nút phụ**: nền trong suốt, viền `ink` 1px, chữ `ink`; hover đảo nền `ink` / chữ trắng.
- **Nút ghost/tertiary**: chỉ chữ `ink`, gạch chân khi hover.
- **Link trong nội dung**: `ink` + gạch chân mảnh; hover đổi màu `accent`.
- **Badge SALE / % giảm**: nền `sale`, chữ trắng, kiểu chữ `text-xs` VIẾT HOA.
- **Nhịp dải khối**: `bg` → `surface` → `bg` xen kẽ; footer luôn `footer-bg`.
- `muted` chỉ đặt trên nền `bg` hoặc `surface` (đủ AA). Không đặt `muted` trên `surface-2`.
- Focus ring: viền `ink` + ring 2px `rgba(26,26,26,0.15)` cho mọi phần tử tương tác.

### 3.4. Kiểm tra tương phản (tham chiếu)

| Cặp | Tỉ lệ ~ | Kết luận |
|---|---|---|
| `ink` #1A1A1A trên `bg` #FFFFFF | 17.4:1 | Đạt AAA |
| `muted` #6B6B6B trên `bg` #FFFFFF | 5.1:1 | Đạt AA (chữ thường) |
| `accent-fg` #FFFFFF trên `accent` #8A6A4F | 4.8:1 | Đạt AA |
| `footer-fg` #B8B4AE trên `footer-bg` #161616 | 6.9:1 | Đạt AA |
| `sale` #B23B3B trên `bg` #FFFFFF | 5.0:1 | Đạt AA |

---

## 4. Layout, khoảng cách, breakpoint

### 4.1. Breakpoints (mobile-first, khớp mặc định Tailwind)

| Tên | Min-width | Ghi chú |
|---|---|---|
| (base) | 0 | mobile, lưới SP 2 cột |
| `sm` | 640px | |
| `md` | 768px | lưới SP 3 cột, hiện menu ngang |
| `lg` | 1024px | lưới SP 4 cột |
| `xl` | 1280px | chiều rộng container tối đa |

Bắt buộc QA thủ công ở các bề rộng: **360 / 768 / 1024 / 1280px**.

### 4.2. Container & lưới

- Container: `max-width: 1280px`, padding ngang `16px` (mobile) → `24px` (`md`) → `40px` (`lg`).
- Lưới sản phẩm: `grid-cols-2` → `md:grid-cols-3` → `lg:grid-cols-4`, `gap` 16px → 24px → 32px.
- Ảnh sản phẩm: tỉ lệ cố định **3:4** (`aspect-[3/4]`), `object-cover`.

### 4.3. Thang khoảng cách (space scale, px)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 96 · 128`

- Padding dọc mỗi section: `64px` (mobile) → `96px` (`lg`).
- Khoảng cách giữa eyebrow và H2: `8px`; giữa H2 và nội dung khối: `48–72px`.

### 4.4. Bo góc / viền / bóng

| Token | Giá trị | Dùng cho |
|---|---|---|
| `radius-sm` | 2px | nút, input, thẻ, badge |
| `radius-none` | 0 | ảnh sản phẩm, ảnh banner |
| viền mặc định | 1px `line` | thẻ, input, đường kẻ |
| `shadow-card` (tuỳ chọn) | `0 1px 2px rgba(26,26,26,0.06)` | chỉ dùng khi thật cần nổi khối |

---

## 5. Thành phần lặp lại

### 5.1. Button

| Thuộc tính | Giá trị |
|---|---|
| Chiều cao | `md` = 44px · `lg` = 52px · `sm` = 36px |
| Padding ngang | 24px (`md`) · 32px (`lg`) |
| Bo góc | `radius-sm` (2px) |
| Nhãn | `text-overline` — VIẾT HOA, letter-spacing 0.14em, weight 500 |
| Transition | `background-color / color / border-color` 150ms ease |
| Trạng thái disabled | `opacity: 0.5`, `cursor: not-allowed` |

Biến thể: `primary` (nền `accent`), `secondary` (viền `ink`), `ghost` (chỉ chữ),
`on-dark` (dùng trong footer/hero tối: nền trắng / chữ `ink`).

### 5.2. Input / Select / Textarea

- Chiều cao 44px (textarea theo nội dung), viền `line` 1px, bo `radius-sm`, nền `bg`.
- Placeholder màu `muted`.
- Focus: viền `ink` + ring 2px `rgba(26,26,26,0.15)`.
- Lỗi: viền `error`, dòng thông báo `text-sm` màu `error` bên dưới.

### 5.3. Product card

- Ảnh `aspect-[3/4]`, `object-cover`; hover (desktop): đổi sang ảnh phụ nếu có.
- Tên sản phẩm: `text-h4`, màu `ink`, tối đa 2 dòng (`line-clamp-2`).
- Giá: ngay dưới tên; giá gốc gạch `muted` + giá `sale` nếu có khuyến mãi.
- Nút "Thêm vào giỏ": hiện khi hover (desktop) / luôn hiện (mobile), biến thể `secondary`.
- Badge SALE (nếu có `salePrice`): góc trên trái, nền `sale`, `text-xs` VIẾT HOA, ví dụ `-30%`.

### 5.4. Section heading

```html
<div class="text-center mb-12 lg:mb-16">
  <p class="text-overline text-muted mb-2">Bộ sưu tập</p>
  <h2 class="text-h2 text-ink">Bộ sưu tập mới nhất</h2>
</div>
```

### 5.5. Badge / nhãn trạng thái đơn hàng

| Trạng thái | Màu nền | Màu chữ |
|---|---|---|
| Chờ xử lý (`pending`) | `surface-2` | `ink-soft` |
| Đã xác nhận (`confirmed`) | `info` @ 12% | `info` |
| Đang giao (`shipping`) | `accent` @ 12% | `accent-hover` |
| Hoàn tất (`completed`) | `success` @ 12% | `success` |
| Đã huỷ (`cancelled`) | `error` @ 12% | `error` |

---

## 6. Chuyển động (Motion)

- Thời lượng chuẩn: 150ms (hover), 200–250ms (drawer/sheet), 300ms (fade khối vào màn hình).
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`.
- Hover ảnh sản phẩm: đổi ảnh mờ dần 200ms; **không** dùng scale/zoom mạnh.
- Cart drawer / menu mobile: trượt ngang 240ms.
- Carousel hero: tự chuyển mỗi **10s**, chuyển cảnh **crossfade 500ms**
  `cubic-bezier(0.4, 0, 0.2, 1)` (chỉ animate `opacity` — không layout shift);
  dừng khi hover / focus trong banner / tab ẩn. Khi `prefers-reduced-motion: reduce`
  → tắt tự chuyển, chỉ còn nút điều khiển; đổi slide tức thời.
- Ảnh (`next/image`) hiển thị skeleton nền `surface-2` với `animate-pulse` cho
  tới khi ảnh tải xong; `prefers-reduced-motion: reduce` → giữ nền tĩnh, tắt pulse.
- Khi `prefers-reduced-motion: reduce` → tắt mọi transition/animation không thiết yếu.

---

## 7. Ánh xạ kỹ thuật

### 7.1. `src/app/globals.css` — CSS custom properties

```css
:root {
  /* Fonts (giá trị --font-* do next/font inject qua biến của nó, map lại tại đây) */
  --font-heading: var(--font-montserrat), "Montserrat", system-ui, "Segoe UI", Arial, sans-serif;
  --font-body: var(--font-be-vietnam-pro), system-ui, "Segoe UI", Roboto, Arial, sans-serif;

  /* Neutral */
  --color-ink: #1A1A1A;
  --color-ink-soft: #3D3D3D;
  --color-muted: #6B6B6B;
  --color-line: #E5E2DD;
  --color-surface: #F6F4F1;
  --color-surface-2: #EEEBE6;
  --color-bg: #FFFFFF;
  --color-footer-bg: #161616;
  --color-footer-fg: #B8B4AE;
  --color-footer-fg-strong: #FFFFFF;

  /* Accent & state */
  --color-accent: #8A6A4F;
  --color-accent-hover: #6F5540;
  --color-accent-fg: #FFFFFF;
  --color-sale: #B23B3B;
  --color-success: #2E7D5B;
  --color-error: #C0392B;
  --color-info: #2F6F8F;
  --color-rating: #C99700;
}

html { font-size: 16px; }
body {
  background-color: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-body);
  line-height: 1.7;
}
h1, h2, h3, h4 { font-family: var(--font-heading); font-weight: 500; }

/* Tiện ích typography (nếu không tạo bằng plugin Tailwind) */
.text-hero     { font-family: var(--font-heading); font-weight: 500; font-size: 2.375rem; line-height: 1.05; letter-spacing: -0.03em; }
.text-display  { font-family: var(--font-heading); font-weight: 500; font-size: 2.125rem; line-height: 1.1;  letter-spacing: -0.02em; }
.text-h2       { font-family: var(--font-heading); font-weight: 500; font-size: 1.625rem; line-height: 1.15; letter-spacing: -0.01em; }
.text-overline { font-family: var(--font-heading); font-weight: 500; font-size: 0.75rem;  line-height: 1.4;  letter-spacing: 0.16em; text-transform: uppercase; }

@media (min-width: 1024px) {
  .text-hero    { font-size: 4rem; }
  .text-display { font-size: 3.5rem; }
  .text-h2      { font-size: 2.25rem; }
  .text-h3      { font-size: 1.5rem; }
  .text-overline{ font-size: 0.8125rem; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

### 7.2. `tailwind.config.ts` — `theme.extend`

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "1.5rem", lg: "2.5rem" }, screens: { xl: "1280px" } },
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
        // [size, { lineHeight, letterSpacing }] — dùng cỡ mobile làm mặc định, override bằng lg: ở component
        display: ["2.125rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h2: ["1.625rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        h3: ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        h4: ["1rem", { lineHeight: "1.35" }],
        lg: ["1rem", { lineHeight: "1.7" }],
        base: ["0.9375rem", { lineHeight: "1.7" }],
        sm: ["0.8125rem", { lineHeight: "1.6" }],
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.12em" }],
        overline: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.16em" }],
      },
      borderRadius: { sm: "2px", DEFAULT: "2px" },
      maxWidth: { prose: "70ch" },
      transitionTimingFunction: { standard: "cubic-bezier(0.4, 0, 0.2, 1)" },
    },
  },
  plugins: [],
} satisfies Config;
```

### 7.3. Nạp font (`src/app/layout.tsx`)

```ts
import { Montserrat, Be_Vietnam_Pro } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

// <html lang="vi" className={`${montserrat.variable} ${beVietnamPro.variable}`}>
```

---

## 8. Checklist khi build UI

- [ ] Không hard-code hex/px màu — luôn dùng token (`text-ink`, `bg-surface`, `text-accent`…).
- [ ] Tiêu đề khối = eyebrow (`text-overline text-muted`) + `h2` (`text-h2`).
- [ ] Menu / nút / badge: VIẾT HOA + letter-spacing rộng.
- [ ] Ảnh sản phẩm `aspect-[3/4]`, không bo góc; nút/input bo 2px.
- [ ] Nút chính nền `accent`, hover `accent-hover`; nút phụ viền `ink`.
- [ ] Giá khuyến mãi màu `sale`, giá gốc `line-through text-muted`.
- [ ] Focus ring rõ trên mọi phần tử tương tác.
- [ ] Kiểm tra responsive ở 360 / 768 / 1024 / 1280px.
- [ ] Tương phản chữ đạt AA; `muted` không đặt trên `surface-2`.
- [ ] `prefers-reduced-motion` được tôn trọng.
- [ ] Không dùng chữ nghiêng cho nội dung tiếng Việt.
