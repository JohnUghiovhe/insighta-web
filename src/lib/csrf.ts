import crypto from "node:crypto";
import { cookies } from "next/headers";

const CSRF_COOKIE = "insighta_csrf";

export const getCsrfToken = async (): Promise<string> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(CSRF_COOKIE)?.value;
  if (value) {
    return value;
  }

  const token = crypto.randomUUID().replace(/-/g, "");
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  return token;
};

export const readCsrfToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE)?.value ?? null;
};