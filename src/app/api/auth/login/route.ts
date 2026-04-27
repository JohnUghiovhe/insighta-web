import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/backend";

export async function GET() {
  return NextResponse.redirect(`${getApiBaseUrl()}/auth/github`);
}