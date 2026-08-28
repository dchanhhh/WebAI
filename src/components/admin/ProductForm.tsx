"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { saveProductAction, type ActionState } from "@/actions/admin";
import { Fieldset, Input, Textarea, Select, Label } from "@/components/ui/Field";
import { buttonClasses } from "@/components/ui/Button";
import { IconClose } from "@/components/ui/icons";

type Category = { id: string; name: string };
type Initial = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  priceVnd?: number;
  salePriceVnd?: number | null;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  isActive?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
};

const initialState: ActionState = { ok: false };

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonClasses({ variant: "primary", size: "md" })}
    >
      {pending ? "Đang lưu…" : isEdit ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
    </button>
  );
}

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Initial;
}) {
  const [state, formAction] = useActionState(saveProductAction, initialState);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isEdit = Boolean(initial?.id);
  const fe = state.fieldErrors ?? {};

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Tải ảnh thất bại");
      setImages((prev) => [...prev, data.url]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Tải ảnh thất bại");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="images" value={images.join("\n")} />

      <div className="space-y-5">
        <Fieldset label="Tên sản phẩm" htmlFor="name" required error={fe.name}>
          <Input id="name" name="name" defaultValue={initial?.name} required />
        </Fieldset>

        <Fieldset label="Đường dẫn (slug)" htmlFor="slug" hint="Để trống sẽ tự sinh từ tên.">
          <Input id="slug" name="slug" defaultValue={initial?.slug} placeholder="tu-dong-tao" />
        </Fieldset>

        <Fieldset label="Mô tả" htmlFor="description" required error={fe.description}>
          <Textarea id="description" name="description" rows={5} defaultValue={initial?.description} required />
        </Fieldset>

        <div className="grid gap-5 sm:grid-cols-3">
          <Fieldset label="Giá (₫)" htmlFor="priceVnd" required error={fe.priceVnd}>
            <Input id="priceVnd" name="priceVnd" inputMode="numeric" defaultValue={initial?.priceVnd} required />
          </Fieldset>
          <Fieldset label="Giá KM (₫)" htmlFor="salePriceVnd" error={fe.salePriceVnd} hint="Bỏ trống nếu không giảm.">
            <Input id="salePriceVnd" name="salePriceVnd" inputMode="numeric"
              defaultValue={initial?.salePriceVnd ?? ""} />
          </Fieldset>
          <Fieldset label="Tồn kho" htmlFor="stock" required error={fe.stock}>
            <Input id="stock" name="stock" inputMode="numeric" defaultValue={initial?.stock ?? 0} required />
          </Fieldset>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Fieldset label="Kích cỡ" htmlFor="sizes" hint="Phân tách bằng dấu phẩy. Vd: S, M, L">
            <Input id="sizes" name="sizes" defaultValue={initial?.sizes?.join(", ")} />
          </Fieldset>
          <Fieldset label="Màu sắc" htmlFor="colors" hint="Phân tách bằng dấu phẩy.">
            <Input id="colors" name="colors" defaultValue={initial?.colors?.join(", ")} />
          </Fieldset>
        </div>

        <div>
          <Label>Hình ảnh</Label>
          <div className="flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div key={url + i} className="relative h-28 overflow-hidden border border-line" style={{ width: 84 }}>
                <Image src={url} alt="" fill sizes="84px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  aria-label="Xoá ảnh"
                  className="absolute right-0 top-0 grid h-6 w-6 place-items-center bg-ink/70 text-white"
                >
                  <IconClose width={12} height={12} />
                </button>
              </div>
            ))}
            <label className="grid h-28 cursor-pointer place-items-center border border-dashed border-line text-center text-xs text-muted hover:border-ink" style={{ width: 84 }}>
              {uploading ? "Đang tải…" : "+ Thêm ảnh"}
              <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
            </label>
          </div>
          {uploadError ? <p className="mt-1 text-sm text-error">{uploadError}</p> : null}
          <p className="mt-2 text-sm text-muted">Ảnh đầu tiên là ảnh chính. Ảnh thứ hai hiện khi rê chuột.</p>
        </div>

        {state.message ? (
          <p className="rounded-sm border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">
            {state.message}
          </p>
        ) : null}
      </div>

      <aside className="h-fit space-y-5 border border-line p-5">
        <Fieldset label="Danh mục" htmlFor="categoryId" required error={fe.categoryId}>
          <Select id="categoryId" name="categoryId" defaultValue={initial?.categoryId ?? ""} required>
            <option value="" disabled>
              — Chọn danh mục —
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Fieldset>

        <div className="space-y-2.5 border-t border-line pt-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} />
            Đang bán (bỏ chọn = ẩn)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isNew" defaultChecked={initial?.isNew ?? false} />
            Gắn nhãn “Mới”
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" defaultChecked={initial?.isFeatured ?? false} />
            Nổi bật ở trang chủ
          </label>
        </div>

        <div className="flex flex-col gap-2 border-t border-line pt-4">
          <SubmitButton isEdit={isEdit} />
          <Link href="/admin/san-pham" className={buttonClasses({ variant: "ghost", size: "md", className: "justify-center" })}>
            Huỷ
          </Link>
        </div>
      </aside>
    </form>
  );
}
