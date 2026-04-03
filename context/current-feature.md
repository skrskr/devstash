# Current Feature

## Status

Not Started

## Goals

<!-- Add goals here -->

## Notes

<!-- Add notes here -->

## History

<!-- Keep this updated. Earliest to latest -->

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
- Auth Phase 1 - NextAuth v5 + GitHub OAuth, split config pattern (auth.config.ts + auth.ts), Prisma adapter with JWT strategy, proxy.ts at project root protects /dashboard/*, session type extended with user.id
- Auth Phase 2 - Email/password Credentials provider, bcrypt validation in auth.ts, POST /api/auth/register route, custom /sign-in page with GitHub OAuth + credentials form
