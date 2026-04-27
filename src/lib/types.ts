export type Role = "admin" | "analyst";

export interface User {
  id: string;
  github_id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  role: Role;
  is_active: boolean;
  last_login_at: string;
  created_at: string;
}

export interface AuthCallbackResponse {
  status: "success";
  access_token: string;
  refresh_token: string;
  access_token_expires_in_seconds: number;
  refresh_token_expires_in_seconds: number;
  data: User;
}

export interface RefreshResponse {
  status: "success";
  access_token: string;
  refresh_token: string;
  access_token_expires_in_seconds: number;
  refresh_token_expires_in_seconds: number;
}

export interface MeResponse {
  status: "success";
  data: User;
}

export interface Profile {
  id: string;
  name: string;
  gender: "male" | "female";
  gender_probability: number;
  age: number;
  age_group: "child" | "teenager" | "adult" | "senior";
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: string;
}

export interface ListResponse {
  status: "success";
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  next_cursor?: string | null;
  data: Profile[];
}

export interface SingleProfileResponse {
  status: "success";
  data: Profile;
}

export type ProfileFilters = {
  gender?: "male" | "female";
  age_group?: "child" | "teenager" | "adult" | "senior";
  country_id?: string;
  min_age?: number;
  max_age?: number;
  min_gender_probability?: number;
  min_country_probability?: number;
};

export type SortBy = "age" | "created_at" | "gender_probability";
export type Order = "asc" | "desc";

export type PageQuery = ProfileFilters & {
  page?: number;
  limit?: number;
  sort_by?: SortBy;
  order?: Order;
};

export interface Session {
  user: User | null;
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
  csrfToken: string | null;
}