"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type ActionState } from "@/actions/admin";
import { Fieldset, Input } from "@/components/ui/Field";
import { buttonClasses } from "@/components/ui/Button";

const initial: ActionState = { ok: false };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClasses({ variant: "primary", size: "lg", className: "w-full" })}>
      {pending ? "Đang đăng nhập…" : "Đăng nhập"}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, initial);
  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next ?? "/admin"} />
      <Fieldset label="Email" htmlFor="email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </Fieldset>
      <Fieldset label="Mật khẩu" htmlFor="password" error={state.fieldErrors?.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Fieldset>
      {state.message ? (
        <p className="rounded-sm border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">
          {state.message}
        </p>
      ) : null}
      <Submit />
    </form>
  );
}
