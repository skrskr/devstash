# Current Feature: Auth Setup - NextAuth + GitHub Provider

## Status

In Progress

## Goals

- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Set up split auth config pattern for edge compatibility
- Add GitHub OAuth provider
- Protect `/dashboard/*` routes using Next.js middleware proxy
- Redirect unauthenticated users to sign-in
- Create `src/auth.config.ts` — edge-compatible config (providers only, no adapter)
- Create `src/auth.ts` — full config with Prisma adapter and JWT strategy
- Create `src/app/api/auth/[...nextauth]/route.ts` — export handlers from auth.ts
- Create `proxy.ts` at project root — route protection with redirect logic
- Create `src/types/next-auth.d.ts` — extend Session type with user.id

## Notes

- Use `next-auth@beta` (not `@latest` which installs v4)
- Proxy file must be at project root (`proxy.ts`), NOT inside `src/` — Next.js only picks it up from root
- Use named export: `export const proxy = auth(...)` not default export
- Use `session: { strategy: 'jwt' }` with split config pattern
- Don't set custom `pages.signIn` — use NextAuth's default page
- Use Context7 to verify latest NextAuth v5 conventions before implementing
- Required env vars: `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`

## History

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1 - ShadCN init, dark mode, /dashboard route with top bar, sidebar and main placeholders
- Dashboard UI Phase 2 - Collapsible sidebar with type icons/colors, favorite & all collections, user avatar, mobile drawer
- Dashboard UI Phase 3 - Stats cards, recent collections grid, pinned items and recent items with colored left borders
- Database setup - Prisma 7 + Neon PostgreSQL, full schema with NextAuth models, migrations, Prisma singleton, db helper scripts
- Seed data - demo user, 7 system item types, 5 collections, 18 items with tags via prisma/seed.ts
- Dashboard collections real data - replaced mock collections with live Prisma queries, border color and type icons derived from actual item types
- Dashboard items real data - replaced mock pinned/recent items with live Prisma queries, stats cards use real counts, icon/border derived from item type
- Stats & sidebar real data - sidebar item types and collections from DB, colored dots for non-favorite collections, "View all collections" link, fixed connection pool limit for Neon
- Pro badge in sidebar - ShadCN outline Badge on File and Image type links, PRO_TYPES Set for easy extension
- Code quality quick wins - fixed circular CSS font variable, moved route segment config after imports, added aria-label to mobile nav button, added aria-hidden to decorative icon
