"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconMinus, IconPlus } from "@/components/ui/icons";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    priceVnd: number;
    salePriceVnd: number | null;
    stock: number;
    imageUrl?: string;
    sizes: string[];
    colors: string[];
  };
};

export function AddToCartForm({ product }: Props) {
  const add = useCart((s) => s.add);
  const [size, setSize] = useState<string | undefined>(
    product.sizes.length === 1 ? product.sizes[0] : undefined,
  );
  const [color, setColor] = useState<string | undefined>(
    product.colors.length === 1 ? product.colors[0] : undefined,
  );
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const soldOut = product.stock <= 0;
  const maxQty = Math.max(1, Math.min(99, product.stock || 99));

  function handleAdd() {
    if (product.sizes.length > 0 && !size) return setError("Vui lòng chọn size");
    if (product.colors.length > 0 && !color) return setError("Vui lòng chọn màu");
    setError(null);
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceVnd: product.salePriceVnd ?? product.priceVnd,
        imageUrl: product.imageUrl,
        size,
        color,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="space-y-5">
      {product.colors.length > 0 ? (
        <Picker
          label="Màu sắc"
          options={product.colors}
          value={color}
          onChange={setColor}
        />
      ) : null}
      {product.sizes.length > 0 ? (
        <Picker label="Kích cỡ" options={product.sizes} value={size} onChange={setSize} />
      ) : null}

      <div>
        <p className="mb-2 text-overline text-ink">Số lượng</p>
        <div className="inline-flex items-center border border-line">
          <button
            type="button"
            aria-label="Giảm"
            className="grid h-11 w-11 place-items-center text-ink hover:bg-surface disabled:opacity-40"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
          >
            <IconMinus width={15} height={15} />
          </button>
          <span className="w-12 text-center text-base">{qty}</span>
          <button
            type="button"
            aria-label="Tăng"
            className="grid h-11 w-11 place-items-center text-ink hover:bg-surface disabled:opacity-40"
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            disabled={qty >= maxQty}
          >
            <IconPlus width={15} height={15} />
          </button>
        </div>
        {product.stock > 0 && product.stock <= 5 ? (
          <p className="mt-2 text-sm text-sale">Chỉ còn {product.stock} sản phẩm</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-error">{error}</p> : null}

      <Button
        type="button"
        variant="primary"
        size="lg"
        className="w-full sm:w-auto"
        disabled={soldOut}
        onClick={handleAdd}
      >
        {soldOut ? "Hết hàng" : added ? "Đã thêm vào giỏ ✓" : "Thêm vào giỏ"}
      </Button>
    </div>
  );
}

function Picker({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-overline text-ink">
        {label}
        {value ? <span className="ml-2 font-normal normal-case tracking-normal text-muted">{value}</span> : null}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "min-w-11 rounded-sm border px-3 py-2 text-sm transition-colors",
              value === opt
                ? "border-ink bg-ink text-bg"
                : "border-line text-ink hover:border-ink",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
