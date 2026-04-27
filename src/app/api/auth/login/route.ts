import { NextResponse } from "next/server";
import { getApiBaseUrl, getBrowserCallbackUrl } from "@/lib/backend";

export async function GET() {
  const callbackUrl = getBrowserCallbackUrl();
  const apiBase = getApiBaseUrl();
  const loginUrl = new URL(`${apiBase}/auth/github`);
  loginUrl.searchParams.set("callback_url", callbackUrl);
  
  return NextResponse.redirect(loginUrl.toString());
}