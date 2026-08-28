import { describe, it, expect } from "vitest";
import { formatVnd, formatVndPlain, parseVndInput, discountPercent } from "@/lib/money";

describe("money", () => {
  it("formatVnd hiển thị theo định dạng VND", () => {
    expect(formatVnd(149500)).toMatch(/149[.\s]500/);
    expect(formatVnd(149500)).toContain("₫");
    expect(formatVnd(0)).toContain("0");
  });

  it("formatVndPlain không kèm ký hiệu tiền", () => {
    expect(formatVndPlain(1290000)).toBe("1.290.000");
  });

  it("parseVndInput bóc mọi ký tự không phải số", () => {
    expect(parseVndInput("149.500 ₫")).toBe(149500);
    expect(parseVndInput("1,290,000")).toBe(1290000);
    expect(parseVndInput("abc")).toBeNaN();
  });

  it("discountPercent tính % giảm và làm tròn", () => {
    expect(discountPercent(1290000, 990000)).toBe(23);
    expect(discountPercent(100000, 100000)).toBe(0);
    expect(discountPercent(100000, 0)).toBe(0);
  });
});
