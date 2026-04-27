import { redirect } from "next/navigation";
import { readSessionFromCookies } from "@/lib/backend";

export default function HomePage() {
  const session = readSessionFromCookies();
  redirect(session ? "/dashboard" : "/login");
}