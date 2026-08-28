import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-bg focus:px-4 focus:py-2 focus:text-ink focus:ring-2 focus:ring-ink"
      >
        Bỏ qua tới nội dung
      </a>
      <Header />
      <main id="noi-dung" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
