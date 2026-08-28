import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: `Câu chuyện và triết lý thiết kế của ${SITE_NAME}.`,
};

const values = [
  { title: "Tối giản có chủ đích", desc: "Mỗi thiết kế lược bỏ chi tiết thừa, giữ lại phom dáng và tỉ lệ." },
  { title: "Chất liệu thật", desc: "Ưu tiên linen, cotton và lụa tự nhiên — bền, thoáng, đẹp dần theo thời gian." },
  { title: "May đo tử tế", desc: "Sản xuất số lượng nhỏ, kiểm tra từng đường may trước khi đến tay bạn." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Về chúng tôi"
        title={`${SITE_NAME} — thời trang thiết kế tối giản`}
        breadcrumb={[{ label: "Giới thiệu" }]}
        description="Chúng tôi làm quần áo để mặc được nhiều năm, không chạy theo mùa vụ."
      />

      <Container className="max-w-3xl py-14 lg:py-20">
        <Reveal id="cau-chuyen" as="section" className="space-y-4 text-ink-soft">
          <h2 className="text-h3 text-ink">Câu chuyện</h2>
          <p className="max-w-prose">
            {SITE_NAME} bắt đầu từ một xưởng may nhỏ tại TP. Hồ Chí Minh với mong muốn đơn giản: tạo
            ra những món đồ cơ bản thật tốt để phụ nữ Việt mặc mỗi ngày. Chúng tôi tin rằng một chiếc
            áo vừa vặn, một chiếc đầm đúng dáng có thể theo bạn nhiều năm.
          </p>
          <p className="max-w-prose">
            Thay vì ra mắt hàng chục mẫu mỗi tháng, chúng tôi chọn làm ít mà kỹ — mỗi thiết kế được
            thử trên nhiều dáng người, chỉnh đi chỉnh lại trước khi sản xuất.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={(i % 3) * 60}>
              <div>
                <p className="text-h4 text-ink">{v.title}</p>
                <p className="mt-2 text-sm text-muted">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/shop" variant="primary">
            Xem sản phẩm
          </ButtonLink>
          <ButtonLink href="/lien-he" variant="secondary">
            Liên hệ với chúng tôi
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
