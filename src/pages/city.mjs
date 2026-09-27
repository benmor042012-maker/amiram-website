// City landing page template. One page per entry in CITY_PAGES (src/data/cities.mjs).
import { layout } from '../layout.mjs';
import { esc } from '../lib.mjs';
import { hero } from '../components/hero.mjs';
import { servicesSection, howSection, serviceAreaSection, quoteSection } from '../components/sections.mjs';
import { roofingContractor, breadcrumbs } from '../schema.mjs';
import { SITE } from '../data/site.mjs';

export function renderCity(c) {
  const path = `/${c.slug}/`;
  const crumb = `<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">${esc(c.city)}</li></ol></nav>`;
  const body = `
${hero({
  h1: `Roof Repair & Replacement in ${c.city}, CA`,
  lead: `Licensed roofing contractor serving ${c.city} homes and businesses — repairs, full replacements and new roofs.`,
  breadcrumb: crumb,
})}

<section class="section" aria-labelledby="intro-title">
  <div class="container narrow">
    <h2 id="intro-title">Your Local Roofer in ${esc(c.city)}</h2>
    <!-- TODO(Amiram): review this draft intro for ${esc(c.city)} in src/data/cities.mjs -->
    ${c.intro.map((p) => `<p>${esc(p)}</p>`).join('\n    ')}
    <p>${esc(SITE.license.board)} License #${esc(SITE.license.number)} · <a href="tel:${SITE.phone.tel}">${esc(SITE.phone.display)}</a></p>
  </div>
</section>

${servicesSection({ city: c.city }).replace('class="section"', 'class="section section--alt"')}

${howSection()}

${serviceAreaSection({ current: c.city, alt: true })}

${quoteSection({ city: c.city, alt: false })}`;

  return layout({
    title: c.title,
    description: c.description,
    path,
    body,
    jsonLd: [
      roofingContractor({ areaServed: [c.city] }),
      breadcrumbs([{ name: 'Home', path: '/' }, { name: c.city, path }]),
    ],
  });
}
