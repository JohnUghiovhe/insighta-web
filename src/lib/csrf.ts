import crypto from "node:crypto";
import { cookies } from "next/headers";

const CSRF_COOKIE = "insighta_csrf";

export const getCsrfToken = (): string => {
  const value = cookies().get(CSRF_COOKIE)?.value;
  if (value) {
    return value;
  }

  const token = crypto.randomUUID().replace(/-/g, "");
  cookies().set(CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  return token;
};

export const readCsrfToken = (): string | null => cookies().get(CSRF_COOKIE)?.value ?? null;