import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchMe, readSessionFromCookies } from "@/lib/backend";

const CLI_REPO_URL = process.env.NEXT_PUBLIC_CLI_REPO_URL ?? "https://github.com/JohnUghiovhe/Insighta-CLI";
const githubLoginUrl = "/api/auth/login";

export default async function LoginPage() {
  const session = await readSessionFromCookies();
  if (session && (await fetchMe(session))) {
    redirect("/dashboard");
  }

  return (
    <main className="login-page">
      <section className="hero hero-left">
        <div className="hero-card hero-card-wide">
          <div className="hero-grid hero-grid-login">
            <div className="hero-copy">
              <span className="pill">Insighta Labs+</span>
              <h1>Authenticate with GitHub, then open your Insighta workspace.</h1>
              <p>
                This portal sends you straight to GitHub for consent, then returns you here with secure httpOnly
                cookies. The dashboard, profiles, search, and account pages all use the same backend as the CLI.
              </p>

              <div className="hero-actions">
                <a className="button" href={githubLoginUrl}>
                  <span aria-hidden="true" className="button-icon">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M12 2C6.5 2 2 6.6 2 12.2a10.2 10.2 0 0 0 6.9 9.7c.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .7 2.5.5 3.1.3.1-.8.4-1.3.7-1.6-2.3-.3-4.8-1.2-4.8-5.4 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 2.9 1.1.8-.2 1.7-.3 2.6-.3.9 0 1.8.1 2.6.3 2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.5.1 2.8.7.8 1.1 1.7 1.1 2.9 0 4.2-2.5 5.1-4.9 5.4.4.3.7 1 .7 2v3c0 .3.2.6.7.5A10.2 10.2 0 0 0 22 12.2C22 6.6 17.5 2 12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  Continue with GitHub
                </a>
                <Link className="button button-ghost" href={CLI_REPO_URL} rel="noreferrer noopener" target="_blank">
                  <span aria-hidden="true" className="button-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 5.5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      <path d="m8 9 3 3-3 3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                      <path d="M13.5 15.2H17" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                    </svg>
                  </span>
                  Use CLI
                </Link>
              </div>
            </div>

            <div className="hero-panel">
              <div className="metric-card accent-cyan">
                <p className="metric-label">OAuth handoff</p>
                <strong className="metric-value">GitHub</strong>
                <p className="metric-note">The browser goes to GitHub first, then returns with a backend-issued session.</p>
              </div>
              <div className="metric-card accent-lime">
                <p className="metric-label">Session storage</p>
                <strong className="metric-value">httpOnly</strong>
                <p className="metric-note">Tokens stay out of JavaScript and are refreshed by the backend when needed.</p>
              </div>
              <div className="security-note">
                <span className="pill">Direct OAuth</span>
                <span className="pill">Realtime</span>
                <span className="pill">Role-aware</span>
                <span className="pill">CSRF protected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="login-rail" id="portal-footnote">
        <div className="login-rail-grid">
          <article className="panel-section">
            <div className="section-head">
              <div>
                <h2>Same backend, two interfaces</h2>
                <p>Switch between visual exploration in the portal and scriptable workflows in the CLI.</p>
              </div>
            </div>
          </article>

          <article className="panel-section">
            <div className="section-head">
              <div>
                <h2>Security by default</h2>
                <p>Token storage uses secure cookies and state-changing operations are protected with CSRF checks.</p>
              </div>
            </div>
          </article>
        </div>

        <footer className="login-footnote">
          Footnote: This portal is optimized for non-technical users, while the CLI remains ideal for power users and
          automation scripts.
        </footer>
      </section>
    </main>
  );
}