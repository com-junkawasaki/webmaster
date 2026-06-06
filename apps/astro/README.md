# apps/astro — junkawasaki.com

The Astro 5 application behind [junkawasaki.com](https://junkawasaki.com).
See the [repo README](../../README.md) for the full project overview and the
[CLAUDE.md](../../CLAUDE.md) for the bilingual MDX authoring contract.

## Commands

Run from the repo root (preferred) or this directory:

| Command                       | Action                                |
|-------------------------------|---------------------------------------|
| `pnpm dev`                    | Dev server at `localhost:4321`        |
| `pnpm build`                  | Production build to `apps/astro/dist/` |
| `pnpm --filter astro preview` | Preview the production build locally   |

## Stack

Astro 5 · MDX · React · Tailwind CSS · KaTeX. Bilingual (`en`/`ja`) routing via
Astro i18n with `<Ja>` / `<En>` content tags. Static output deployed to GitHub
Pages.
