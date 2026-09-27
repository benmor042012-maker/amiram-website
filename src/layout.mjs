// Shared page shell: <head>, header, footer.
import { SITE } from './data/site.mjs';
import { esc, hoursLines } from './lib.mjs';
import { promoNavItem } from './components/promo.mjs';

export function layout({ title, description, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/main.js" defer></script>
</head>
<body>
${header()}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;
}

const phoneLink = () => `<a href="tel:${SITE.phone.tel}">${esc(SITE.phone.display)}</a>`;
const emailLink = () => `<a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>`;

function licenseLink() {
  const { board, number, lookupUrl } = SITE.license;
  return `<a href="${esc(lookupUrl)}" target="_blank" rel="noopener">${esc(board)} License #${esc(number)}</a>`;
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
    <a class="logo" href="/"><img src="/assets/img/logo.svg" width="180" height="48"></a>
    <nav>
      <ul class="nav">
        <li><a href="/">Home</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#reviews">Reviews</a></li>
        ${promoNavItem('#promo')}
        <li><a href="#quote">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <img src="/assets/img/logo.svg" width="180" height="48">
      <p>${licenseLink()}</p>
    </div>
    <div>
      <h3>Contact</h3>
      <!-- TODO(Amiram): full street address hidden pending your decision:
           1444 N Poinsettia Pl Apt 219, Los Angeles, CA 90046 (see src/data/site.mjs) -->
      <p>${esc(SITE.serviceAreaLine)}</p>
      <p>${phoneLink()}<br>
      ${emailLink()}</p>
    </div>
    <div>
      <h3>Hours</h3>
      <!-- TODO(Amiram): confirm hours in src/data/site.mjs -->
      <p>${hoursLines().map(esc).join('<br>')}</p>
    </div>
  </div>
  <p class="copyright">Copyright © <span data-year>${new Date().getFullYear()}</span> ${esc(SITE.name)} All rights reserved.</p>
</footer>`;
}
