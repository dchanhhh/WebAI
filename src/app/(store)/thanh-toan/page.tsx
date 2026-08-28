import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Đặt hàng",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        title="Đặt hàng"
        breadcrumb={[{ label: "Giỏ hàng", href: "/gio-hang" }, { label: "Đặt hàng" }]}
      />
      <Container className="py-12 lg:py-16">
        <CheckoutForm />
      </Container>
    </>
  );
}
