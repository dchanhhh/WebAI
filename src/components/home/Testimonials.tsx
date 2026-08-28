import { Section } from "@/components/ui/Section";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <Section surface>
      <p className="text-overline text-muted">Cảm nhận</p>
      <h2 className="mt-2 max-w-lg text-display text-ink">Khách hàng nói gì về Nhà May</h2>

      <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:mt-16">
        {testimonials.map((t) => (
          <figure key={t.name} className="max-w-md">
            <blockquote className="text-lg text-ink-soft">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-medium uppercase tracking-[0.12em] text-ink">{t.name}</span>
              <span className="mt-0.5 block text-muted">{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
