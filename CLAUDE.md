# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Documentation-First Rule

**Before generating any code, ALWAYS read and follow the relevant docs file(s) in the `/docs` directory.** The docs define the coding standards, allowed libraries, and conventions for this project. All generated code MUST comply with these standards.

Current docs:
- `docs/ui.md` — UI component and date formatting standards
- `docs/data-fetching.md` — Data fetching, database queries, and user data isolation

## Build & Development Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm start        # Run production server
npm run lint     # Run ESLint (flat config format, no filename arg needed)
```

No testing framework is currently configured.

## Architecture

- **Next.js 16** with App Router (`src/app/` directory)
- **React 19** with server components by default
- **TypeScript** in strict mode
- **Tailwind CSS 4** via PostCSS plugin (`@tailwindcss/postcss`)
- **Path alias:** `@/*` maps to `./src/*`

### Project Structure

```
src/app/
  layout.tsx     - Root layout (Geist fonts, metadata)
  page.tsx       - Home page
  globals.css    - Tailwind imports + CSS variable theming
```

### Styling

Tailwind v4 with CSS variable-based theming defined in `globals.css` using `@theme` directive. Dark mode via `prefers-color-scheme` media query. Custom properties: `--background`, `--foreground`, `--font-sans`, `--font-mono`.

### ESLint

Uses ESLint 9 flat config (`eslint.config.mjs`) extending `next/core-web-vitals` and `next/typescript`.
