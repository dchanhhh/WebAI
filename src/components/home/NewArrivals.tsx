import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function NewArrivals() {
  return (
    <section className="bg-bg py-16 lg:py-24">
      <Reveal className="mx-auto grid max-w-[1440px] items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="relative aspect-[5/4] w-full lg:aspect-[4/3]">
          <Image
            src="/images/new-arrivals.jpg"
            alt="Bộ sưu tập Luce — đầm dáng đuôi cá"
            fill
            sizes="(min-width:1024px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="px-4 sm:px-6 lg:pr-[max(2.5rem,calc((100vw-1280px)/2))]">
          <p className="text-overline text-muted">Hàng mới về</p>
          <h2 className="mt-3 text-display text-ink">Bộ sưu tập Luce</h2>
          <p className="mt-4 max-w-md text-lg text-ink-soft">
            Đầm dáng đuôi cá thanh lịch — phom ôm nhẹ tôn eo, chân váy loe mềm mại. Một lựa chọn duyên
            dáng cho những buổi hẹn quan trọng.
          </p>
          <div className="mt-7">
            <ButtonLink href="/shop?sort=moi-nhat" variant="secondary" size="md">
              Khám phá ngay
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
