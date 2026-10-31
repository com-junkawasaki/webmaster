# Computable RIPO editorial review

Task: JUN-653. Review date: 2026-10-31 (Asia/Tokyo).
Base: webmaster `f04a12ec2094fa9f95b21085986fbc84018aa9bc`.
Delivery: source changes and Draft PR only; no merge or publication.

## Scope and reading order

1. `toward-computable-ripo.mdx`: new bilingual research proposal, four questions, typed semantic interface, conditional Inc bridge, persistence/branching, evidence, candidate BFO/CCO alignments, numerical/causal models and agents.
2. `foundations-of-relational-informational-process-ontology.mdx` and `foundations-of-relational-mathematics.mdx`: dated continuation notes; existing English-only routes remain English-only.
3. `information-is-organism.mdx`: corrected list/matching semantics, conditional quotient descent, interpretation versus mathematical/physical proof, life criteria and measurement limits.
4. `spirit-is-information.mdx`: explicit hypothesis status and correction of §6's universal Fisher/dissipation claim and asserted Landauer special case.
5. `infomation-is-physical-quantity.mdx`: corrected Shannon units, Toyabe setup/resource accounting and unconditional information-energy exchange language. Historical misspelled slug deliberately retained.
6. `spirit-in-physics.mdx`: “proves” corrected to a research proposal, dated qualification note; old dataset and publication assertions not independently reverified.
7. `kotoba-substrate-for-spirit.mdx`: dated historical-status note and current source pointer; old benchmark figures preserved as historical reports, not repeated as current measurements.

Original dates, article files, URLs and the historical line of argument remain. The new article and dated corrections distinguish interpretation, source inspection, proof terms, runnable data examples and empirical qualification.

## Source checks and discrepancies

Inc was freshly cloned from `com-junkawasaki/inc`; `git ls-remote origin refs/heads/main` independently returned `1bb368dc35827133cf42f7e4191f41cbfc754b1f`. This is the same revision already cited by the September essay. Boundary has not been removed from the inspected default branch. Other experimental branches were not audited. Lean was not rerun.

| Earlier description | Owning source or primary evidence | Editorial resolution |
|---|---|---|
| `information-is-organism` §5.1: boundary is a multiset | Inc `Axioms/Basic.lean:22–24` defines a List; `IncidenceTheory.lean:53–67` uses bidirectional existential matching | Describe representation and observed matching separately; no bijection/counting assertion |
| §5.1: literal Whitehead formalization, material absent | `Axioms.lean:18–61` supplies carrier, type function and structure; labels may encode material | Mark philosophical mapping as interpretation; distinguish observational and numerical identity |
| §5.3: material necessarily vanishes and observations always respect interaction | `IncidenceTheory.lean:1845–1851` defines congruence; `IncidenceResearch.lean:425–466` proves exact descent iff congruence | State the model-specific condition; remove unconditional material-independence |
| Resonance produces an actual third object | `Axioms.lean:25–38` and `IncidenceTheory.lean:1756–1767` distinguish a proposition and a computational selector | Require dynamics and dated occurrence evidence separately |
| `spirit-is-information` §6: arbitrary Fisher metric universally determines energy; Landauer is its one-bit special case | [Sivak–Crooks](https://arxiv.org/abs/1201.4166) treats a friction metric in linear response; [Reeb–Wolf](https://arxiv.org/abs/1306.4352) states physical erasure assumptions | Withdraw the asserted derivation; retain the self-metric construction as a proposed model |
| Physical-information essay: harmonic trap and work without external energy | [Toyabe et al.](https://arxiv.org/abs/1009.5287) uses feedback on a Brownian particle in an electrically imposed spiral-like potential | Correct setup and account for thermal fluctuations/controller |
| Kotoba essay's Rust-era mechanism table reads as current status | Current inspected Kotobase `src/kotobase/causal_commit.cljk:1–13`, revision `e5d9cd2ec1fcf59bc48162532acfab75b1bf6050`, describes immutable bases and branches | Preserve table with historical heading; do not claim current deployment/benchmarks or RIPO integration |

The pinned Kotobase commit was confirmed available through the GitHub commits API. Its source was inspected; no runtime test or current-release audit was performed. Unrelated WIP in the local Kotoba language checkout was left untouched.

External standards were checked against the primary W3C RDF 1.1, OWL 2, SHACL 2017, SPARQL 1.1 and PROV-O specifications. BFO-2020 and CCO maintained repositories were consulted for alignment scope, not imported into the example. Quantum-model vocabulary is linked to [Wilde](https://arxiv.org/abs/1106.1445); no quantum dynamics is derived from Inc.

## Reproducing the bounded checks

From the repository root, install the site's frozen dependencies and build:

```sh
pnpm install --frozen-lockfile
pnpm run build
```

Use a separate scratch virtual environment containing `rdflib==7.6.0` and `pyshacl==0.40.2`, then run with that environment's Python:

```sh
python scripts/verify-computable-ripo.py
```

The script parses all three Turtle files (51 core, 76 shape and 47 data triples), validates the positive example without entailment expansion, checks six independent negative controls against their expected SHACL focus/constraint, and executes the SPARQL query (one row, Celsius difference 1.0). It also parses the article excerpt and verifies that ordinary reification alone has not asserted the represented proposition. The excerpt is deliberately incomplete; the full downloadable graph is the conformance fixture.

The built new English/Japanese routes are checked for prose leakage, all 22 unique root-relative image/link references resolve, and generated routes for all seven revised posts link to the continuation. The SVG parses as XML. New language blocks are paired and code is shared outside them. Existing single-language essays are not retroactively translated.

`git diff --check` passed. The final static build generated 43 pages. English and Japanese local previews and the embedded architecture SVG were inspected in the browser; no publication occurred.

## Type diagnostic baseline

The repository has no configured standalone type-check script and does not install `tsc` or `@astrojs/check`. A separate scratch install of `@astrojs/check 0.9.12` with compatible `typescript 6.0.3` was used; package manifests and lockfiles were not changed.

```sh
astro-check --root apps/astro
```

The check returns 3 errors and 2 hints in 33 files. A pristine archive of base `f04a12e`, using the same dependency tree and tools after `astro sync`, returns the same diagnostics:

- `MoreStories.tsx:42–43`: optional date/author passed to required props (2 errors).
- `PostHeader.astro:39`: `dateTime` instead of Astro's `datetime` (1 error).
- `PostBody.astro:8` and `PostPreview.tsx:5`: unused declarations (2 hints).

These unchanged component errors are outside this editorial change. The type check is **not green**; the successful static build does not substitute for it.

## Qualification limits and review decisions

- The example is an illustrative partial vocabulary with placeholder IRIs, not a published RIPO standard, complete upper ontology, full Inc serialization or verified exporter.
- SHACL conformance is bounded graph validation. No OWL 2 DL profile/consistency proof, BFO/CCO alignment validation, Lean rebuild or empirical RIPO validation is claimed.
- Numerical models, causal identification, quantum correspondence, consciousness and individual persistence remain research obligations.
- No earlier prototype ZIP was supplied; the downloadable assets are new examples, not recovery of that artifact.
- The draft needs owner review of philosophical wording and the proposed formalization. Existing benchmark and dataset reports remain historical, explicitly unverified here.
- The task worktree must remain while its Draft PR is open. The canonical checkout and unrelated worktrees/branches are preserved; no worktree garbage was deleted.
