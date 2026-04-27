# Insighta Labs Web

Insighta Labs Web is the browser-based portal for Insighta Labs+, built with Next.js and TypeScript. It provides a polished interface for non-technical users while sharing the same backend, auth model, and profile intelligence APIs as the CLI.

## Project Links

Use these links to move across the full Insighta repository set.

| Project | Purpose | Docs |
| --- | --- | --- |
| Insighta Labs Web (this repo) | Browser portal for login, dashboard, profiles, search, and account management | This README |
| Insighta+ Labs Backend | Auth, profile APIs, rate limiting, logging, RBAC, and parser logic | [Backend README](https://github.com/JohnUghiovhe/insighta-backend#readme) |
| Insighta CLI | Terminal client for login, profile workflows, and exports | [CLI README](https://github.com/JohnUghiovhe/Insighta-CLI#readme) |

## Live URLs

| Surface | URL | Status |
| --- | --- | --- |
| Web Portal | Pending Vercel deployment URL | To be updated |
| Backend Base | https://intelligence-query-engine-production.up.railway.app/ | Live |
| Backend Health | https://intelligence-query-engine-production.up.railway.app/health | Live |

## Overview

The portal is a server-rendered Next.js app that acts as a secure browser client for the Insighta backend. It uses httpOnly cookies for sessions, server-side fetching for realtime data, and middleware to guard protected routes.

### Included Pages

- Login with GitHub OAuth
- Dashboard with realtime summary metrics
- Profiles list with filters and pagination
- Profile detail view
- Natural-language search
- Account/session page

## System Architecture

| Layer | Key Files | Responsibility |
| --- | --- | --- |
| App Shell | `src/app/layout.tsx`, `src/app/globals.css` | Global fonts, neon theme, backgrounds, and page scaffolding |
| Auth Entry | `src/app/login/page.tsx`, `src/app/api/auth/*` | Browser login entry, OAuth callback relay, logout |
| Server Data | `src/lib/backend.ts`, `src/lib/session.ts` | Session parsing, authenticated backend fetches, redirect guards |
| Protected UI | `src/app/dashboard/*`, `src/app/profiles/*`, `src/app/search/*`, `src/app/account/*` | Server-rendered views backed by live backend data |
| Middleware | `middleware.ts` | Route guard, CSRF cookie issuance, session refresh handling |

### Request Flow

1. User opens the portal and lands on the login page.
2. Clicking Continue with GitHub sends the browser to the backend OAuth start endpoint.
3. The backend completes the GitHub callback and issues tokens.
4. The portal stores the session in httpOnly cookies and redirects into the app.
5. Protected pages fetch data server-side from the backend on every request.
6. Middleware refreshes expired sessions and blocks unauthenticated access.

## Authentication Flow

The browser OAuth flow is designed so tokens never become accessible to JavaScript.

1. User clicks Continue with GitHub.
2. The browser is redirected to the backend GitHub auth start endpoint.
3. The backend handles the GitHub callback and exchanges the OAuth code.
4. The web app receives the session result and stores access and refresh tokens in httpOnly cookies.
5. Middleware issues and validates a separate CSRF token cookie for sensitive actions like logout.
6. Expired sessions are refreshed transparently when the backend refresh endpoint succeeds.

## Token Handling Approach

- Access and refresh tokens are kept in httpOnly cookies.
- Tokens are never stored in localStorage or exposed to browser JavaScript.
- A separate CSRF token cookie is used for state-changing requests.
- Cookies are configured with SameSite protections to reduce cross-site request risk.
- The app reads session state on the server and redirects back to login if the session is missing or invalid.

## Role Enforcement Logic

The backend remains the source of truth for permissions, and the web UI reflects those constraints.

- Protected pages require an authenticated session.
- The portal displays the user role in the account/sidebar surfaces.
- Admin-only actions remain hidden from non-admin users in the UI.
- Backend route handlers still enforce the final access decision for every request.

## CLI Usage

The CLI remains the fastest path for terminal workflows, bulk tasks, and automation.

```bash
insighta login
insighta whoami
insighta profiles list --limit 3
insighta profiles search "young males from nigeria"
insighta profiles export --format csv
```

For CLI-specific auth behavior, see the CLI repo documentation:

- [Insighta CLI README](https://github.com/JohnUghiovhe/Insighta-CLI#readme)

## Natural Language Parsing Approach

The portal search page uses the same deterministic backend parser as the CLI.

Supported query patterns include:

- gender terms such as male, man, women, female
- age groups such as child, teenager, adult, senior, elderly
- shortcuts like young for ages 16 to 24
- numeric bounds like above 30 or under 70
- country phrases like from nigeria or from kenya

Example queries:

| Query | Meaning |
| --- | --- |
| young males from nigeria | male, ages 16-24, country Nigeria |
| women above 30 | female, minimum age 30 |
| teenage men from kenya | male, age group teenager, country Kenya |
| seniors under 70 | age group senior, maximum age 70 |
| adults from canada | age group adult, country Canada |

If the parser cannot interpret the query, the backend returns `400 Unable to interpret query`.

## Vercel Deployment

The web app is configured for Vercel deployment using the Next.js framework preset.

### Required Environment Variables

Set these variables in Vercel project settings or in your local `.env` file:

```env
INSIGHTA_API_BASE_URL=https://intelligence-query-engine-production.up.railway.app
NEXT_PUBLIC_SITE_URL=https://your-web-app.vercel.app
NEXT_PUBLIC_CLI_REPO_URL=https://github.com/JohnUghiovhe/Insighta-CLI
```

The frontend does not need its own GitHub OAuth app. The backend owns the GitHub OAuth apps and exposes the browser callback flow that this web app consumes.

### Deployment Notes

- The app uses server-side fetches, so the backend base URL must be reachable from the deployed Vercel environment.
- The login flow sends users to the backend OAuth start endpoint, so the backend browser redirect URI must match the deployed web callback path.
- Production sessions depend on secure cookie behavior, so the app should be deployed over HTTPS.

## Development

```bash
npm install
npm run dev
```

### Build And Preview

```bash
npm run build
npm run start
```

## Repository Notes

- This repo is the browser sibling to the CLI and backend projects.
- The UI is intentionally left-aligned and multi-sectioned instead of a single centered hero.
- The theme uses a dark base with electric violet and orange accents.
- The portal is built to be readable for non-technical users while still exposing power-user paths through the CLI link.