# Inside an LLM — measured learning article (JUN-853)

Prepared 2026-11-05. Codex chat: `01a1a9dc-5406-7e33-b98e-8f43a98cb94e`.
The owner explicitly requested publication of the conversation's measurements,
explanations and animations to `https://junkawasaki.com/en/`.

## Content and boundaries

- One bilingual MDX source, English and Japanese routes, with English lab controls.
- Three same-origin static labs: every indexed layer/head/expert in the atlas;
  every component of layer-0 QKV; the measured seven-stage partial training demo.
- The 3D token player replays measured positions and stops after one pass.
  It is not a time trace of autoregressive decoding. Reduced motion disables
  timed token playback; training supports manual steps.
- All numerical JSON script payloads match the original research fragments
  exactly. Only UI, local links, playback controls and the standalone shell differ.
- All 660 stored tensors / 5,732 regions are covered by the atlas. Geometry is
  architectural, and color encodes region-level RMS or routing, not coefficient
  importance. The JSON link downloads the actual partition/statistics index;
  full original coefficients remain in the immutable upstream checkpoints.
- QKV is explicitly layer 0, all heads/tokens/components. Its compressed values
  preserve original BF16/F32 representations. The all-layer QKV archive remains
  in the research workspace; the public lab does not claim to show all layers.
- Training is one example / one SGD step / selected parameters. Its endpoint
  values are measured; motion and interpolation are schematic. No claim of
  generalization, full pretraining reproduction, or measured Sigma weights.
- No checkpoint download, remote inference, analytics, local coefficient server
  or Codex host API is required by the labs. D3 7.9.0 is served locally with its
  ISC license. The article links the original model sources/licenses.
- Full checkpoints, optimizer deltas, machine-specific paths and private data
  are not published. Prior research files are preserved unchanged.

## Rebuild and verification

Research inputs are retained in the session's `jun853-weight-atlas` workspace.
`FULL_REPORT.md`, `TRAINING_ANIMATION.md` and `QKV_REPORT.md` there document
the recorded runs. Inputs are pinned by hash in the public `manifest.json`.

```sh
python3 scripts/export-llm-learning.py RESEARCH_WORKSPACE VISUALIZE_SKILL_DIR
python3 scripts/render-llm-learning-figures.py RESEARCH_WORKSPACE
pnpm install --frozen-lockfile
pnpm build
python3 -m http.server 8854 --bind 127.0.0.1 --directory apps/astro/dist
# With Playwright installed on NODE_PATH and a local Chrome at CHROME_PATH:
node scripts/verify-llm-learning.cjs
```

Matplotlib/NumPy are used only for offline figures; no Python/model runtime is
shipped to readers. The export first uses the visualization renderer, then
adapts the original fragment to the site's ordinary same-origin static shell.
The published manifest is refreshed after English figure generation. D3's
upstream URL is `https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js`; its
SHA-256 is `f2094bbf6141b359722c4fe454eb6c4b0f0e42cc10cc7af921fc158fceb86539`.

Verified locally:

- Production Astro build: 45 routes, including both new locale routes.
- Scientific JSON payload equality with original fragments; paired language
  blocks; public JSON contains no machine paths or loopback links.
- All three model selectors, final layer access, constant weight values when
  selecting another input token, token playback, seven training stages and
  before/after coefficient changes.
- QKV raw/transformed stages, full embeddings and causal future masks.
- Widths 360/768: no page or lab horizontal overflow, no SVG text outside bounds.
- Reduced-motion stepping, home-page article link and English/Japanese routes.
- No page errors, HTTP failures, localhost coefficient calls or remote D3 calls.
- Desktop/mobile screenshots inspected; English scientific figures regenerated.

The original numeric checks show zero observed logit disturbance, zero maximum
difference for first-layer recomputed QKV, and zero for all-layer recomputed
QK scores and Attention-times-V context. These are bounded implementation/input
checks, not evidence of per-neuron semantics or CUDA bitwise equivalence.

## Publication route and documentation discrepancy

`README.md` and `.github/workflows/deploy.yml` describe an Actions deployment.
The actual Pages API reports `build_type=legacy`, source `gh-pages:/`, and
repository Actions permissions report `enabled=false`. The existing
`scripts/publish-pages.cljk` documents the current direct branch mechanism.
No deployment settings, workflow definitions or owner architecture documents
are changed for this article.

Publication uses the same git plumbing as that script: build from a reviewed
commit containing freshly fetched `origin/main`; commit the complete dist tree
with a separate index; retain CNAME and `.nojekyll`; parent the current remote
gh-pages head; push without force. This session uses Python/git rather than
starting a JVM/nbb/cljk runtime. Anonymous HTTP and browser readback are required
before reporting publication. The authoring PR and public delivery are distinct.
