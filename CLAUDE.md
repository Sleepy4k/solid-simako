# SimaKos — Claude Code Reference

## Project Overview
SimaKos (Sistem Manajemen Kos) is a fullstack boarding-house management and search platform for Purwokerto, Indonesia. Built with SolidJS + SolidStart (SSR), Tailwind CSS v4, Drizzle ORM, and MariaDB. Runtime: **Bun**.

## Tech Stack
| Layer       | Technology                            |
|-------------|---------------------------------------|
| Framework   | SolidJS 1.9 + SolidStart 2.0-alpha   |
| Styling     | Tailwind CSS v4 (no config file)      |
| Database    | MariaDB/MySQL via Drizzle ORM         |
| Auth        | JWT in HttpOnly cookie (jose + h3)    |
| Password    | argon2 (argon2id)                     |
| Validation  | Zod                                   |
| Runtime     | Bun ≥ 1.1                            |
| IDs         | UUIDv7 (uuid package, varchar 36)     |

## Key Commands
```bash
bun dev          # Start dev server (port 3000)
bun run build    # Production build
bun run db:push  # Push schema changes to DB
bun run db:studio# Open Drizzle Studio
bun run db:generate # Generate migration files
pm2 start ecosystem.config.cjs --env production  # Production start
```

## Project Structure
```
src/
├── app.tsx                 # Root router — MetaProvider + NProgress, no global Nav
├── app.css                 # Tailwind v4 + NProgress + animations
├── entry-server.tsx        # SSR entry — injects security headers
├── types/index.ts          # Shared TypeScript types
├── config/site.ts          # Site metadata, district list, label maps
├── constants/
│   ├── roles.ts            # Role → sidebar items, dashboard paths
│   └── facilities.ts       # Facility definitions with SVG icon paths
├── lib/
│   ├── client/nprogress.ts # NProgress SolidJS integration
│   ├── server/auth.ts      # JWT sign/verify, Bun.password, cookie helpers
│   └── server/security.ts  # CSP headers, HTML sanitization, slugify
├── lib/shared/
│   ├── validation.ts       # All Zod schemas (login, register, search, booking)
│   └── recommendation.ts   # Weighted-sum algorithm for room recommendations
├── server/
│   ├── db/index.ts         # mysql2 pool → Drizzle instance
│   ├── db/schema.ts        # Full Drizzle schema (3NF)
│   └── actions/            # Server actions ("use server")
│       ├── auth.ts         # login, register, logout, getCurrentUser
│       ├── rooms.ts        # getRecommendedRooms, searchRooms, searchPreview
│       ├── search.ts       # Thin wrappers for search actions
│       └── user.ts         # favorites, notifications, profile, rental history
├── components/             # GLOBAL reusable components
│   ├── ui/                 # Button, Modal, Badge, Spinner, Pagination
│   ├── LandingNav.tsx      # Public nav: logo, scroll-triggered search, hamburger
│   ├── Footer.tsx          # Footer with fast links
│   ├── ScrollToTop.tsx     # Floating scroll-to-top button
│   └── ConfirmModal.tsx    # Reusable confirm dialog
├── features/               # PAGE-SPECIFIC feature components
│   ├── landing/            # HeroSection, RoomCard, RecommendedRooms, FAQ, Tips, etc.
│   ├── search/             # SearchFilters, SearchResults
│   ├── auth/               # LoginForm, RegisterForm, RegisterTenantForm
│   └── dashboard/          # DashboardLayout, DashboardSidebar, DashboardTopBar
└── routes/                 # File-based routes
    ├── index.tsx            # Landing page (LandingNav + Footer + sections)
    ├── search.tsx           # Search results page
    ├── dashboard.tsx        # Role-based redirect hub
    ├── auth/login.tsx
    ├── auth/register.tsx
    ├── auth/register-tenant.tsx
    ├── dashboard/user.tsx
    ├── dashboard/tenant.tsx
    └── dashboard/admin.tsx
```

## Design System (Tailwind v4 @theme tokens)
| Token         | Hex       | Usage                                  |
|---------------|-----------|----------------------------------------|
| `navy`        | #0A2540   | Headers, sidebar, primary text         |
| `navy-dark`   | #061829   | Hover states on navy elements          |
| `accent`      | #0073E6   | Buttons, links, active states, badges  |
| `accent-dark` | #005bb5   | Hover states on accent elements        |
| `ice`         | #E6F0FA   | Card borders, subtle backgrounds       |
| `ice-gray`    | #F4F7FA   | Page backgrounds, alternating rows     |

## Auth Flow
1. Login/Register → `server/actions/auth.ts` → validates with Zod → `Bun.password.verify()` → `jose` JWT → `setCookie` via `vinxi/http` → redirect to role dashboard
2. Protected routes → `createAsync(() => getCurrentUser())` → throws `redirect("/auth/login")` if null
3. Logout → `deleteCookie` via `vinxi/http` → redirect to `/`
4. Cookie: `simakos_token`, HttpOnly, SameSite=Lax, Secure in production

## Recommendation Algorithm (Weighted Sum)
```
score = viewCount × 0.35 + avgRating × 0.30 + availability × 0.20 + recency × 0.15
```
- All dimensions normalized to [0,1] via min-max before weighting
- Recency uses exponential decay: `e^(-ageWeeks/4)`
- Implementation: `src/lib/shared/recommendation.ts`

## Database Schema (3NF)
Key tables: `users`, `tenants`, `kost_properties`, `rooms`, `facilities`, `property_facilities` (junction), `property_images`, `user_favorites`, `bookings`, `payment_proofs`, `reviews`, `notifications`
Schema file: `src/server/db/schema.ts`
Migration output: `drizzle/migrations/`

## Security
- CSP + security headers injected in `entry-server.tsx` via `SECURITY_HEADERS`
- Input sanitization: HTML escaping + Zod `.trim().max()` on all string inputs
- No client-side trust for role — always re-verify from JWT on server
- HttpOnly cookie prevents XSS token theft

## Important Patterns
- `createAsync()` for all server data fetching (SSR-compatible)
- `action()` not used — raw async functions with `"use server"` + form submit handlers
- Each route page imports and wraps its own layout (no global Nav in app.tsx)
- Dashboard routes guard via `createAsync` + `throw redirect()`
- `ConfirmModal` for all destructive actions (delete, logout, reject)
- Mock data in `server/actions/rooms.ts` for development (replace with real DB queries)

## Environment Variables
See `.env.example`. Required: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`.

## Adding a New Dashboard Route
1. Create `src/routes/dashboard/<role>/<page>.tsx`
2. Add auth guard: `const user = createAsync(() => requireAuth(["<role>"]))`
3. Add sidebar item in `src/constants/roles.ts` → `ROLE_SIDEBAR_ITEMS`
4. Add server action in `src/server/actions/<domain>.ts`
