import Link from "next/link";
import { redirect } from "next/navigation";
import { readSessionFromCookies } from "@/lib/backend";

const CLI_REPO_URL = process.env.NEXT_PUBLIC_CLI_REPO_URL ?? "https://github.com/JohnUghiovhe/Insighta-CLI";

export default async function LoginPage() {
  const session = await readSessionFromCookies();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="login-page">
      <section className="hero hero-left">
        <div className="hero-card hero-card-wide">
          <div className="hero-grid hero-grid-login">
            <div className="hero-copy">
              <span className="pill">Insighta Labs+</span>
              <h1>Profile intelligence for teams that need answers fast.</h1>
              <p>
                Use the web portal for guided exploration, or jump into the CLI for direct workflows. Both experiences
                run on the same backend and security model.
              </p>

              <div className="hero-actions">
                <Link className="button" href="/api/auth/login">
                  <span aria-hidden="true" className="button-icon">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M12 2C6.5 2 2 6.6 2 12.2a10.2 10.2 0 0 0 6.9 9.7c.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .7 2.5.5 3.1.3.1-.8.4-1.3.7-1.6-2.3-.3-4.8-1.2-4.8-5.4 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 2.9 1.1.8-.2 1.7-.3 2.6-.3.9 0 1.8.1 2.6.3 2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.5.1 2.8.7.8 1.1 1.7 1.1 2.9 0 4.2-2.5 5.1-4.9 5.4.4.3.7 1 .7 2v3c0 .3.2.6.7.5A10.2 10.2 0 0 0 22 12.2C22 6.6 17.5 2 12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  Continue with GitHub
                </Link>
                <Link className="button button-ghost" href={CLI_REPO_URL} rel="noreferrer noopener" target="_blank">
                  <span aria-hidden="true" className="button-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 5.5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      <path d="m8 9 3 3-3 3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                      <path d="M13.5 15.2H17" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                    </svg>
                  </span>
                  Open CLI Repository
                </Link>
              </div>

              <a className="scroll-hint" href="#portal-footnote">
                Scroll for platform notes
              </a>
            </div>

            <div className="hero-panel">
              <div className="metric-card accent-cyan">
                <p className="metric-label">Session handling</p>
                <strong className="metric-value">httpOnly</strong>
                <p className="metric-note">Access and refresh tokens stay out of browser JavaScript.</p>
              </div>
              <div className="metric-card accent-lime">
                <p className="metric-label">Auth flow</p>
                <strong className="metric-value">GitHub OAuth</strong>
                <p className="metric-note">Backend completes callback and refresh before protected pages render.</p>
              </div>
              <div className="security-note">
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