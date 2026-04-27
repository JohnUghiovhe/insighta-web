import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Pagination } from "@/components/pagination";
import { ProfileCard } from "@/components/profile-card";
import { fetchSearchResults, safeUserFromSession, toOptionalValue, toSafePage } from "@/lib/backend";
import { formatNumber } from "@/lib/format";
import { getSessionOrRedirect } from "@/lib/session";
import { readCsrfToken } from "@/lib/csrf";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const examples = ["young males from nigeria", "women above 30", "seniors under 70"];

export default async function SearchPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const session = await getSessionOrRedirect();
  const [user, csrfToken] = await Promise.all([safeUserFromSession(session), readCsrfToken()]);
  if (!user) {
    redirect("/login");
  }

  const queryText = toOptionalValue(resolvedSearchParams.q);
  const page = toSafePage(resolvedSearchParams.page, 1);
  const limit = toSafePage(resolvedSearchParams.limit, 10);

  const searchResults = queryText
    ? await fetchSearchResults(session, new URLSearchParams({ q: queryText, page: String(page), limit: String(limit) }))
    : null;

  return (
    <AppShell
      activeHref="/search"
      csrfToken={csrfToken ?? ""}
      description="Use natural language to interpret profile filters the same way the CLI does."
      title="Search"
      user={user}
    >
      <section className="panel-section">
        <div className="section-head">
          <div>
            <h2>Natural-language search</h2>
            <p>Type the request the way a non-technical user would describe it.</p>
          </div>
        </div>

        <form className="stack" method="get">
          <input className="input" defaultValue={queryText ?? ""} name="q" placeholder="e.g. young males from nigeria" />
          <input name="page" type="hidden" value="1" />
          <div className="hero-actions">
            <button className="button" type="submit">
              Search profiles
            </button>
            <span className="pill">{formatNumber(searchResults?.total ?? 0)} results</span>
          </div>
        </form>

        <div className="search-suggestions">
          {examples.map((example) => (
            <span className="pill" key={example}>
              {example}
            </span>
          ))}
        </div>
      </section>

      {queryText && searchResults ? (
        <section className="panel-section">
          <div className="section-head">
            <div>
              <h2>Search results</h2>
              <p>{searchResults.data.length} of {formatNumber(searchResults.total)} profiles matched the interpreted query.</p>
            </div>
          </div>

          {searchResults.data.length > 0 ? (
            <div className="list-grid">
              {searchResults.data.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="search-empty">
              <strong>No profiles found</strong>
              <p>Try a different phrase or loosen the filter conditions.</p>
            </div>
          )}

          <Pagination currentPage={searchResults.page} pathname="/search" searchParams={{ q: queryText, limit: String(limit) }} totalPages={searchResults.total_pages} />
        </section>
      ) : (
        <section className="panel-section empty-state">
          <strong>Search by intent</strong>
          <p>The backend understands age, gender, and country language like “women above 30” or “adults from canada”.</p>
        </section>
      )}
    </AppShell>
  );
}