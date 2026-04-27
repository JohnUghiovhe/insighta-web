import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { ProfileCard } from "@/components/profile-card";
import { formatNumber } from "@/lib/format";
import { fetchDashboardMetrics, safeUserFromSession } from "@/lib/backend";
import { getSessionOrRedirect } from "@/lib/session";
import { readCsrfToken } from "@/lib/csrf";

export default async function DashboardPage() {
  const session = await getSessionOrRedirect();
  const userPromise = safeUserFromSession(session);
  const csrfTokenPromise = readCsrfToken();
  const user = await userPromise;

  if (!user) {
    redirect("/login");
  }

  const [metrics, csrfToken] = await Promise.all([fetchDashboardMetrics(session), csrfTokenPromise]);

  return (
    <AppShell
      activeHref="/dashboard"
      csrfToken={csrfToken ?? ""}
      description="A realtime snapshot of the profiles dataset, updated from the same backend APIs used by the CLI."
      title="Dashboard"
      user={user}
    >
      <section className="metric-grid">
        <MetricCard accent="cyan" label="Total profiles" note="All stored profiles currently available to your account." value={formatNumber(metrics.totalProfiles)} />
        <MetricCard accent="lime" label="Male profiles" note="Gender distribution currently visible in the database." value={formatNumber(metrics.maleProfiles)} />
        <MetricCard accent="pink" label="Female profiles" note="Live count of female-labelled profiles." value={formatNumber(metrics.femaleProfiles)} />
        <MetricCard accent="amber" label="Adults" note="Profiles categorized as adults by the backend." value={formatNumber(metrics.adultProfiles)} />
      </section>

      <section className="panel-section">
        <div className="section-head">
          <div>
            <h2>Recent profiles</h2>
            <p>The newest records pulled directly from the backend in realtime.</p>
          </div>
          <span className="pill">{formatNumber(metrics.seniorProfiles)} seniors</span>
        </div>

        <div className="list-grid">
          {metrics.recentProfiles.map((profile) => (
            <ProfileCard compact key={profile.id} profile={profile} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}