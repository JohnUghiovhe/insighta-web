import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { AuthCallbackResponse } from "@/lib/types";
import { getApiBaseUrl, getBrowserCallbackUrl } from "@/lib/backend";

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/"
});

const csrfOptions = () => ({
  httpOnly: false,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/"
});

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=missing_oauth_params", request.url));
  }

  const callbackResponse = await fetch(`${getApiBaseUrl()}/auth/github/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`, {
    method: "GET",
    cache: "no-store"
  });

  if (!callbackResponse.ok) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
  }

  const payload = (await callbackResponse.json()) as AuthCallbackResponse;
  const response = NextResponse.redirect(new URL("/dashboard", request.url));

  const accessExpiresAt = new Date(Date.now() + payload.access_token_expires_in_seconds * 1000).toISOString();
  const refreshExpiresAt = new Date(Date.now() + payload.refresh_token_expires_in_seconds * 1000).toISOString();

  response.cookies.set("insighta_access_token", payload.access_token, cookieOptions());
  response.cookies.set("insighta_refresh_token", payload.refresh_token, cookieOptions());
  response.cookies.set("insighta_access_expires_at", accessExpiresAt, cookieOptions());
  response.cookies.set("insighta_refresh_expires_at", refreshExpiresAt, cookieOptions());
  response.cookies.set("insighta_user", JSON.stringify(payload.data), cookieOptions());
  response.cookies.set("insighta_csrf", crypto.randomUUID().replace(/-/g, ""), csrfOptions());

  return response;
}

export const dynamic = "force-dynamic";