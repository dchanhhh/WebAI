// Tải ảnh sản phẩm mẫu về public/images/ để thay ảnh SVG placeholder.
//
// NGUỒN & BẢN QUYỀN: ảnh thuộc NEM Fashion (nemshop.vn), CDN cdn.hstatic.net.
// Chỉ dùng tạm cho bản demo/nội bộ. PHẢI thay bằng ảnh tự chụp / ảnh có bản
// quyền hợp lệ trước khi đưa website ra thương mại.
//
// Chạy: node scripts/fetch-nem-images.mjs
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "images");
const B = "https://cdn.hstatic.net/products/200000182297/";

const FILES = {
  // ── Đầm ────────────────────────────────────────────────────────────────
  "products/dam-lua-eterna-den-1.jpg": B + "70659472731487922_1380940752195051092_b0476eee530cbca8558d6a6de642889b_e299fb0ba0604c66a30d4b7ac1545609_1024x1024.jpg",
  "products/dam-lua-eterna-den-2.jpg": B + "d642723412663850428p1399dt__2__31f96dd7aba24648a9ae47439d320b76_1024x1024.jpg",
  "products/dam-du-tiec-spark-xanh-reu-1.jpg": B + "70659472731487922_1380940752195051092_b0476eee530cbca8558d6a6de642889b_1a554303b6f54ec1b9e9d26720eecd96_1024x1024.jpg",
  "products/dam-du-tiec-spark-xanh-reu-2.jpg": B + "d642523422663190428p1399dt__1__89c2f41269e04cd3881d986b12af043b_1024x1024.jpg",
  "products/dam-da-hoi-alnich-xanh-navy-1.jpg": B + "1.3_30f274f9740b40e78ab6c205d0ff8a07_1024x1024.jpg",
  "products/dam-da-hoi-alnich-xanh-navy-2.jpg": B + "1.4_45a45d212f784e1ea52f89e1d4eb81fb_1024x1024.jpg",
  "products/dam-suong-meena-do-man-1.jpg": B + "1.2_df7a85a7da1340088e5bd2d05e83ee8e_1024x1024.jpg",
  "products/dam-suong-meena-do-man-2.jpg": B + "1.3_962d17ed1e4f4c0ea0b89c27fd26bd62_1024x1024.jpg",
  "products/dam-hoa-tiet-co-beo-1.jpg": B + "70659472731487922_1380940752195051092_b0476eee530cbca8558d6a6de642889b_9d305f20909c4b70b655097bb73b2a77_1024x1024.jpg",
  "products/dam-hoa-tiet-co-beo-2.jpg": B + "d642323422663420428p1599dt__2__1__0483ef164d3f4576b9c177d4721629a8_1024x1024.jpg",

  // ── Áo ─────────────────────────────────────────────────────────────────
  "products/ao-so-mi-lua-camille-trang-1.jpg": B + "sm021521232663470401p1099dt_z013921542662110410p899dt__3__4f5576aa98cc4eca891dd5f7f7a6ead4_1024x1024.jpg",
  "products/ao-so-mi-lua-camille-trang-2.jpg": B + "sm021521232663470401p1099dt_z013921542662110410p899dt__1__43364a62908347a8870a17d753b62b7f_1024x1024.jpg",
  "products/ao-kieu-dap-hoa-noi-1.jpg": B + "vvvv_56cce96e8e7d4220ae04019493247a76_1024x1024.jpg",
  "products/ao-kieu-dap-hoa-noi-2.jpg": B + "sm623523232663430457p999dt_q670723722663180457p899dt.jpg__2__f05ce564f7e14926aa42556e997b9ae3_1024x1024.jpg",
  "products/ao-thun-cotton-basic-xam-1.jpg": B + "2_aa9652b21a7542738e767b14a46e2a6f_1024x1024.jpg",
  "products/ao-thun-cotton-basic-xam-2.jpg": B + "ts600321902662840411p499dt_z002921512662140274p799dt__5__0e318f498eb340e1898558b39736cccd_1024x1024.jpg",
  "products/ao-len-co-be-1.jpg": B + "aawdaw_3f75804091f64231867b17271f32224b_1024x1024.jpg",
  "products/ao-len-co-be-2.jpg": B + "al624123932663060470p599dt_q671023732663960491p799dt.jpg__5__59fa1ccdfd344de787d691f187db206c_1024x1024.jpg",

  // ── Quần ───────────────────────────────────────────────────────────────
  "products/quan-au-ong-suong-den-1.png": B + "sm623321212663580428p799dt_q022221722663110474p999dt.jpg__6__46c6cfbfcc904cfa9723f9a36e1d291f_1024x1024.png",
  "products/quan-au-ong-suong-den-2.png": B + "sm623321212663580428p799dt_q022221722663110474p999dt.jpg__11__5532a96fe7974f788f2222613d632ae6_1024x1024.png",
  "products/quan-jeans-straight-xanh-1.jpg": B + "2_91ddc535589b42f49ba4581710d73b86_1024x1024.jpg",
  "products/quan-jeans-straight-xanh-2.jpg": B + "al623623932663020470p599dt_q671023732663960491p799dt__3__2__25d510c031c54afd9d100c4ce3c5405c_1024x1024.jpg",
  "products/quan-baggy-den-1.jpg": B + "1_444927bd53474920a756519403d082c1_1024x1024.jpg",
  "products/quan-baggy-den-2.jpg": B + "sm012621222662400457p899dt_q013121722662110474p799dt.jpg__6__87dae0cc81df49f390b965a10e3035b6_1024x1024.jpg",

  // ── Chân váy ───────────────────────────────────────────────────────────
  "products/chan-vay-midi-xep-ly-nau-1.jpg": B + "1.7_9d33f7abfeb7418380f2a8a8ded452bf_1024x1024.jpg",
  "products/chan-vay-midi-xep-ly-nau-2.jpg": B + "1.2_167ade532ca540d8a8a97a1a498ae23c_1024x1024.jpg",
  "products/chan-vay-voan-hoa-tiet-1.jpg": B + "1.8_9ec5ccf25e7746da913a3a818a1aa090_1024x1024.jpg",
  "products/chan-vay-voan-hoa-tiet-2.jpg": B + "1.2_f8f948028ddc4d93b8f584b9719b0a9a_1024x1024.jpg",

  // ── Set đồ ─────────────────────────────────────────────────────────────
  "products/set-bo-thiet-ke-hw6905-1.jpg": B + "2_be3ceea470cc40938b2b7d877b1362c7_1024x1024.jpg",
  "products/set-bo-thiet-ke-hw6905-2.jpg": B + "hw690523792663100428p2099dt__2__2__047178cffd4b4c0981c7c17174097a7c_1024x1024.jpg",
  "products/set-bo-linen-thanh-lich-1.jpg": B + "1.2_f0ec97c84b0b45818b7303f55cfe454d_1024x1024.jpg",
  "products/set-bo-linen-thanh-lich-2.jpg": B + "1.6_95eda0b4bb7741c49ac86b3fcda1549e_1024x1024.jpg",

  // ── Banner mặt tiền ────────────────────────────────────────────────────
  "hero.jpg": B + "1.9_eccfcf0fe1a64db3b91cab93b9a9aa75_1024x1024.jpg",
  "new-arrivals.jpg": B + "1.2_308ff66d76c3499b9fcb64bf7ad5834e_1024x1024.jpg",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

const ok = [];
const fail = [];

for (const [rel, url] of Object.entries(FILES)) {
  const dest = join(outDir, rel);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Referer: "https://nemshop.vn/" } });
    if (!res.ok) {
      fail.push(`${rel}  ← HTTP ${res.status}  ${url}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1024) {
      fail.push(`${rel}  ← chỉ ${buf.length} byte  ${url}`);
      continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, buf);
    ok.push(`${rel}  (${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (e) {
    fail.push(`${rel}  ← ${e.message}  ${url}`);
  }
}

console.log(`\n✓ Tải xong ${ok.length} ảnh:`);
ok.forEach((l) => console.log("  ", l));
if (fail.length) {
  console.log(`\n✗ Lỗi ${fail.length} ảnh:`);
  fail.forEach((l) => console.log("  ", l));
  process.exitCode = 1;
}
