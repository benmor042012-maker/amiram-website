// /service-area/ — every city we serve, grouped by county. The old WordPress city pages
// (/roofing-company-<city>/) that don't have their own page here redirect to #<city>.
import { layout } from '../layout.mjs';
import { esc } from '../lib.mjs';
import { hero } from '../components/hero.mjs';
import { quoteSection } from '../components/sections.mjs';
import { roofingContractor, breadcrumbs } from '../schema.mjs';
import { SERVICE_AREA, VENTURA_COUNTY, CITY_PAGES, cityId } from '../data/cities.mjs';

function cityList(names) {
  // Los Angeles has no city page: the home page is about Los Angeles.
  const pageFor = { 'Los Angeles': '/', ...Object.fromEntries(CITY_PAGES.map((c) => [c.city, `/${c.slug}/`])) };
  return names.map((name) => {
    const href = pageFor[name];
    return `<li id="${cityId(name)}">${href ? `<a href="${href}">Roofing in ${esc(name)}</a>` : `Roofing in ${esc(name)}`}</li>`;
  }).join('\n      ');
}

export function renderServiceArea() {
  const crumb = '<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Service Area</li></ol></nav>';
  const la = SERVICE_AREA.filter((c) => !VENTURA_COUNTY.has(c));
  const ventura = SERVICE_AREA.filter((c) => VENTURA_COUNTY.has(c));
  const body = `
${hero({
  h1: 'Our Service Area: Los Angeles & Ventura County',
  lead: 'Family Roofing Inc. repairs, replaces and installs roofs in the cities below. Don’t see yours? Call us — we may still be able to help.',
  breadcrumb: crumb,
})}

<section class="section" aria-labelledby="la-title">
  <div class="container">
    <h2 id="la-title">Los Angeles County</h2>
    <!-- TODO(Amiram): confirm the full list of cities in src/data/cities.mjs -->
    <ul class="city-list city-list--page">
      ${cityList(la)}
    </ul>
  </div>
</section>

<section class="section section--alt" aria-labelledby="ventura-title">
  <div class="container">
    <h2 id="ventura-title">Ventura County</h2>
    <ul class="city-list city-list--page">
      ${cityList(ventura)}
    </ul>
  </div>
</section>

${quoteSection({ alt: false })}`;

  return layout({
    title: 'Roofing Service Area | Los Angeles & Ventura County',
    description:
      `Family Roofing Inc. serves ${SERVICE_AREA.length} cities across Los Angeles and Ventura County, from Santa Monica to Thousand Oaks. Call (323) 688-8088.`,
    path: '/service-area/',
    body,
    jsonLd: [
      roofingContractor(),
      breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Service Area', path: '/service-area/' }]),
    ],
  });
}
