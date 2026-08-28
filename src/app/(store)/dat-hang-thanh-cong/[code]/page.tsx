import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { IconCheck } from "@/components/ui/icons";
import { OrderSummaryCard } from "@/components/checkout/OrderSummaryCard";
import { BankTransferInfo } from "@/components/checkout/BankTransferInfo";
import { getOrderByCode } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
  robots: { index: false },
};

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const order = await getOrderByCode(decodeURIComponent(code));
  if (!order) notFound();

  return (
    <Container className="max-w-3xl py-14 lg:py-20">
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/10 text-success">
          <IconCheck width={26} height={26} />
        </span>
        <h1 className="mt-5 text-h2 text-ink">Cảm ơn bạn đã đặt hàng!</h1>
        <p className="mt-3 text-muted">
          Đơn <span className="font-medium text-ink">{order.code}</span> đã được ghi nhận. Chúng tôi
          sẽ liên hệ qua số {order.phone} để xác nhận.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {order.paymentMethod === "bank_transfer" ? (
          <BankTransferInfo code={order.code} amount={order.totalVnd} />
        ) : (
          <div className="rounded-sm border border-line bg-surface p-5 text-sm text-ink-soft">
            <p className="text-h4 text-ink">Thanh toán khi nhận hàng</p>
            <p className="mt-1 text-muted">
              Bạn thanh toán {order.totalVnd.toLocaleString("vi-VN")} ₫ bằng tiền mặt cho nhân viên
              giao hàng. Vui lòng giữ điện thoại liên lạc.
            </p>
          </div>
        )}

        <OrderSummaryCard order={order} />
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/shop" variant="secondary">
          Tiếp tục mua sắm
        </ButtonLink>
        <Link
          href={`/tra-cuu-don-hang?code=${order.code}`}
          className="inline-flex h-11 items-center justify-center px-6 text-overline text-ink underline-offset-4 hover:underline"
        >
          Theo dõi đơn hàng
        </Link>
      </div>
    </Container>
  );
}
