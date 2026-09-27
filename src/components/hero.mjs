import { SITE } from '../data/site.mjs';
import { esc } from '../lib.mjs';
import { promoBanner } from './promo.mjs';

// Promise line under the H1.
export function heroPromise() {
  if (SITE.inspectionHours) return `<p class="hero__promise">Free Roof Inspection within ${Number(SITE.inspectionHours)} hours</p>`;
  return `<!-- TODO(Amiram): set SITE.inspectionHours in src/data/site.mjs to show "Free Roof Inspection within N hours" -->
    <p class="hero__promise">Free Roof Inspection — schedule yours today</p>`;
}

// Page hero with the page's only <h1>.
export function hero({ h1, lead, breadcrumb = '' }) {
  return `<section class="hero">
  <div class="container hero__inner">
    ${breadcrumb}
    ${promoBanner()}
    <h1>${esc(h1)}</h1>
    ${heroPromise()}
    <p class="hero__lead">${esc(lead)}</p>
    <div class="hero__ctas">
      <a class="btn btn--primary" href="#quote">Get a Free Quote</a>
      <a class="btn btn--ghost" href="tel:${SITE.phone.tel}">Call ${esc(SITE.phone.display)}</a>
    </div>
  </div>
</section>`;
}
