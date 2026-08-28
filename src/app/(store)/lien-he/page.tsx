import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Thông tin liên hệ và hỗ trợ khách hàng của Nhà May.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Liên hệ"
        breadcrumb={[{ label: "Liên hệ" }]}
        description="Cần tư vấn size hoặc hỗ trợ đơn hàng? Liên hệ với chúng tôi qua các kênh dưới đây."
      />
      <Container className="max-w-3xl py-14 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-overline text-ink">Cửa hàng</p>
            <p className="mt-3 text-ink-soft">{CONTACT.address}</p>
            <p className="mt-1 text-sm text-muted">Mở cửa 9:00 – 21:00 hằng ngày</p>
          </div>
          <div>
            <p className="text-overline text-ink">Chăm sóc khách hàng</p>
            <p className="mt-3 text-ink-soft">
              Hotline:{" "}
              <a href={CONTACT.phoneHref} className="underline-offset-4 hover:text-accent hover:underline">
                {CONTACT.phone}
              </a>
            </p>
            <p className="mt-1 text-ink-soft">
              Email:{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="underline-offset-4 hover:text-accent hover:underline"
              >
                {CONTACT.email}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-sm border border-line bg-surface p-6 text-sm text-ink-soft">
          <p className="text-h4 text-ink">Đổi trả & bảo hành</p>
          <p className="mt-2 max-w-prose text-muted">
            Nhà May hỗ trợ đổi size hoặc hoàn tiền trong vòng 30 ngày với sản phẩm còn nguyên tem mác
            và chưa qua sử dụng. Vui lòng giữ lại mã đơn hàng để đối chiếu.
          </p>
        </div>
      </Container>
    </>
  );
}
