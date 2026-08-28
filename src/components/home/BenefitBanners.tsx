import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { IconReturn, IconTruck, IconCheck } from "@/components/ui/icons";

const benefits = [
  {
    icon: IconTruck,
    title: "Miễn phí giao hàng",
    desc: "Cho đơn từ 500.000 ₫ trên toàn quốc.",
  },
  {
    icon: IconReturn,
    title: "Đổi trả trong 30 ngày",
    desc: "Đổi size hoặc hoàn tiền nếu chưa qua sử dụng.",
  },
  {
    icon: IconCheck,
    title: "Thanh toán an toàn",
    desc: "COD hoặc chuyển khoản — không phát sinh phí ẩn.",
  },
];

export function BenefitBanners() {
  return (
    <section className="border-y border-line bg-bg py-12">
      <Container>
        <Reveal className="grid gap-8 sm:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <b.icon width={24} height={24} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="text-h4 text-ink">{b.title}</p>
                <p className="mt-1 text-sm text-muted">{b.desc}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
