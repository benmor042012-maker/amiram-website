import { layout } from '../layout.mjs';
import { SITE } from '../data/site.mjs';
import { esc } from '../lib.mjs';
import { promoBanner } from '../components/promo.mjs';

export function renderHome() {
  const body = `
<section class="hero">
  <div class="container hero__inner">
    ${promoBanner()}
    <h1>Family Roofing Company CA</h1>
    <p class="hero__lead">Roof repair, roof replacement and new roof installation for homes and businesses in Los Angeles.</p>
    <div class="hero__ctas">
      <a class="btn btn--primary" href="#quote">Get a Free Quote</a>
      <a class="btn btn--ghost" href="tel:${SITE.phone.tel}">Call ${esc(SITE.phone.display)}</a>
    </div>
  </div>
</section>

<section id="services" class="section">
  <div class="container">
    <h2>Our Roofing Services</h2>
    <div class="cards">
      <article class="card"><h3>Roof Repair</h3><p>Leaks, storm damage, missing or broken shingles and tiles, flashing and more.</p></article>
      <article class="card"><h3>Roof Replacement</h3><p>Tear-off and replacement of worn-out roofs with new, code-compliant roofing systems.</p></article>
      <article class="card"><h3>New Roof Installation</h3><p>Shingle, tile and flat roof systems for new construction and additions.</p></article>
      <article class="card"><h3>Commercial Roofing</h3><p>Roofing for commercial and multi-unit properties.</p></article>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <h2>How to Get Our Services</h2>
    <ol class="steps">
      <li><h3>Contact us</h3><p>Call us or send the quote form below.</p></li>
      <li><h3>Free inspection</h3><p>We inspect your roof and explain what we find.</p></li>
      <li><h3>Written estimate</h3><p>You get a clear estimate before any work begins.</p></li>
      <li><h3>We get to work</h3><p>Our crew completes the job and cleans up.</p></li>
    </ol>
  </div>
</section>

<section id="projects" class="section">
  <div class="container">
    <h2>Before &amp; After</h2>
    <div class="projects">
      <div class="project"><img src="/assets/img/project-before.svg" width="600" height="400"><img src="/assets/img/project-after.svg" width="600" height="400"></div>
      <div class="project"><img src="/assets/img/project-before.svg" width="600" height="400"><img src="/assets/img/project-after.svg" width="600" height="400"></div>
      <div class="project"><img src="/assets/img/project-before.svg" width="600" height="400"><img src="/assets/img/project-after.svg" width="600" height="400"></div>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <h2>Limited Lifetime Warranty</h2>
    <p>Our roof installations come with a Limited Lifetime Warranty.</p>
  </div>
</section>

<section id="service-area" class="section">
  <div class="container">
    <h2>Service Area</h2>
    <ul class="city-list">
      <li>Los Angeles</li><li>Santa Monica</li><li>Pasadena</li><li>Beverly Hills</li><li>Woodland Hills</li><li>North Hollywood</li>
    </ul>
  </div>
</section>

<section id="quote" class="section section--alt">
  <div class="container narrow">
    <h2>Get a Free Quote</h2>
    <form class="quote-form" action="#" method="post">
      <label>Full name <input name="name" type="text" required></label>
      <label>Phone <input name="phone" type="tel" required></label>
      <label>Email <input name="email" type="email"></label>
      <label>Service
        <select name="service">
          <option>Roof Repair</option>
          <option>Roof Replacement</option>
          <option>New Roof Installation</option>
          <option>Commercial Roofing</option>
          <option>Other</option>
        </select>
      </label>
      <label class="consent"><input type="checkbox" name="consent" required> I agree to be contacted about my request by phone, text or email.</label>
      <button class="btn btn--primary" type="submit">Send Request</button>
    </form>
  </div>
</section>`;

  return layout({
    title: 'Roofing Company | Los Angeles, CA | Roof Repair, New Roof',
    description: 'Family Roofing Inc.',
    body,
  });
}
