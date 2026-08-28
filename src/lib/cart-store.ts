"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Bộ nhớ an toàn khi không có localStorage (SSR / test / private mode).
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
const safeStorage = () =>
  typeof window !== "undefined" && window.localStorage ? window.localStorage : noopStorage;

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  priceVnd: number;
  imageUrl?: string;
  size?: string;
  color?: string;
  qty: number;
};

const lineKey = (l: Pick<CartLine, "productId" | "size" | "color">) =>
  `${l.productId}::${l.size ?? ""}::${l.color ?? ""}`;

type CartState = {
  items: CartLine[];
  isOpen: boolean;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (line, qty = 1) =>
        set((state) => {
          const key = lineKey(line);
          const existing = state.items.find((l) => lineKey(l) === key);
          if (existing) {
            return {
              items: state.items.map((l) =>
                lineKey(l) === key ? { ...l, qty: Math.min(99, l.qty + qty) } : l,
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { ...line, qty }], isOpen: true };
        }),
      setQty: (key, qty) =>
        set((state) => ({
          items: state.items
            .map((l) => (lineKey(l) === key ? { ...l, qty: Math.max(0, Math.min(99, qty)) } : l))
            .filter((l) => l.qty > 0),
        })),
      remove: (key) =>
        set((state) => ({ items: state.items.filter((l) => lineKey(l) !== key) })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: "nhamay-cart",
      storage: createJSONStorage(safeStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

export { lineKey };

export const selectCount = (s: CartState) =>
  s.items.reduce((sum, l) => sum + l.qty, 0);

export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, l) => sum + l.priceVnd * l.qty, 0);
