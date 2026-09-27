// Page sections shared by the home page, city pages and FAQ page.
import { SITE } from '../data/site.mjs';
import { SERVICES } from '../data/services.mjs';
import { SERVICE_AREA, CITY_PAGES } from '../data/cities.mjs';
import { FAQ } from '../data/faq.mjs';
import { esc } from '../lib.mjs';
import { quoteForm } from './quote-form.mjs';

export function servicesSection({ city = '' } = {}) {
  const cards = SERVICES.map((s) => `<li class="card"><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p></li>`).join('\n      ');
  return `<section id="services" class="section" aria-labelledby="services-title">
  <div class="container">
    <h2 id="services-title">Our Roofing Services${city ? ` in ${esc(city)}` : ''}</h2>
    <ul class="cards" role="list">
      ${cards}
    </ul>
  </div>
</section>`;
}

export function howSection({ alt = false } = {}) {
  return `<section class="section${alt ? ' section--alt' : ''}" aria-labelledby="how-title">
  <div class="container">
    <h2 id="how-title">How to Get Our Services</h2>
    <ol class="steps">
      <li><h3>Contact us</h3><p>Call us or send the quote form below.</p></li>
      <li><h3>Free inspection</h3><p>We inspect your roof and explain what we find.</p></li>
      <li><h3>Written estimate</h3><p>You get a clear estimate before any work begins.</p></li>
      <li><h3>We get to work</h3><p>Our crew completes the job and cleans up.</p></li>
    </ol>
  </div>
</section>`;
}

// Cities with a landing page are linked; the rest are listed as text.
export function serviceAreaSection({ current = '', alt = false } = {}) {
  const pageFor = Object.fromEntries(CITY_PAGES.map((c) => [c.city, c.slug]));
  const items = SERVICE_AREA.map((name) => {
    const slug = pageFor[name];
    if (!slug || name === current) return `<li>${esc(name)}</li>`;
    return `<li><a href="/${slug}/">Roofing in ${esc(name)}</a></li>`;
  }).join('');
  return `<section id="service-area" class="section${alt ? ' section--alt' : ''}" aria-labelledby="area-title">
  <div class="container">
    <h2 id="area-title">Service Area</h2>
    <p>${esc(SITE.serviceAreaLine)}, including:</p>
    <!-- TODO(Amiram): confirm the full list of cities in src/data/cities.mjs -->
    <ul class="city-list">${items}</ul>
  </div>
</section>`;
}

export function quoteSection({ city = '', alt = true } = {}) {
  return `<section id="quote" class="section${alt ? ' section--alt' : ''}" aria-labelledby="quote-title">
  <div class="container narrow">
    <h2 id="quote-title">Get a Free Quote${city ? ` in ${esc(city)}` : ''}</h2>
    <p>Tell us about your roof and we’ll get back to you. Prefer to talk? Call <a href="tel:${SITE.phone.tel}">${esc(SITE.phone.display)}</a>.</p>
    ${quoteForm({ city })}
  </div>
</section>`;
}

const pendingAnswer = () =>
  `We’re finalizing this answer. Call us at <a href="tel:${SITE.phone.tel}">${esc(SITE.phone.display)}</a> and we’ll answer it right away.`;

function answerHtml(f) {
  if (f.pending || !f.a) return `<!-- TODO(Amiram): answer pending in src/data/faq.mjs -->\n      <p>${pendingAnswer()}</p>`;
  return `<p>${esc(f.a)}</p>`;
}

// Home page: collapsible list. FAQ page: full list with <h2> per question.
export function faqSection({ alt = false } = {}) {
  const items = FAQ.map((f) => `<details class="faq-item">
      <summary>${esc(f.q)}</summary>
      ${answerHtml(f)}
    </details>`).join('\n    ');
  return `<section id="faq" class="section${alt ? ' section--alt' : ''}" aria-labelledby="faq-title">
  <div class="container narrow">
    <h2 id="faq-title">Frequently Asked Questions</h2>
    ${items}
    <p><a href="/faq/">See all roofing FAQs</a></p>
  </div>
</section>`;
}

export function faqList() {
  return FAQ.map((f) => `<div class="faq-entry">
      <h2>${esc(f.q)}</h2>
      ${answerHtml(f)}
    </div>`).join('\n    ');
}
