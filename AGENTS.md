# AGENTS.md

## Project Overview

Monorepo for junkawasaki.com — a bilingual (ja/en) blog built with Astro, deployed to GitHub Pages.

- **Monorepo**: pnpm workspace (`apps/astro`)
- **Framework**: Astro 5 + MDX + React + Tailwind CSS
- **Site**: https://junkawasaki.com
- **Deploy**: GitHub Pages serves static output from the root of `gh-pages`.
  Publishing is manual via `scripts/publish-pages.cljk`; a push to `main` alone
  does not publish the site.

## Commands

```bash
pnpm install                    # Install dependencies
pnpm --filter astro dev         # Dev server at localhost:4321
pnpm --filter astro build       # Production build
```

## Publishing

From a clean checkout containing the latest `origin/main`, with `pnpm`, `kbb`,
Git and authenticated GitHub access available:

```bash
git fetch origin main
pnpm install --frozen-lockfile
pnpm build
pnpm run publish:pages -- --dry-run
pnpm run publish:pages
```

Review the dry-run source commit and parent. The script checks that `HEAD`
contains `origin/main` and pushes the built `apps/astro/dist` tree to
`gh-pages`; it does not build or verify that the output matches the checkout.
Build after updating the checkout, publish only a reviewed source revision, and
verify affected URLs on the live site. It adds `.nojekyll`; the build supplies
`CNAME`. The Actions workflow remains in the repository but is not the current
publishing path. See the README's Deploy section for details.

## Architecture

```
apps/astro/
├── src/
│   ├── content/
│   │   ├── config.ts           # Content collection schema
│   │   └── posts/              # Blog posts (MDX)
│   ├── components/             # Astro/React components
│   ├── layouts/                # Page layouts
│   ├── pages/
│   │   ├── index.astro         # Home (post listing)
│   │   └── posts/[...slug].astro  # Post detail
│   └── styles/
└── astro.config.mjs
```

## i18n Strategy (Plan 5: `<Ja>/<En>` Tags + Paraglide.js)

### Decision Record

All articles are written by LLMs. The i18n strategy is optimized for:
- **Output token efficiency**: Minimize redundant LLM output (code examples written once)
- **Structural determinism**: Clear schema for LLM to follow
- **Verifiability**: Programmatic detection of translation gaps
- **Single-prompt completeness**: One LLM call produces one complete bilingual article

### Content i18n: `<Ja>/<En>` MDX Components

Each post is a **single MDX file** containing both languages. Language-specific prose is wrapped in `<Ja>` / `<En>` components. Shared content (code blocks, images, diagrams) is unwrapped and appears in both language versions.

```mdx
---
title:
  ja: "悟りとはルート権限である"
  en: "Enlightenment is Root Access"
date: "2026-03-26"
---

<Ja>UNIXシステムにおいて、root権限とはすべてへの無制限のアクセスを意味する。</Ja>
<En>In a UNIX system, root access means unrestricted access to everything.</En>

```bash
$ whoami
ego
```

<Ja>これは禅の教えと一致する。</Ja>
<En>This corresponds to the Zen teaching.</En>
```

At build time, Astro generates two routes per post:
- `/ja/posts/{slug}` — renders only `<Ja>` blocks + shared content
- `/en/posts/{slug}` — renders only `<En>` blocks + shared content

### UI String i18n: Type-safe Dictionary

Navigation, footer, buttons, and other UI strings are managed by a type-safe TypeScript dictionary (`src/i18n/ui.ts`) with helper functions (`src/i18n/utils.ts`). This follows the Astro official i18n recipe and is structured to allow migration to Paraglide.js when UI complexity grows.

```
src/i18n/
├── ui.ts      # { en: { 'posts.latest': 'Latest', ... }, ja: { 'posts.latest': '最新', ... } }
└── utils.ts   # getLocaleFromUrl(), useTranslations(), getPostTitle(), etc.
```

### Routing

Uses Astro's built-in i18n routing:
- Default locale: `en`
- Locales: `[en, ja]`
- Pattern: `/en/posts/...`, `/ja/posts/...`
- Home: `/en/`, `/ja/` (root `/` redirects to `/en/`)
- `prefixDefaultLocale: true` (both locales are explicit in URL)

### Verification

LLM-generated articles must pass these checks:
- Every `<Ja>` block has a corresponding `<En>` block (and vice versa)
- Frontmatter `title` has both `ja` and `en` keys
- Code blocks are outside language tags (shared)

## Content Guidelines (for LLM authors)

- Posts are bilingual MDX files in `apps/astro/src/content/posts/`
- Wrap language-specific prose in `<Ja>...</Ja>` or `<En>...</En>`
- Keep code examples, images, and structural elements **outside** language tags
- Frontmatter fields `title`, `excerpt` use `{ ja: "...", en: "..." }` format
- Slug is language-neutral (e.g., `satori-is-root.mdx`)
- Date format: `"YYYY-MM-DD"`
