import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // node_modules trong worktree này là symlink trỏ ra ngoài (junction dùng
  // chung giữa các git worktree) — nếu không khai báo rõ root, output file
  // tracing của Next.js suy đoán sai và có thể cố quét cả thư mục người dùng
  // Windows (vd. "C:\Users\<user>\Application Data", một junction bị chặn
  // quyền), gây lỗi EPERM khi build.
  outputFileTracingRoot: __dirname,
  images: {
    // Ảnh sản phẩm phục vụ từ /public; cho phép SVG placeholder nội bộ.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

// Chỉ khởi tạo Cloudflare dev bindings khi chạy `next dev` — gọi cả lúc
// `next build` khiến Miniflare quét cả thư mục người dùng Windows
// (vd. "C:\Users\<user>\Cookies", "...\Application Data" — các junction hệ
// thống bị chặn quyền) và làm build lỗi EPERM.
if (process.env.NODE_ENV === "development") {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}
