# kharchibook-web

The web surface of the **KharchiBook** platform — REPO 1 of three
(`kharchibook-web`, `auth-service`, `autopay-service`). See
[`../PRD/KHARCHIBOOK_PLATFORM_PRD.md`](../PRD/KHARCHIBOOK_PLATFORM_PRD.md) for the full architecture.

Holds no data. It logs the user in via **auth-service** (phone OTP → JWT), then
calls **autopay-service** for everything else (expenses, commitments, analytics),
attaching the JWT to each request.

## Stack
- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind v4** + shadcn-style primitives (`src/components/ui`)
- **motion** (animations), **recharts** (charts), **lucide-react** (icons)

## Layout
```
src/
  app/
    layout.tsx          root layout — wraps the app in <AuthProvider>
    page.tsx            entry — redirects to /dashboard or /login
    login/page.tsx      phone OTP login
    dashboard/page.tsx  the money picture (free money, commitments, spend, upcoming)
  components/
    ui/                 Button, Card, Badge, Skeleton (shadcn-style)
    auth-provider.tsx   JWT/session context (useAuth)
    nav-bar.tsx, stat-tile.tsx, free-money-card.tsx,
    commitment-list.tsx, spend-chart.tsx
  hooks/
    use-dashboard.ts    parallel fetch of the dashboard's data
  lib/
    config.ts           NEXT_PUBLIC_* service URLs + mock flag
    cn.ts, format.ts    class merge + INR / ordinal formatting
    auth/token.ts       JWT storage
    api/                typed clients: client.ts, auth.ts, autopay.ts, types.ts, mock.ts
```

## Run
```bash
cp .env.example .env.local   # mock mode is on by default
npm run dev                  # http://localhost:3000
```

`NEXT_PUBLIC_USE_MOCK=1` makes the API layer return sample data, so the dashboard
runs before the Go backends exist. Any phone/OTP logs you in. Set it to `0` and
point `NEXT_PUBLIC_AUTH_URL` / `NEXT_PUBLIC_AUTOPAY_URL` at the real services to go live.
