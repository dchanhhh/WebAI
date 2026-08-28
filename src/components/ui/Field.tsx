import { forwardRef } from "react";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

// design.md §5.2
const controlBase =
  "w-full rounded-sm border border-line bg-bg px-3 text-base text-ink placeholder:text-muted transition-colors focus-visible:outline-none focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/15 aria-[invalid=true]:border-error";

export function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-soft">
      {children}
      {required ? <span className="text-error"> *</span> : null}
    </label>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-sm text-error">{children}</p>;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(controlBase, "h-11", className)} {...props} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(controlBase, "min-h-[96px] py-2.5", className)} {...props} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(controlBase, "h-11 appearance-none pr-8", className)} {...props}>
        {children}
      </select>
    );
  },
);

export function Fieldset({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {hint && !error ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
      <FieldError>{error}</FieldError>
    </div>
  );
}
