"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeNewsletter, type NewsletterState } from "@/actions/newsletter";
import { cn } from "@/lib/utils";

const initial: NewsletterState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 shrink-0 rounded-sm bg-bg px-6 text-overline text-ink transition-colors hover:bg-footer-fg-strong disabled:opacity-50"
    >
      {pending ? "Đang gửi…" : "Đăng ký"}
    </button>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeNewsletter, initial);

  return (
    <div>
      <form action={formAction} className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email của bạn
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="Nhập email của bạn"
          className="h-11 w-full min-w-0 rounded-sm border border-white/25 bg-transparent px-3 text-base text-footer-fg-strong placeholder:text-footer-fg focus-visible:border-white focus-visible:outline-none"
        />
        <SubmitButton />
      </form>
      {state.message ? (
        <p className={cn("mt-2 text-sm", state.ok ? "text-success" : "text-error")}>
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
