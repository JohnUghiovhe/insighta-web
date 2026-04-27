import Link from "next/link";
import { redirect } from "next/navigation";
import { readSessionFromCookies } from "@/lib/backend";

export default function LoginPage() {
  const session = readSessionFromCookies();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="hero">
      <section className="hero-card">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="pill">Secure browser OAuth</span>
            <h1>Insighta brings profile intelligence to a polished, non-technical workspace.</h1>
            <p>
              Sign in with GitHub to reach a realtime portal backed by the same APIs used by the CLI, while your session
              tokens stay in httpOnly cookies and CSRF checks protect every mutating request.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/api/auth/login">
                Continue with GitHub
              </Link>
              <Link className="button button-ghost" href="/dashboard">
                View sample layout
              </Link>
            </div>
          </div>

          <div className="hero-panel">
            <div className="metric-card accent-cyan">
              <p className="metric-label">Session handling</p>
              <strong className="metric-value">httpOnly</strong>
              <p className="metric-note">Access and refresh tokens never touch browser JavaScript.</p>
            </div>
            <div className="metric-card accent-lime">
              <p className="metric-label">Auth flow</p>
              <strong className="metric-value">GitHub</strong>
              <p className="metric-note">The backend completes the OAuth callback before the portal stores the session.</p>
            </div>
            <div className="security-note">
              <span className="pill">Realtime</span>
              <span className="pill">Role-aware</span>
              <span className="pill">CSRF protected</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}