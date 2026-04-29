import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/backend";

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/"
});

const getFormValue = async (request: NextRequest, key: string): Promise<string | null> => {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as { [key: string]: string } | null;
    return body?.[key] ?? null;
  }
  const form = await request.formData().catch(() => null);
  if (!form) {
    return null;
  }
  const value = form.get(key);
  return typeof value === "string" ? value : null;
};

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  for (const cookieName of [
    "insighta_access_token",
    "insighta_refresh_token",
    "insighta_access_expires_at",
    "insighta_refresh_expires_at",
    "insighta_user",
    "insighta_csrf"
  ]) {
    response.cookies.set(cookieName, "", { ...cookieOptions(), maxAge: 0 });
  }
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const csrfToken = await getFormValue(request, "csrf_token");
    const cookieCsrf = request.cookies.get("insighta_csrf")?.value;
    const refreshToken = request.cookies.get("insighta_refresh_token")?.value;

    if (!csrfToken || !cookieCsrf || csrfToken !== cookieCsrf) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      for (const cookieName of [
        "insighta_access_token",
        "insighta_refresh_token",
        "insighta_access_expires_at",
        "insighta_refresh_expires_at",
        "insighta_user",
        "insighta_csrf"
      ]) {
        response.cookies.set(cookieName, "", { ...cookieOptions(), maxAge: 0 });
      }
      return response;
    }

    if (refreshToken) {
      await fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store"
      }).catch(() => null);
    }

    const response = NextResponse.redirect(new URL("/login", request.url));
    for (const cookieName of [
      "insighta_access_token",
      "insighta_refresh_token",
      "insighta_access_expires_at",
      "insighta_refresh_expires_at",
      "insighta_user",
      "insighta_csrf"
    ]) {
      response.cookies.set(cookieName, "", { ...cookieOptions(), maxAge: 0 });
    }

    return response;
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    for (const cookieName of [
      "insighta_access_token",
      "insighta_refresh_token",
      "insighta_access_expires_at",
      "insighta_refresh_expires_at",
      "insighta_user",
      "insighta_csrf"
    ]) {
      response.cookies.set(cookieName, "", { ...cookieOptions(), maxAge: 0 });
    }
    return response;
  }
}

export const dynamic = "force-dynamic";