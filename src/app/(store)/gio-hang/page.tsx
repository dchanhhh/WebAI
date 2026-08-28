import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader title="Giỏ hàng" breadcrumb={[{ label: "Giỏ hàng" }]} />
      <Container className="py-12 lg:py-16">
        <CartView />
      </Container>
    </>
  );
}
