import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/backend";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const callbackUrl = new URL("/api/auth/callback", request.nextUrl.origin).toString();
  const apiBase = getApiBaseUrl();
  const loginUrl = new URL(`${apiBase}/auth/github`);
  loginUrl.searchParams.set("callback_url", callbackUrl);
  
  return NextResponse.redirect(loginUrl.toString());
}