import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import {
  ADMIN_COOKIE_NAME,
  SESSION_MAX_AGE,
  getSessionSecret,
} from "@/lib/session";

export type AdminSession = { email: string };

/**
 * Lấy bcrypt hash của admin. Ưu tiên ADMIN_PASSWORD_HASH_B64 (base64) vì hash
 * bcrypt chứa ký tự `$` sẽ bị dotenv-expand của Next.js bóc mất nếu để thô.
 */
function getAdminHash(): string {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (b64) {
    try {
      return Buffer.from(b64, "base64").toString("utf8");
    } catch {
      return "";
    }
  }
  return process.env.ADMIN_PASSWORD_HASH ?? "";
}

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const hash = getAdminHash();
  if (!adminEmail || !hash.startsWith("$2")) return false;
  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) return false;
  return bcrypt.compare(password, hash);
}

export async function createSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSessionSecret());

  (await cookies()).set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(ADMIN_COOKIE_NAME);
}

/** Đọc phiên từ cookie. Trả null nếu không hợp lệ. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    if (typeof payload.email === "string") return { email: payload.email };
    return null;
  } catch {
    return null;
  }
}

/** Bắt buộc có phiên; nếu không -> redirect về trang đăng nhập. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
