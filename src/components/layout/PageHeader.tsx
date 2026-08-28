import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-line bg-surface">
      <Container className="py-10 lg:py-14">
        {breadcrumb ? <Breadcrumb items={breadcrumb} /> : null}
        {eyebrow ? <p className="mt-4 text-overline text-muted">{eyebrow}</p> : null}
        <h1 className="mt-2 text-h2 text-ink">{title}</h1>
        {description ? (
          <div className="mt-3 max-w-prose text-muted">{description}</div>
        ) : null}
        {children}
      </Container>
    </div>
  );
}
