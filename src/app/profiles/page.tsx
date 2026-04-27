import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Pagination } from "@/components/pagination";
import { ProfileCard } from "@/components/profile-card";
import { buildProfileQueryString, fetchProfileList, safeUserFromSession, toOptionalValue, toSafePage } from "@/lib/backend";
import { formatNumber } from "@/lib/format";
import { getSessionOrRedirect } from "@/lib/session";
import { readCsrfToken } from "@/lib/csrf";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProfilesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const session = await getSessionOrRedirect();
  const user = await safeUserFromSession(session);
  if (!user) {
    redirect("/login");
  }

  const page = toSafePage(resolvedSearchParams.page, 1);
  const limit = toSafePage(resolvedSearchParams.limit, 12);
  const query = buildProfileQueryString({
    page,
    limit,
    gender: toOptionalValue(resolvedSearchParams.gender) as "male" | "female" | undefined,
    age_group: toOptionalValue(resolvedSearchParams.age_group) as "child" | "teenager" | "adult" | "senior" | undefined,
    country_id: toOptionalValue(resolvedSearchParams.country_id)?.toUpperCase(),
    min_age: toOptionalValue(resolvedSearchParams.min_age) ? Number(toOptionalValue(resolvedSearchParams.min_age)) : undefined,
    max_age: toOptionalValue(resolvedSearchParams.max_age) ? Number(toOptionalValue(resolvedSearchParams.max_age)) : undefined,
    min_gender_probability: toOptionalValue(resolvedSearchParams.min_gender_probability) ? Number(toOptionalValue(resolvedSearchParams.min_gender_probability)) : undefined,
    min_country_probability: toOptionalValue(resolvedSearchParams.min_country_probability) ? Number(toOptionalValue(resolvedSearchParams.min_country_probability)) : undefined,
    sort_by: (toOptionalValue(resolvedSearchParams.sort_by) as "age" | "created_at" | "gender_probability" | undefined) ?? "created_at",
    order: (toOptionalValue(resolvedSearchParams.order) as "asc" | "desc" | undefined) ?? "desc"
  });

  const profiles = await fetchProfileList(session, query);
  const csrfToken = (await readCsrfToken()) ?? "";

  const currentFilters = {
    gender: toOptionalValue(resolvedSearchParams.gender),
    age_group: toOptionalValue(resolvedSearchParams.age_group),
    country_id: toOptionalValue(resolvedSearchParams.country_id),
    min_age: toOptionalValue(resolvedSearchParams.min_age),
    max_age: toOptionalValue(resolvedSearchParams.max_age),
    min_gender_probability: toOptionalValue(resolvedSearchParams.min_gender_probability),
    min_country_probability: toOptionalValue(resolvedSearchParams.min_country_probability),
    sort_by: toOptionalValue(resolvedSearchParams.sort_by),
    order: toOptionalValue(resolvedSearchParams.order),
    limit: String(limit)
  };

  return (
    <AppShell
      activeHref="/profiles"
      csrfToken={csrfToken}
      description="Filter, page, and inspect profile intelligence records with the same backend queries that power the CLI."
      title="Profiles"
      user={user}
    >
      <section className="panel-section">
        <div className="section-head">
          <div>
            <h2>Filters</h2>
            <p>All filters map directly to the backend profile API.</p>
          </div>
          <span className="pill">{formatNumber(profiles.total)} total</span>
        </div>

        <form className="form-grid" method="get">
          <div className="field">
            <label htmlFor="gender">Gender</label>
            <select className="select" defaultValue={currentFilters.gender ?? ""} id="gender" name="gender">
              <option value="">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="age_group">Age group</label>
            <select className="select" defaultValue={currentFilters.age_group ?? ""} id="age_group" name="age_group">
              <option value="">Any</option>
              <option value="child">Child</option>
              <option value="teenager">Teenager</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="country_id">Country code</label>
            <input className="input" defaultValue={currentFilters.country_id ?? ""} id="country_id" maxLength={2} name="country_id" placeholder="NG" />
          </div>
          <div className="field">
            <label htmlFor="min_age">Min age</label>
            <input className="input" defaultValue={currentFilters.min_age ?? ""} id="min_age" name="min_age" placeholder="18" type="number" />
          </div>
          <div className="field">
            <label htmlFor="max_age">Max age</label>
            <input className="input" defaultValue={currentFilters.max_age ?? ""} id="max_age" name="max_age" placeholder="60" type="number" />
          </div>
          <div className="field">
            <label htmlFor="limit">Per page</label>
            <select className="select" defaultValue={String(limit)} id="limit" name="limit">
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="sort_by">Sort by</label>
            <select className="select" defaultValue={currentFilters.sort_by ?? "created_at"} id="sort_by" name="sort_by">
              <option value="created_at">Created</option>
              <option value="age">Age</option>
              <option value="gender_probability">Gender confidence</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="order">Order</label>
            <select className="select" defaultValue={currentFilters.order ?? "desc"} id="order" name="order">
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
          <div className="field" style={{ alignSelf: "end" }}>
            <label aria-hidden="true">Apply</label>
            <button className="button" type="submit">
              Apply filters
            </button>
          </div>
        </form>
      </section>

      <section className="panel-section">
        <div className="section-head">
          <div>
            <h2>Profile list</h2>
            <p>{profiles.data.length} of {formatNumber(profiles.total)} profiles shown.</p>
          </div>
        </div>

        <div className="list-grid">
          {profiles.data.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        <Pagination currentPage={profiles.page} pathname="/profiles" searchParams={currentFilters} totalPages={profiles.total_pages} />
      </section>
    </AppShell>
  );
}