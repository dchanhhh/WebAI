// Edge-safe: chỉ dùng jose, không import next/headers / bcrypt / server-only.
// Dùng chung bởi middleware (Edge) và auth.ts (Node).
import { jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "lumea_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 ngày

export function getSessionSecret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("SESSION_SECRET chưa được cấu hình (>= 16 ký tự).");
  }
  return new TextEncoder().encode(s);
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSessionSecret());
    return true;
  } catch {
    return false;
  }
}
