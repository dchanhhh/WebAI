import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Fieldset, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { OrderSummaryCard } from "@/components/checkout/OrderSummaryCard";
import { getOrderByCode } from "@/lib/orders";
import { orderLookupSchema } from "@/lib/validators";
import type { RawSearchParams } from "@/lib/shop-query";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  description: "Nhập mã đơn và số điện thoại để xem trạng thái đơn hàng.",
};

export default async function OrderLookupPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const codeRaw = typeof sp.code === "string" ? sp.code : "";
  const phoneRaw = typeof sp.phone === "string" ? sp.phone : "";

  let result: Awaited<ReturnType<typeof getOrderByCode>> | null = null;
  let error: string | null = null;

  if (codeRaw && phoneRaw) {
    const parsed = orderLookupSchema.safeParse({ code: codeRaw, phone: phoneRaw });
    if (!parsed.success) {
      error = parsed.error.issues[0]?.message ?? "Thông tin không hợp lệ";
    } else {
      const order = await getOrderByCode(parsed.data.code);
      if (!order || order.phone !== parsed.data.phone) {
        error = "Không tìm thấy đơn hàng khớp với mã và số điện thoại đã nhập.";
      } else {
        result = order;
      }
    }
  } else if (codeRaw || phoneRaw) {
    error = "Vui lòng nhập cả mã đơn và số điện thoại.";
  }

  return (
    <>
      <PageHeader
        title="Tra cứu đơn hàng"
        breadcrumb={[{ label: "Tra cứu đơn hàng" }]}
        description="Nhập mã đơn hàng (dạng NM-XXXXXX) và số điện thoại đặt hàng."
      />
      <Container className="max-w-3xl py-12 lg:py-16">
        <form method="get" className="grid gap-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Fieldset label="Mã đơn hàng" htmlFor="code">
            <Input id="code" name="code" defaultValue={codeRaw} placeholder="NM-ABC123" required />
          </Fieldset>
          <Fieldset label="Số điện thoại" htmlFor="phone">
            <Input id="phone" name="phone" defaultValue={phoneRaw} inputMode="tel" placeholder="0xxxxxxxxx" required />
          </Fieldset>
          <Button type="submit" variant="primary" size="md" className="h-11">
            Tra cứu
          </Button>
        </form>

        {error ? (
          <p className="mt-6 rounded-sm border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">
            {error}
          </p>
        ) : null}

        {result ? (
          <div className="mt-8">
            <OrderSummaryCard order={result} />
          </div>
        ) : null}
      </Container>
    </>
  );
}
