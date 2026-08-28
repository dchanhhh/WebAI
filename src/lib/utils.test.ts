import { describe, it, expect } from "vitest";
import { slugify, parseStringArray } from "@/lib/utils";

describe("slugify", () => {
  it("bỏ dấu tiếng Việt và chuẩn hoá", () => {
    expect(slugify("Đầm Lụa Eterna Đen")).toBe("dam-lua-eterna-den");
    expect(slugify("Áo Sơ Mi & Chân Váy")).toBe("ao-so-mi-chan-vay");
    expect(slugify("  Nhiều   khoảng—trắng ")).toBe("nhieu-khoang-trang");
  });
});

describe("parseStringArray", () => {
  it("parse JSON array an toàn", () => {
    expect(parseStringArray('["S","M","L"]')).toEqual(["S", "M", "L"]);
    expect(parseStringArray("")).toEqual([]);
    expect(parseStringArray("khong-phai-json")).toEqual([]);
    expect(parseStringArray(null)).toEqual([]);
  });
});
