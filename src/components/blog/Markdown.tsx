import { Fragment, type ReactNode } from "react";

/** Renderer Markdown tối giản cho nội dung blog nội bộ (## heading, đoạn văn, **đậm**). */
export function Markdown({ source }: { source: string }) {
  const blocks = source.split(/\n{2,}/);
  return (
    <div className="space-y-4 text-ink-soft">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="text-h3 text-ink">
              {inline(trimmed.slice(3))}
            </h2>
          );
        }
        if (trimmed.startsWith("- ")) {
          const items = trimmed.split("\n").map((l) => l.replace(/^-\s+/, ""));
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {items.map((it, j) => (
                <li key={j}>{inline(it)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="max-w-prose">
            {inline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
