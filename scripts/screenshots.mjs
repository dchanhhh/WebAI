// Chụp screenshot các trang chính ở 4 bề rộng QA (CLAUDE.md quy tắc 1).
// Dùng: node scripts/screenshots.mjs [baseURL]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] || "http://localhost:3000";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = join(root, "screenshots");

const WIDTHS = [360, 768, 1024, 1280];
const PAGES = [
  ["trang-chu", "/"],
  ["shop", "/shop"],
  ["danh-muc-dam", "/danh-muc/dam"],
  ["chi-tiet-san-pham", "/san-pham/dam-lua-eterna-den"],
  ["gio-hang", "/gio-hang"],
  ["thanh-toan", "/thanh-toan"],
  ["tra-cuu-don-hang", "/tra-cuu-don-hang"],
  ["blog", "/blog"],
  ["gioi-thieu", "/gioi-thieu"],
  ["admin-login", "/admin/login"],
];

const ADMIN_PAGES = [
  ["admin-tong-quan", "/admin"],
  ["admin-san-pham", "/admin/san-pham"],
  ["admin-san-pham-moi", "/admin/san-pham/moi"],
  ["admin-danh-muc", "/admin/danh-muc"],
  ["admin-don-hang", "/admin/don-hang"],
];

const browser = await chromium.launch();
try {
  // Đăng nhập admin một lần, tái dùng cookie cho các trang /admin
  const authCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const authPage = await authCtx.newPage();
  await authPage.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
  await authPage.fill("#email", "admin@webai.local");
  await authPage.fill("#password", "admin12345");
  await authPage.getByRole("button", { name: "Đăng nhập" }).click();
  await authPage.waitForURL(`${BASE}/admin`, { timeout: 15000 }).catch(() => {});
  const storageState = await authCtx.storageState();
  await authCtx.close();

  for (const [name, path] of ADMIN_PAGES) {
    for (const width of [375, 1280]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, storageState });
      const page = await ctx.newPage();
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(600);
      const dir = join(outRoot, name);
      mkdirSync(dir, { recursive: true });
      await page.screenshot({ path: join(dir, `${width}.png`), fullPage: true });
      await ctx.close();
      console.log(`  ${name} @ ${width}`);
    }
  }

  for (const [name, path] of PAGES) {
    for (const width of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 30000 });
      // Kích hoạt reveal-on-scroll: cuộn hết trang rồi về đầu.
      await page.evaluate(async () => {
        await new Promise((r) => {
          let y = 0;
          const t = setInterval(() => {
            window.scrollBy(0, 600);
            y += 600;
            if (y >= document.body.scrollHeight) {
              clearInterval(t);
              window.scrollTo(0, 0);
              r();
            }
          }, 40);
        });
      });
      await page.waitForTimeout(1900);
      const dir = join(outRoot, name);
      mkdirSync(dir, { recursive: true });
      await page.screenshot({ path: join(dir, `${width}.png`), fullPage: true });
      await ctx.close();
      console.log(`  ${name} @ ${width}`);
    }
  }
} finally {
  await browser.close();
}
console.log("Xong. Ảnh trong screenshots/");
