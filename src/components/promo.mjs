// The ONE promotion component. Driven entirely by SITE.promo.
// Rendered only while the promo is active at build time; `data-promo-end` lets
// main.js remove it in the browser once the end date passes, without a rebuild.
import { SITE } from '../data/site.mjs';
import { esc, promoActive } from '../lib.mjs';

const endAttr = () => (SITE.promo.endDate ? ` data-promo-end="${esc(SITE.promo.endDate)}"` : '');

// Hero banner.
export function promoBanner() {
  if (!promoActive()) return '<!-- Promotion hidden: disabled or past its end date (src/data/site.mjs) -->';
  const { title, text } = SITE.promo;
  return `<!-- TODO(Amiram): confirm the real promotion offer, terms and end date in src/data/site.mjs -->
    <p class="promo-banner" id="promo"${endAttr()}><strong>${esc(title)}:</strong> ${esc(text)}</p>`;
}

// Nav item pointing at the banner.
export function promoNavItem(href = '/#promo') {
  if (!promoActive()) return '';
  return `<li${endAttr()}><a href="${esc(href)}">${esc(SITE.promo.title)}</a></li>`;
}
