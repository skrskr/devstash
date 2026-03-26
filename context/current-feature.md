# Current Feature

Prisma + Neon PostgreSQL Setup

## Status

In Progress

## Goals

- Install and configure Prisma 7 (note: breaking changes from previous versions)
- Set up Neon PostgreSQL (serverless) as the database provider
- Create initial schema based on data models in project-overview.md (User, Item, ItemType, Collection, Tag, ItemTag)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Always use migrations (`prisma migrate dev`) — never `db push`
- DATABASE_URL points to the development branch on Neon

## Notes

- Use Prisma 7 — read the upgrade guide before implementing (breaking changes)
- Two Neon branches: development (DATABASE_URL) and production (for deployments)
- Production deployments must run `prisma migrate deploy` before app starts
- Reference: @context/features/database-spec.md

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1 - ShadCN init, dark mode, /dashboard route with top bar, sidebar and main placeholders
- Dashboard UI Phase 2 - Collapsible sidebar with type icons/colors, favorite & all collections, user avatar, mobile drawer
- Dashboard UI Phase 3 - Stats cards, recent collections grid, pinned items and recent items with colored left borders
