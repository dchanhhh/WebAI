// Sinh ảnh SVG placeholder cho sản phẩm / danh mục / hero / blog.
// Chạy: node scripts/gen-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "images");

const PALETTE = {
  ink: "#1A1A1A",
  line: "#E5E2DD",
  surface: "#F6F4F1",
  surface2: "#EEEBE6",
  accent: "#8A6A4F",
};

// Tông nền dịu cho từng sản phẩm (đủ nhạt để ảnh vẫn "sạch")
const TONES = [
  "#EFEAE4", "#E7E4DF", "#EDE7E1", "#E4E6E4", "#F0EBE6",
  "#E8E2DC", "#ECEAE7", "#E6E1DB", "#EFEDE9", "#E3E0DB",
  "#F1ECE6", "#E5E7E6",
];

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Silhouette đơn giản: thân áo/đầm dạng hình thang + tay
function garment(cx, topY, w, h, fill) {
  const halfTop = w * 0.22;
  const halfHem = w * 0.42;
  const shoulderY = topY + h * 0.08;
  const hemY = topY + h;
  return `
    <path d="M ${cx - halfTop} ${topY}
             L ${cx + halfTop} ${topY}
             L ${cx + halfTop + w * 0.14} ${shoulderY}
             L ${cx + halfTop + w * 0.08} ${shoulderY + h * 0.12}
             L ${cx + halfTop} ${shoulderY + h * 0.06}
             L ${cx + halfHem} ${hemY}
             L ${cx - halfHem} ${hemY}
             L ${cx - halfTop} ${shoulderY + h * 0.06}
             L ${cx - halfTop - w * 0.08} ${shoulderY + h * 0.12}
             L ${cx - halfTop - w * 0.14} ${shoulderY}
             Z"
          fill="${fill}" />
    <circle cx="${cx}" cy="${topY - h * 0.06}" r="${w * 0.11}" fill="${fill}" />`;
}

function productSvg({ w = 900, h = 1200, tone, label, alt = false }) {
  const cx = w / 2;
  const gW = w * 0.5;
  const gH = h * 0.52;
  const gTop = h * 0.2;
  const garmentFill = alt ? "#D8D2CA" : "#CFC8BE";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${tone}" />
  ${alt ? `<rect width="${w}" height="${h}" fill="#000000" opacity="0.03" />` : ""}
  ${garment(cx, gTop, gW, gH, garmentFill)}
  <text x="${cx}" y="${h - 70}" text-anchor="middle"
        font-family="Jost, system-ui, sans-serif" font-size="30" letter-spacing="6"
        fill="${PALETTE.ink}" opacity="0.55">${esc(label.toUpperCase())}</text>
</svg>`;
}

function tileSvg({ w = 800, h = 1000, tone, label }) {
  const cx = w / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${tone}" />
  ${garment(cx, h * 0.16, w * 0.56, h * 0.56, "#CBC3B8")}
  <text x="${cx}" y="${h - 64}" text-anchor="middle"
        font-family="Jost, system-ui, sans-serif" font-size="34" letter-spacing="8"
        fill="${PALETTE.ink}" opacity="0.6">${esc(label.toUpperCase())}</text>
</svg>`;
}

function bannerSvg({ w, h, tone, label, sub }) {
  const cx = w / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${tone}" />
  ${garment(cx, h * 0.1, Math.min(w, h) * 0.5, h * 0.62, "#C8C0B5")}
  <text x="60" y="${h - 90}" font-family="Jost, system-ui, sans-serif" font-size="${Math.round(h * 0.06)}"
        fill="${PALETTE.ink}" opacity="0.7">${esc(label)}</text>
  ${sub ? `<text x="60" y="${h - 50}" font-family="Be Vietnam Pro, system-ui, sans-serif" font-size="${Math.round(h * 0.03)}" fill="${PALETTE.ink}" opacity="0.5">${esc(sub)}</text>` : ""}
</svg>`;
}

function write(rel, content) {
  const full = join(outDir, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
  console.log("  ", rel);
}

console.log("Sinh ảnh placeholder...");

// Sản phẩm: slug -> nhãn hiển thị.
// Lưu ý: bản seed hiện dùng ảnh thật (.jpg) tải bằng scripts/fetch-nem-images.mjs.
// Danh sách này chỉ để sinh ảnh .svg dự phòng, không ghi đè ảnh .jpg.
const PRODUCTS = [
  ["dam-lua-eterna-den", "Đầm Eterna"],
  ["dam-du-tiec-spark-xanh-reu", "Đầm Spark"],
  ["dam-da-hoi-alnich-xanh-navy", "Đầm Alnich"],
  ["dam-suong-meena-do-man", "Đầm Meena"],
  ["dam-hoa-tiet-co-beo", "Đầm Cổ Bèo"],
  ["ao-so-mi-lua-camille-trang", "Áo Camille"],
  ["ao-kieu-dap-hoa-noi", "Áo Đáp Hoa Nổi"],
  ["ao-thun-cotton-basic-xam", "Áo Phông Dáng Rộng"],
  ["ao-len-co-be", "Áo Len Cổ Trụ"],
  ["quan-au-ong-suong-den", "Quần Âu Ống Suông"],
  ["quan-jeans-straight-xanh", "Quần Jeans Ống Rộng"],
  ["quan-baggy-den", "Quần Xếp Ly Ống Côn"],
  ["chan-vay-midi-xep-ly-nau", "Chân Váy Xếp Ly Nâu"],
  ["chan-vay-voan-hoa-tiet", "Chân Váy Voan Hoạ Tiết"],
  ["set-bo-thiet-ke-hw6905", "Set Áo Khoác & Váy"],
  ["set-bo-linen-thanh-lich", "Set Polo & Chân Váy"],
];

PRODUCTS.forEach(([slug, label], i) => {
  const tone = TONES[i % TONES.length];
  write(`products/${slug}-1.svg`, productSvg({ tone, label }));
  write(`products/${slug}-2.svg`, productSvg({ tone, label, alt: true }));
});

// Danh mục
[
  ["dam", "Đầm"],
  ["ao", "Áo"],
  ["quan", "Quần"],
  ["chan-vay", "Chân váy"],
  ["set-do", "Set đồ"],
].forEach(([slug, label], i) => {
  write(`categories/${slug}.svg`, tileSvg({ tone: TONES[i], label }));
});

// Banner dự phòng (bản seed dùng /images/hero.jpg, /images/new-arrivals.jpg)
write("hero.svg", bannerSvg({ w: 1600, h: 2000, tone: PALETTE.surface2, label: "Trang phục dự tiệc" }));
write("new-arrivals.svg", bannerSvg({ w: 1400, h: 1000, tone: PALETTE.surface, label: "Bộ sưu tập Luce", sub: "Đầm dáng đuôi cá" }));

// Blog
[
  ["cach-phoi-do-toi-gian-quanh-nam", "Phối đồ tối giản"],
  ["chon-chat-lieu-ben-dep", "Chọn chất liệu bền đẹp"],
  ["bang-mau-trung-tinh-cho-tu-do", "Bảng màu trung tính"],
].forEach(([slug, label], i) => {
  write(`blog/${slug}.svg`, bannerSvg({ w: 1200, h: 800, tone: TONES[i + 3], label }));
});

// OG image
write("og.svg", bannerSvg({ w: 1200, h: 630, tone: PALETTE.surface, label: "LUMÉA", sub: "Thời trang thiết kế tối giản" }));

console.log("Xong.");
