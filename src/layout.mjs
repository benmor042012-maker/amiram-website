// Shared page shell: <head>, header, footer.
import { SITE } from './data/site.mjs';
import { esc, hoursLines } from './lib.mjs';
import { promoNavItem } from './components/promo.mjs';
import { jsonLdTag } from './schema.mjs';

// path: page path with leading and trailing slash ("/", "/faq/"); used for the canonical URL.
// jsonLd: array of schema objects (nulls are skipped). noindex: for the 404 page.
export function layout({ title, description, path = '/', body, jsonLd = [], noindex = false }) {
  const canonical = `${SITE.url}${path}`;
  const ogImage = `${SITE.url}/assets/img/og-image.jpg`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<!-- TODO(Amiram): replace og-image.jpg (1200x630) with a real photo of your work -->
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b1f35">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<script>document.documentElement.classList.add('js')</script>
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/main.js" defer></script>
${jsonLd.filter(Boolean).map(jsonLdTag).join('\n')}
<!-- Analytics: if you add a tag (e.g. Google Analytics), put it here, once. -->
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
${header()}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
${mobileCtaBar()}
<!-- Mount point for a future AI lead assistant (chat). Intentionally empty — do not remove. -->
<div id="lead-assistant"></div>
</body>
</html>
`;
}

const phoneLink = () => `<a href="tel:${SITE.phone.tel}">${esc(SITE.phone.display)}</a>`;
const emailLink = () => `<a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>`;

function licenseLink() {
  const { board, number, lookupUrl } = SITE.license;
  return `<a href="${esc(lookupUrl)}" target="_blank" rel="noopener">${esc(board)} License #${esc(number)}<span class="visually-hidden"> (verify on the CSLB website, opens in a new tab)</span></a>`;
}

// Sticky call / quote bar, shown only below 768px (see .mobile-cta in style.css).
function mobileCtaBar() {
  return `<div class="mobile-cta" role="region" aria-label="Quick contact">
  <a class="mobile-cta__call" href="tel:${SITE.phone.tel}">Call ${esc(SITE.phone.display)}</a>
  <a class="mobile-cta__quote" href="#quote">Free Quote</a>
</div>`;
}

function header() {
  return `<header class="site-header">
  <div class="topbar">
    <div class="container topbar__inner">
      <span>${esc(hoursLines().join(' · '))}</span>
      ${phoneLink()}
      ${emailLink()}
    </div>
  </div>
  <div class="container nav-row">
    <a class="logo" href="/"><img src="/assets/img/logo.svg" alt="Family Roofing Inc. – home" width="180" height="48"></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul class="nav">
        <li><a href="/#services">Services</a></li>
        <li><a href="/#projects">Projects</a></li>
        <li><a href="/#reviews">Reviews</a></li>
        <li><a href="/#service-area">Service Area</a></li>
        <li><a href="/faq/">FAQ</a></li>
        ${promoNavItem('/#promo')}
        <li><a href="#quote">Free Quote</a></li>
      </ul>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <img src="/assets/img/logo-light.svg" alt="Family Roofing Inc." width="180" height="48" loading="lazy">
      <p>${licenseLink()}</p>
    </div>
    <div>
      <h2 class="footer-title">Contact</h2>
      <!-- TODO(Amiram): full street address hidden pending your decision:
           1444 N Poinsettia Pl Apt 219, Los Angeles, CA 90046 (see src/data/site.mjs) -->
      <p>${esc(SITE.serviceAreaLine)}</p>
      <p>${phoneLink()}<br>
      ${emailLink()}</p>
    </div>
    <div>
      <h2 class="footer-title">Hours</h2>
      <!-- TODO(Amiram): confirm hours in src/data/site.mjs -->
      <p>${hoursLines().map(esc).join('<br>')}</p>
      <p><a href="/faq/">Frequently asked questions</a></p>
    </div>
  </div>
  <p class="copyright">Copyright © <span data-year>${new Date().getFullYear()}</span> ${esc(SITE.name)} All rights reserved.</p>
</footer>`;
}
