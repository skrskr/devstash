# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured.

## Stack

- **Next.js 16.2.1** with App Router — read `node_modules/next/dist/docs/` before writing any Next.js code; this version has breaking changes vs common training data
- **React 19.2.4**
- **TypeScript 5** — strict mode, path alias `@/*` maps to the project root
- **Tailwind CSS v4** — imported via `@import "tailwindcss"` in CSS (not the old `@tailwind` directives); configured via `@tailwindcss/postcss` PostCSS plugin
- **ESLint 9** — flat config format (`eslint.config.mjs`), not the legacy `.eslintrc` format

## Architecture

This is a fresh Next.js App Router scaffold. All application code lives under `app/`:

- `app/layout.tsx` — root layout; loads Geist/Geist_Mono fonts, sets global metadata
- `app/page.tsx` — home page
- `app/globals.css` — global styles with CSS custom properties for light/dark theming

No API routes, database, or business logic exists yet.