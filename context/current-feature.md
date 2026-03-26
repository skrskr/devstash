# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

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
