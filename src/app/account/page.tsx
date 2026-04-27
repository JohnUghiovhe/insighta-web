import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { formatDateTime } from "@/lib/format";
import { getSessionOrRedirect, parseStoredUser } from "@/lib/session";
import { readCsrfToken } from "@/lib/csrf";
import { safeUserFromSession } from "@/lib/backend";

export default async function AccountPage() {
  const session = await getSessionOrRedirect();
  const user = (await safeUserFromSession(session)) ?? (await parseStoredUser());

  if (!user) {
    redirect("/login");
  }

  const csrfToken = (await readCsrfToken()) ?? "";

  return (
    <AppShell
      activeHref="/account"
      csrfToken={csrfToken}
      description="Review your authenticated session, security posture, and role permissions."
      title="Account"
      user={user}
    >
      <section className="account-grid">
        <div className="panel-section">
          <div className="section-head">
            <div>
              <h2>Identity</h2>
              <p>Account data is fetched from the backend’s authenticated user endpoint.</p>
            </div>
          </div>

          <div className="account-summary">
            <div className="account-field">
              <span className="detail-key">Username</span>
              <strong>{user.username}</strong>
            </div>
            <div className="account-field">
              <span className="detail-key">Email</span>
              <strong>{user.email ?? "No public email"}</strong>
            </div>
            <div className="account-field">
              <span className="detail-key">Role</span>
              <strong>{user.role}</strong>
            </div>
            <div className="account-field">
              <span className="detail-key">GitHub ID</span>
              <strong>{user.github_id}</strong>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <div className="section-head">
            <div>
              <h2>Session security</h2>
              <p>Tokens are stored server-side in httpOnly cookies and can only be rotated by the backend.</p>
            </div>
          </div>

          <div className="stack">
            <div className="notice">
              CSRF protection is enforced on mutating requests through a cookie plus form token check.
            </div>
            <div className="account-field">
              <span className="detail-key">Last login</span>
              <strong>{formatDateTime(user.last_login_at)}</strong>
            </div>
            <div className="account-field">
              <span className="detail-key">Created at</span>
              <strong>{formatDateTime(user.created_at)}</strong>
            </div>
            {user.role === "admin" ? (
              <div className="notice">
                Admin accounts can create and delete profiles through the backend API. Those controls are intentionally
                hidden from the current UI surface.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}