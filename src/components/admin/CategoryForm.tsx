"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { saveCategoryAction, type ActionState } from "@/actions/admin";
import { Fieldset, Input, Textarea } from "@/components/ui/Field";
import { buttonClasses } from "@/components/ui/Button";

type Editing = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
} | null;

const initial: ActionState = { ok: false };

function Submit({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClasses({ variant: "primary", size: "md" })}>
      {pending ? "Đang lưu…" : editing ? "Cập nhật" : "Thêm danh mục"}
    </button>
  );
}

export function CategoryForm({ editing }: { editing: Editing }) {
  const [state, formAction] = useActionState(saveCategoryAction, initial);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fe = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      router.replace("/admin/danh-muc");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 border border-line p-5">
      <p className="text-h4 text-ink">{editing ? `Sửa: ${editing.name}` : "Thêm danh mục"}</p>
      {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

      <Fieldset label="Tên" htmlFor="cat-name" required error={fe.name}>
        <Input id="cat-name" name="name" defaultValue={editing?.name} required />
      </Fieldset>
      <Fieldset label="Slug" htmlFor="cat-slug" hint="Để trống sẽ tự sinh.">
        <Input id="cat-slug" name="slug" defaultValue={editing?.slug} />
      </Fieldset>
      <Fieldset label="Mô tả" htmlFor="cat-desc">
        <Textarea id="cat-desc" name="description" rows={2} defaultValue={editing?.description ?? ""} />
      </Fieldset>
      <div className="grid grid-cols-2 gap-4">
        <Fieldset label="Ảnh (URL)" htmlFor="cat-img">
          <Input id="cat-img" name="imageUrl" defaultValue={editing?.imageUrl ?? ""} placeholder="/images/..." />
        </Fieldset>
        <Fieldset label="Thứ tự" htmlFor="cat-order">
          <Input id="cat-order" name="sortOrder" inputMode="numeric" defaultValue={editing?.sortOrder ?? 0} />
        </Fieldset>
      </div>

      {state.message && !state.ok ? <p className="text-sm text-error">{state.message}</p> : null}

      <div className="flex gap-2">
        <Submit editing={Boolean(editing)} />
        {editing ? (
          <button
            type="button"
            onClick={() => router.replace("/admin/danh-muc")}
            className={buttonClasses({ variant: "ghost", size: "md" })}
          >
            Huỷ sửa
          </button>
        ) : null}
      </div>
    </form>
  );
}
