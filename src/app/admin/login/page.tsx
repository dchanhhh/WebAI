import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  robots: { index: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  if (await getAdminSession()) redirect(next?.startsWith("/admin") ? next : "/admin");

  return (
    <Container className="flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <p className="text-overline text-muted">{SITE_NAME}</p>
      <h1 className="mt-2 text-h2 text-ink">Đăng nhập quản trị</h1>
      <p className="mt-2 text-sm text-muted">Khu vực dành cho quản trị viên cửa hàng.</p>
      <div className="mt-8">
        <LoginForm next={next} />
      </div>
    </Container>
  );
}
