import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { formatAge, formatDateTime, formatPercent } from "@/lib/format";
import { fetchProfileById, safeUserFromSession } from "@/lib/backend";
import { getSessionOrRedirect } from "@/lib/session";
import { readCsrfToken } from "@/lib/csrf";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProfileDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const session = await getSessionOrRedirect();
  const user = await safeUserFromSession(session);
  if (!user) {
    return null;
  }

  const profile = await fetchProfileById(session, resolvedParams.id);
  if (!profile) {
    notFound();
  }

  const csrfToken = (await readCsrfToken()) ?? "";

  return (
    <AppShell
      activeHref="/profiles"
      csrfToken={csrfToken}
      description="A focused profile intelligence record with the exact values returned by the backend API."
      title={profile.name}
      user={user}
    >
      <section className="detail-card">
        <div className="detail-heading">
          <span className="pill">{profile.country_name}</span>
          <h2>{profile.name}</h2>
          <p>
            Created {formatDateTime(profile.created_at)} · {profile.gender} · {profile.age_group}
          </p>
        </div>

        <div className="detail-grid">
          <MetricCard accent="cyan" label="Age" note="Backend derived age value." value={formatAge(profile.age)} />
          <MetricCard accent="lime" label="Gender confidence" note="Probability returned from the backend." value={formatPercent(profile.gender_probability)} />
          <MetricCard accent="pink" label="Country confidence" note="Nationalize score used by the dataset." value={formatPercent(profile.country_probability)} />
          <MetricCard accent="amber" label="Country code" note="Backend country identifier." value={profile.country_id} />
        </div>

        <div className="account-grid">
          <div className="panel-section">
            <div className="section-head">
              <div>
                <h3>Profile summary</h3>
                <p>The same record can be used in the search and list views without loss of fidelity.</p>
              </div>
            </div>
            <div className="account-summary">
              <div className="account-field">
                <span className="detail-key">Name</span>
                <strong>{profile.name}</strong>
              </div>
              <div className="account-field">
                <span className="detail-key">Created at</span>
                <strong>{formatDateTime(profile.created_at)}</strong>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <div className="section-head">
              <div>
                <h3>Identity signals</h3>
                <p>Values exposed to the UI for quick interpretation.</p>
              </div>
            </div>
            <div className="stack">
              <div className="account-field">
                <span className="detail-key">Gender</span>
                <strong>{profile.gender}</strong>
              </div>
              <div className="account-field">
                <span className="detail-key">Age group</span>
                <strong>{profile.age_group}</strong>
              </div>
              <div className="account-field">
                <span className="detail-key">Country</span>
                <strong>{profile.country_name}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}