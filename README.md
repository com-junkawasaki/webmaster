# webmaster

Monorepo for **[junkawasaki.com](https://junkawasaki.com)** — a bilingual (ja/en)
blog built with Astro and deployed to GitHub Pages.

- **Monorepo**: pnpm workspace (`apps/astro`)
- **Framework**: Astro 5 + MDX + React + Tailwind CSS
- **i18n**: bilingual single-source MDX via `<Ja>` / `<En>` tags
- **Deploy**: GitHub Pages (static output) → https://junkawasaki.com

## Quick start

```bash
pnpm install        # install dependencies
pnpm dev            # dev server at localhost:4321  (alias for: pnpm --filter astro dev)
pnpm build          # production build               (alias for: pnpm --filter astro build)
```

## Structure

```
apps/astro/
├── src/
│   ├── content/
│   │   ├── config.ts        # content collection schema
│   │   └── posts/           # blog posts (bilingual MDX)
│   ├── components/
│   │   └── i18n/            # <Ja> / <En> language tags
│   ├── i18n/                # UI string dictionary (ui.ts, utils.ts)
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro      # root redirect → /en/
│   │   └── [locale]/        # /en/ and /ja/ routes
│   └── styles/
└── astro.config.mjs
```

## i18n

Each post is a **single MDX file** containing both languages. Language-specific
prose is wrapped in `<Ja>` / `<En>` components; shared content (code blocks,
equations, images) stays unwrapped and appears in both. At build time Astro
generates two routes per post:

- `/en/posts/{slug}` — renders `<En>` blocks + shared content
- `/ja/posts/{slug}` — renders `<Ja>` blocks + shared content

Default locale is `en`; both locales are explicit in the URL
(`prefixDefaultLocale: true`). See [`CLAUDE.md`](CLAUDE.md) for the full
authoring contract.

## Writing a post

Posts live in `apps/astro/src/content/posts/*.mdx`. Frontmatter must satisfy
`src/content/config.ts`:

```mdx
---
title:
  ja: "悟りとはルート権限である"
  en: "Enlightenment is Root Access"
date: "2026-03-26"
author:
  name: "Jun Kawasaki"
  picture: "/assets/posts/authors/jk.jpg"
excerpt:
  ja: "…"
  en: "…"
coverImage: "/assets/posts/preview/cover.jpg"
ogImage:
  url: "/assets/posts/preview/cover.jpg"
---

import Ja from '../../components/i18n/Ja.astro';
import En from '../../components/i18n/En.astro';

<Ja>UNIXにおいて root 権限とはすべてへの無制限のアクセスである。</Ja>
<En>In UNIX, root access means unrestricted access to everything.</En>
```

Conventions:

- Slug is language-neutral (e.g. `satori-is-root.mdx`); date is `"YYYY-MM-DD"`.
- Every `<Ja>` block should have a matching `<En>` block (parity is a quality
  check, not a build error).
- Keep all math, inequalities, and code **inside fenced or inline code** — MDX
  parses bare `<` and `{` in prose as JSX/expressions and the build will fail.

## Posts

A series of short essays and speculative-physics papers — language, computation,
Buddhism, and a running thread on **spirit as a physical/informational quantity**:

- **Spirit in Physics** — quantifying spirituality via word association (Kawasaki Model)
- **Information is Physical Quantity** — information as a measurable physical quantity
- **Spirit is Information** — a tensor-computational-physics formulation of the rubber hand illusion
- **Kotoba — A Distributed-Persistence Substrate for Hosting Spirit** — kotoba as the substrate that hosts spirit-as-information
- **Enlightenment is Root Access**, **No-Compute Computation**, **Reading Language as Graph Topology**, and translation essays (*Individual → 孤人*, *Manager → 幹事*).

## Deploy

Pushing to `main` triggers the **Deploy to GitHub Pages** workflow
(`.github/workflows/`): build `apps/astro` → upload Pages artifact → deploy to
https://junkawasaki.com.

## License

Private. © Jun Kawasaki.
