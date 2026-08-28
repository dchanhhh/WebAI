"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-store";
import type { ProductListItem } from "@/lib/products";

// Nút trên ProductCard. Nếu SP có size/màu -> chuyển sang trang chi tiết để chọn.
export function AddToCartButton({ product }: { product: ProductListItem }) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const [done, setDone] = useState(false);

  const needsOptions = product.sizeList.length > 0 || product.colorList.length > 0;
  const soldOut = product.stock <= 0;

  if (soldOut) {
    return (
      <span className={buttonClasses({ variant: "secondary", size: "sm", className: "w-full cursor-not-allowed opacity-50" })}>
        Hết hàng
      </span>
    );
  }

  return (
    <button
      type="button"
      className={buttonClasses({ variant: "secondary", size: "sm", className: "w-full" })}
      onClick={() => {
        if (needsOptions) {
          router.push(`/san-pham/${product.slug}`);
          return;
        }
        add(
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            priceVnd: product.salePriceVnd ?? product.priceVnd,
            imageUrl: product.images[0]?.url,
          },
          1,
        );
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? "Đã thêm ✓" : needsOptions ? "Chọn mua" : "Thêm vào giỏ"}
    </button>
  );
}
