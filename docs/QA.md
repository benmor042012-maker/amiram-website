# QA report

Run on 2026-09-27 with Lighthouse 13.5.0 (mobile preset, headless Chromium), axe-core via
`@axe-core/playwright`, and `scripts/check.mjs` + `scripts/browser-qa.mjs`.
Everything was served locally from `dist/`.

> **"Before" is not the live site.** This environment's network policy blocks
> familyroofinginc.com, so "before" is the baseline commit: a reconstruction of the current
> home page from the brief. Real-world scores on the new host will also differ
> (network, CDN, real images).

## Lighthouse (mobile)

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|------|-----:|-----:|-----:|-----:|----:|----:|
| Home — before (baseline reconstruction) | 99 | 86 | 100 | 91 | 1.2 s | 0 |
| Home — after | 100 | 100 | 100 | 100 | 1.1 s | 0 |
| /roofing-company-pasadena/ — after | 100 | 100 | 100 | 100 | 1.0 s | 0 |
| /faq/ — after | 100 | 100 | 100 | 100 | 1.0 s | 0 |

Baseline failures fixed: `image-alt` (logo/project images without alt), `link-name` (logo link
without an accessible name).

## Checks (all passing)

| Check | How | Result |
|---|---|---|
| Exactly one H1, no skipped heading levels | `check.mjs`, all 7 pages | ✅ |
| Title ≤ 60 / description ≤ 155 chars, unique | `check.mjs` | ✅ (home: 58 / 148) |
| Canonical = own absolute URL, in sitemap | `check.mjs` | ✅ |
| Every `<img>` has alt | `check.mjs` | ✅ |
| No broken internal links or `#anchors`; assets exist | `check.mjs` | ✅ |
| tel/mailto links | `check.mjs` + browser | ✅ `tel:+13236888088`, `mailto:office@familyroofinginc.com` only |
| JSON-LD parses | `check.mjs` | ✅ RoofingContractor, FAQPage (answered items only), BreadcrumbList |
| WCAG 2.1 AA (axe, incl. color contrast), mobile + desktop | `browser-qa.mjs`, all 7 pages | ✅ 0 violations |
| Layout shift incl. sticky bar | `browser-qa.mjs` (PerformanceObserver) + Lighthouse | ✅ CLS 0.000 on every page |
| Sticky bar doesn't cover footer (<768px), hidden ≥768px | `browser-qa.mjs` | ✅ |
| Form: empty submit → 5 accessible errors, focus to summary | `browser-qa.mjs` | ✅ |
| Form: 11 MB photo rejected | `browser-qa.mjs` | ✅ |
| Form: valid submit POSTs multipart (all fields + photo) to the endpoint | `browser-qa.mjs` against a local test endpoint | ✅ |
| Promo hidden after end date without rebuild | `browser-qa.mjs` (clock set to end date + 2 days) | ✅ |
| Copyright year = current year | `browser-qa.mjs` | ✅ |
| Skip link first in tab order; menu aria-expanded + Escape | `browser-qa.mjs` | ✅ |
| Console errors / failed requests | `browser-qa.mjs` | ✅ none |

## Not verified here

- **External links** (cslb.ca.gov) and the **real form endpoint**: blocked by the network
  policy, and the endpoint isn't known yet (TODO). The form was verified against a local test
  endpoint only.
- **Old-URL redirects** (`_redirects`): `npm run check` verifies every old URL maps to a page
  and #anchor that exists, but how the host applies the file still needs a spot-check after deploy.
- **Real devices**: iOS Safari and Android Chrome haven't been tested; only emulated viewports.
