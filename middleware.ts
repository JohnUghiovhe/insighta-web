import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "insighta_access_token";
const REFRESH_COOKIE = "insighta_refresh_token";
const ACCESS_EXPIRES_COOKIE = "insighta_access_expires_at";
const REFRESH_EXPIRES_COOKIE = "insighta_refresh_expires_at";
const USER_COOKIE = "insighta_user";
const CSRF_COOKIE = "insighta_csrf";

const protectedPrefixes = ["/dashboard", "/profiles", "/search", "/account"];

const getApiBaseUrl = (): string => {
  const baseUrl = process.env.INSIGHTA_API_BASE_URL?.trim();
  if (baseUrl) {
    return baseUrl.replace(/\/$/, "");
  }
  return "https://intelligence-query-engine-production.up.railway.app";
};

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/"
});

const parseIso = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};

const createCsrfToken = (): string => crypto.randomUUID().replace(/-/g, "");

const isProtectedPath = (pathname: string): boolean => protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

const setSessionCookies = (
  response: NextResponse,
  payload: {
    accessToken: string;
    refreshToken: string;
    accessExpiresAt: string;
    refreshExpiresAt: string;
    user?: unknown;
  }
) => {
  response.cookies.set(ACCESS_COOKIE, payload.accessToken, cookieOptions());
  response.cookies.set(REFRESH_COOKIE, payload.refreshToken, cookieOptions());
  response.cookies.set(ACCESS_EXPIRES_COOKIE, payload.accessExpiresAt, cookieOptions());
  response.cookies.set(REFRESH_EXPIRES_COOKIE, payload.refreshExpiresAt, cookieOptions());
  if (payload.user) {
    response.cookies.set(USER_COOKIE, JSON.stringify(payload.user), cookieOptions());
  }
};

async function refreshSession(request: NextRequest, response: NextResponse): Promise<boolean> {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const refreshExpiresAt = parseIso(request.cookies.get(REFRESH_EXPIRES_COOKIE)?.value);
  if (!refreshToken || !refreshExpiresAt || Date.now() >= refreshExpiresAt) {
    return false;
  }

  const refreshResponse = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store"
  });

  if (!refreshResponse.ok) {
    return false;
  }

  const data = (await refreshResponse.json()) as {
    access_token: string;
    refresh_token: string;
    access_token_expires_in_seconds: number;
    refresh_token_expires_in_seconds: number;
  };

  const accessExpiresAt = new Date(Date.now() + data.access_token_expires_in_seconds * 1000).toISOString();
  const refreshExpiresAtNext = new Date(Date.now() + data.refresh_token_expires_in_seconds * 1000).toISOString();
  setSessionCookies(response, {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessExpiresAt,
    refreshExpiresAt: refreshExpiresAtNext
  });
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();
  if (!request.cookies.get(CSRF_COOKIE)?.value && (isProtectedPath(pathname) || pathname.startsWith("/api"))) {
    response.cookies.set(CSRF_COOKIE, createCsrfToken(), {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
  }

  if (!isProtectedPath(pathname)) {
    return response;
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const accessExpiresAt = parseIso(request.cookies.get(ACCESS_EXPIRES_COOKIE)?.value);
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (accessExpiresAt && Date.now() >= accessExpiresAt) {
    const refreshed = await refreshSession(request, response);
    if (!refreshed) {
      response.cookies.delete(ACCESS_COOKIE);
      response.cookies.delete(REFRESH_COOKIE);
      response.cookies.delete(ACCESS_EXPIRES_COOKIE);
      response.cookies.delete(REFRESH_EXPIRES_COOKIE);
      response.cookies.delete(USER_COOKIE);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};