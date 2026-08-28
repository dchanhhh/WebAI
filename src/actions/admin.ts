"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getAdminSession,
  verifyCredentials,
  createSession,
  destroySession,
} from "@/lib/auth";
import { loginSchema, productSchema, categorySchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import { ORDER_STATUS_KEYS } from "@/lib/constants";

export type ActionState = { ok: boolean; message?: string; fieldErrors?: Record<string, string> };

async function assertAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

function zodFieldErrors(issues: { path: (string | number)[]; message: string }[]) {
  const fe: Record<string, string> = {};
  for (const i of issues) {
    const k = i.path[0];
    if (typeof k === "string" && !fe[k]) fe[k] = i.message;
  }
  return fe;
}

// ---- Auth ----

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error.issues) };
  }
  const valid = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!valid) {
    return { ok: false, message: "Email hoặc mật khẩu không đúng." };
  }
  await createSession(parsed.data.email);
  const next = String(formData.get("next") || "/admin");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ---- Helpers ----

function parseList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function uniqueSlug(base: string, model: "product" | "category", ignoreId?: string) {
  const root = slugify(base) || "muc";
  let slug = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found =
      model === "product"
        ? await prisma.product.findFirst({ where: { slug, NOT: ignoreId ? { id: ignoreId } : undefined } })
        : await prisma.category.findFirst({ where: { slug, NOT: ignoreId ? { id: ignoreId } : undefined } });
    if (!found) return slug;
    slug = `${root}-${++n}`;
  }
}

// ---- Products ----

export async function saveProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const id = String(formData.get("id") || "");

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    priceVnd: formData.get("priceVnd"),
    salePriceVnd: formData.get("salePriceVnd"),
    stock: formData.get("stock"),
    sizes: parseList(formData.get("sizes")),
    colors: parseList(formData.get("colors")),
    images: parseList(formData.get("images")),
    isActive: formData.get("isActive") === "on",
    isNew: formData.get("isNew") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!parsed.success) {
    return { ok: false, message: "Kiểm tra lại thông tin.", fieldErrors: zodFieldErrors(parsed.error.issues) };
  }
  const d = parsed.data;
  const slug = await uniqueSlug(d.slug || d.name, "product", id || undefined);

  const data = {
    name: d.name,
    slug,
    description: d.description,
    categoryId: d.categoryId,
    priceVnd: d.priceVnd,
    salePriceVnd: d.salePriceVnd,
    stock: d.stock,
    sizes: JSON.stringify(d.sizes),
    colors: JSON.stringify(d.colors),
    isActive: d.isActive,
    isNew: d.isNew,
    isFeatured: d.isFeatured,
  };

  const images = d.images.map((url, i) => ({ url, alt: d.name, sortOrder: i }));

  if (id) {
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: id } }),
      prisma.product.update({
        where: { id },
        data: { ...data, images: { create: images } },
      }),
    ]);
  } else {
    await prisma.product.create({ data: { ...data, images: { create: images } } });
  }

  revalidatePath("/admin/san-pham");
  revalidatePath("/shop");
  redirect("/admin/san-pham?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  if (id) {
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    revalidatePath("/admin/san-pham");
    revalidatePath("/shop");
  }
}

// ---- Categories ----

export async function saveCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error.issues) };
  }
  const d = parsed.data;
  const slug = await uniqueSlug(d.slug || d.name, "category", id || undefined);
  const data = {
    name: d.name,
    slug,
    description: d.description ?? null,
    imageUrl: d.imageUrl ?? null,
    sortOrder: d.sortOrder,
  };
  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });

  revalidatePath("/admin/danh-muc");
  return { ok: true, message: "Đã lưu danh mục." };
}

export async function deleteCategoryAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/danh-muc");
}

// ---- Orders ----

export async function updateOrderStatusAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !ORDER_STATUS_KEYS.includes(status as never)) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath(`/admin/don-hang/${id}`);
  revalidatePath("/admin/don-hang");
}
