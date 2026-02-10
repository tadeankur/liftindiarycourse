# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
