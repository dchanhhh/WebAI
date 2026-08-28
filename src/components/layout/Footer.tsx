import Link from "next/link";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { SITE_NAME, SITE_TAGLINE, CONTACT } from "@/lib/constants";

const infoLinks = [
  { label: "Về Nhà May", href: "/gioi-thieu" },
  { label: "Câu chuyện thương hiệu", href: "/gioi-thieu#cau-chuyen" },
  { label: "Blog", href: "/blog" },
  { label: "Liên hệ", href: "/lien-he" },
];

const discoverLinks = [
  { label: "Đầm", href: "/danh-muc/dam" },
  { label: "Áo", href: "/danh-muc/ao" },
  { label: "Quần & chân váy", href: "/danh-muc/quan" },
  { label: "Phụ kiện", href: "/danh-muc/phu-kien" },
];

const payments = ["Visa", "Mastercard", "JCB", "Momo", "VNPay"];

export function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-fg">
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div>
          <p className="text-h3 text-footer-fg-strong">{SITE_NAME}</p>
          <p className="mt-3 max-w-xs text-sm">{SITE_TAGLINE}. Đầm, áo, chân váy và phụ kiện chọn lọc, may đo tinh tế.</p>
        </div>

        <div>
          <p className="text-overline text-footer-fg-strong">Thông tin</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {infoLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-footer-fg-strong">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-overline text-footer-fg-strong">Khám phá</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {discoverLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-footer-fg-strong">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-overline text-footer-fg-strong">Đăng ký nhận bản tin</p>
          <p className="mt-4 text-sm">Nhận thông tin bộ sưu tập mới và ưu đãi riêng.</p>
          <div className="mt-3">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>{CONTACT.address}</p>
            <p>
              Hotline:{" "}
              <a href={CONTACT.phoneHref} className="hover:text-footer-fg-strong">
                {CONTACT.phone}
              </a>{" "}
              · {CONTACT.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded-sm border border-white/15 px-2 py-1 text-xs text-footer-fg"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="container pb-8 text-xs text-footer-fg">
          © {new Date().getFullYear()} {SITE_NAME}. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
}
