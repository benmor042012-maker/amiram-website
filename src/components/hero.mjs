import { SITE } from '../data/site.mjs';

// Promise line under the H1.
export function heroPromise() {
  if (SITE.inspectionHours) return `<p class="hero__promise">Free Roof Inspection within ${Number(SITE.inspectionHours)} hours</p>`;
  return `<!-- TODO(Amiram): set SITE.inspectionHours in src/data/site.mjs to show "Free Roof Inspection within N hours" -->
    <p class="hero__promise">Free Roof Inspection — schedule yours today</p>`;
}
