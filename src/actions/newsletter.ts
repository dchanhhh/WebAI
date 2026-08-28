"use server";

import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validators";

export type NewsletterState = { ok: boolean; message: string };

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Email không hợp lệ" };
  }
  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email },
    });
  } catch {
    return { ok: false, message: "Có lỗi xảy ra, vui lòng thử lại." };
  }
  return { ok: true, message: "Cảm ơn bạn đã đăng ký nhận bản tin!" };
}
