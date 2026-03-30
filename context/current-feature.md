# Current Feature

## Status

In Progress

## Goals

Fix low-risk code quality issues identified by code scanner:

1. Fix circular CSS variable — `--font-sans: var(--font-sans)` → `var(--font-geist-sans)` in `app/globals.css`
2. Move `export const dynamic` after imports in `app/dashboard/page.tsx`
3. Add `aria-label="Open navigation"` to mobile menu button in `components/dashboard/dashboard-shell.tsx`
4. Add `aria-hidden="true"` to decorative `MoreHorizontal` icon in `components/dashboard/recent-collections.tsx`

## Notes

These are all cosmetic/accessibility fixes with zero functional risk. No DB queries, no auth, no component logic changes.

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
