import Link from "next/link";
import { ReactNode } from "react";
import { User } from "@/lib/types";

type AppShellProps = {
  user: User;
  csrfToken: string;
  activeHref: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profiles", label: "Profiles" },
  { href: "/search", label: "Search" },
  { href: "/account", label: "Account" }
];

export function AppShell({ user, csrfToken, activeHref, title, description, actions, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar panel">
        <Link className="brand" href="/dashboard">
          <span className="brand-mark">I</span>
          <span>
            <strong>Insighta</strong>
            <small>intelligence portal</small>
          </span>
        </Link>

        <nav className="nav">
          {navigation.map((item) => {
            const active = activeHref === item.href || activeHref.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} className={`nav-link${active ? " is-active" : ""}`} href={item.href}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="user-panel">
          {user.avatar_url ? (
            <img alt={user.username} className="avatar" src={user.avatar_url} referrerPolicy="no-referrer" />
          ) : (
            <div className="avatar avatar-fallback">{user.username.slice(0, 2).toUpperCase()}</div>
          )}
          <div>
            <p className="user-name">{user.username}</p>
            <p className="user-meta">
              {user.role} · {user.email ?? "No public email"}
            </p>
          </div>
        </div>

        <form action="/api/auth/logout" className="logout-form" method="post">
          <input name="csrf_token" type="hidden" value={csrfToken} />
          <button className="button button-ghost" type="submit">
            Sign out
          </button>
        </form>
      </aside>

      <main className="app-main">
        <section className="surface surface-hero">
          <div className="page-intro">
            <p className="eyebrow">Realtime backend connected</p>
            <h1>{title}</h1>
            <p className="page-description">{description}</p>
          </div>
          {actions ? <div className="page-actions">{actions}</div> : null}
        </section>

        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}