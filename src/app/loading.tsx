export default function Loading() {
  return (
    <main className="login-page" aria-busy="true" aria-live="polite">
      <section className="hero hero-left">
        <div className="hero-card hero-card-wide">
          <div className="hero-grid hero-grid-login">
            <div className="hero-copy">
              <span className="pill">Loading Insighta</span>
              <h1>Preparing your session and dashboard.</h1>
              <p>Fetching the backend session and hydrating the portal shell before the page finishes loading.</p>

              <div className="hero-actions">
                <div className="button" aria-hidden="true" style={{ pointerEvents: "none" }}>
                  Connecting
                </div>
                <div className="button button-ghost" aria-hidden="true" style={{ pointerEvents: "none" }}>
                  Syncing data
                </div>
              </div>
            </div>

            <div className="hero-panel" aria-hidden="true">
              <div className="metric-card accent-cyan">
                <p className="metric-label">Session</p>
                <strong className="metric-value">Checking</strong>
                <p className="metric-note">Verifying the backend-issued cookies and user identity.</p>
              </div>
              <div className="metric-card accent-lime">
                <p className="metric-label">Workspace</p>
                <strong className="metric-value">Loading</strong>
                <p className="metric-note">Preparing dashboard, profiles, search, and account routes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}