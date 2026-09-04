"use server";

import { searchProductSuggestions, type ProductSuggestion } from "@/lib/products";

/** Gợi ý sản phẩm tức thời cho ô tìm kiếm ở Header (gọi lại khi người dùng gõ). */
export async function getSearchSuggestions(query: string): Promise<ProductSuggestion[]> {
  if (query.trim().length < 2) return [];
  return searchProductSuggestions(query, 5);
}
