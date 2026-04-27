import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Session, User } from "./types";
import { fetchMe, readSessionFromCookies } from "./backend";

const ACCESS_COOKIE = "insighta_access_token";
const REFRESH_COOKIE = "insighta_refresh_token";
const ACCESS_EXPIRES_COOKIE = "insighta_access_expires_at";
const REFRESH_EXPIRES_COOKIE = "insighta_refresh_expires_at";
const USER_COOKIE = "insighta_user";

export const parseStoredUser = (): User | null => {
  const value = cookies().get(USER_COOKIE)?.value;
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
};

export const getSessionOrRedirect = async (): Promise<Session> => {
  const session = readSessionFromCookies();
  if (!session) {
    redirect("/login");
  }

  if (!session.user) {
    const liveUser = await fetchMe(session);
    if (!liveUser) {
      redirect("/login");
    }
    return { ...session, user: liveUser };
  }

  return session;
};

export const clearSessionCookies = () => {
  const cookieStore = cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  cookieStore.delete(ACCESS_EXPIRES_COOKIE);
  cookieStore.delete(REFRESH_EXPIRES_COOKIE);
  cookieStore.delete(USER_COOKIE);
};