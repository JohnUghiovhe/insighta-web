import { cookies } from "next/headers";
import { ListResponse, MeResponse, PageQuery, Profile, Session, SingleProfileResponse, User } from "./types";

const ACCESS_COOKIE = "insighta_access_token";
const REFRESH_COOKIE = "insighta_refresh_token";
const ACCESS_EXPIRES_COOKIE = "insighta_access_expires_at";
const REFRESH_EXPIRES_COOKIE = "insighta_refresh_expires_at";
const USER_COOKIE = "insighta_user";
const CSRF_COOKIE = "insighta_csrf";
const API_VERSION = "1";

export const getApiBaseUrl = (): string => {
  const baseUrl = process.env.INSIGHTA_API_BASE_URL?.trim();
  if (baseUrl) {
    return baseUrl.replace(/\/$/, "");
  }
  return "https://intelligence-query-engine-production.up.railway.app";
};

export const getBrowserCallbackUrl = (): string => {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (origin) {
    return `${origin.replace(/\/$/, "")}/api/auth/callback`;
  }
  return "http://localhost:3000/api/auth/callback";
};

const parseJsonCookie = (value: string | undefined): User | null => {
  if (!value) {
    return null;
  }
  try {
    const parsed = JSON.parse(value) as User;
    if (!parsed?.id || !parsed?.username || !parsed?.role) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const readSessionFromCookies = async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  const accessExpiresAt = cookieStore.get(ACCESS_EXPIRES_COOKIE)?.value;
  const refreshExpiresAt = cookieStore.get(REFRESH_EXPIRES_COOKIE)?.value;
  const csrfToken = cookieStore.get(CSRF_COOKIE)?.value ?? null;

  if (!accessToken || !refreshToken || !accessExpiresAt || !refreshExpiresAt) {
    return null;
  }

  return {
    user: parseJsonCookie(cookieStore.get(USER_COOKIE)?.value),
    accessToken,
    refreshToken,
    accessExpiresAt,
    refreshExpiresAt,
    csrfToken
  };
};

export const buildAuthedHeaders = (session: Session): HeadersInit => ({
  Authorization: `Bearer ${session.accessToken}`,
  "X-API-Version": API_VERSION
});

export const fetchMe = async (session: Session): Promise<User | null> => {
  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    method: "GET",
    headers: buildAuthedHeaders(session),
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as MeResponse;
  return payload.data;
};

export const fetchProfileList = async (session: Session, query: URLSearchParams): Promise<ListResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/api/profiles?${query.toString()}`, {
    headers: buildAuthedHeaders(session),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Failed to load profiles (${response.status})`);
  }

  return (await response.json()) as ListResponse;
};

export const fetchSearchResults = async (session: Session, query: URLSearchParams): Promise<ListResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/api/profiles/search?${query.toString()}`, {
    headers: buildAuthedHeaders(session),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Failed to search profiles (${response.status})`);
  }

  return (await response.json()) as ListResponse;
};

export const fetchProfileById = async (session: Session, id: string): Promise<Profile | null> => {
  const response = await fetch(`${getApiBaseUrl()}/api/profiles/${id}`, {
    headers: buildAuthedHeaders(session),
    cache: "no-store"
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load profile (${response.status})`);
  }

  const payload = (await response.json()) as SingleProfileResponse;
  return payload.data;
};

export const fetchDashboardMetrics = async (session: Session) => {
  const makeCountQuery = (overrides: Record<string, string>) => new URLSearchParams({ page: "1", limit: "1", ...overrides });

  try {
    const [allProfiles, maleProfiles, femaleProfiles, adults, seniors, recent] = await Promise.allSettled([
      fetchProfileList(session, makeCountQuery({ sort_by: "created_at", order: "desc" })),
      fetchProfileList(session, makeCountQuery({ gender: "male", sort_by: "created_at", order: "desc" })),
      fetchProfileList(session, makeCountQuery({ gender: "female", sort_by: "created_at", order: "desc" })),
      fetchProfileList(session, makeCountQuery({ age_group: "adult", sort_by: "created_at", order: "desc" })),
      fetchProfileList(session, makeCountQuery({ age_group: "senior", sort_by: "created_at", order: "desc" })),
      fetchProfileList(session, new URLSearchParams({ page: "1", limit: "6", sort_by: "created_at", order: "desc" }))
    ]);

    return {
      totalProfiles: allProfiles.status === "fulfilled" ? allProfiles.value.total : 0,
      maleProfiles: maleProfiles.status === "fulfilled" ? maleProfiles.value.total : 0,
      femaleProfiles: femaleProfiles.status === "fulfilled" ? femaleProfiles.value.total : 0,
      adultProfiles: adults.status === "fulfilled" ? adults.value.total : 0,
      seniorProfiles: seniors.status === "fulfilled" ? seniors.value.total : 0,
      recentProfiles: recent.status === "fulfilled" ? recent.value.data : []
    };
  } catch {
    return {
      totalProfiles: 0,
      maleProfiles: 0,
      femaleProfiles: 0,
      adultProfiles: 0,
      seniorProfiles: 0,
      recentProfiles: []
    };
  }
};

export const buildProfileQueryString = (query: PageQuery): URLSearchParams => {
  const params = new URLSearchParams();
  const entries = Object.entries(query) as Array<[keyof PageQuery, string | number | undefined]>;
  for (const [key, value] of entries) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    params.set(String(key), String(value));
  }
  if (!params.has("page")) {
    params.set("page", "1");
  }
  if (!params.has("limit")) {
    params.set("limit", "12");
  }
  if (!params.has("sort_by")) {
    params.set("sort_by", "created_at");
  }
  if (!params.has("order")) {
    params.set("order", "desc");
  }
  return params;
};

export const toSafePage = (value: string | string[] | undefined, fallback: number): number => {
  if (Array.isArray(value) || value === undefined) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const toOptionalValue = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value) || value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const safeUserFromSession = async (session: Session): Promise<User | null> => {
  if (session.user) {
    return session.user;
  }
  return fetchMe(session);
};