import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function PromoBanner() {
  return (
    <section className="bg-surface-2">
      <Reveal>
        <Container className="py-20 text-center lg:py-28">
          <p className="text-overline text-ink-soft">Ưu đãi đặc biệt</p>
          <p className="mt-3 text-hero text-ink">Giảm đến 30%</p>
          <p className="mx-auto mt-4 max-w-md text-ink-soft">
            Áp dụng cho các thiết kế được chọn trong tháng này. Số lượng có hạn.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/shop?on-sale=1" variant="primary" size="lg">
              Mua ngay
            </ButtonLink>
          </div>
        </Container>
      </Reveal>
    </section>
  );
}
