import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-prose border border-line px-6 py-16 text-center">
      <p className="text-h3 text-ink">{title}</p>
      {description ? <p className="mt-2 text-muted">{description}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
