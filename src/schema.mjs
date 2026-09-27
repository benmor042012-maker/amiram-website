// JSON-LD structured data. Only facts that also appear on the page are used.
import { SITE } from './data/site.mjs';
import { SERVICE_AREA } from './data/cities.mjs';
import { REVIEW_SUMMARY } from './data/reviews.mjs';
import { FAQ } from './data/faq.mjs';
import { openingHoursSchema } from './lib.mjs';

const abs = (path) => `${SITE.url}${path}`;

// RoofingContractor. `areaServed` defaults to the whole service area; city pages pass their city.
export function roofingContractor({ areaServed = SERVICE_AREA } = {}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    url: abs('/'),
    // TODO(Amiram): replace with a real raster logo (PNG, ≥112x112) — Google prefers PNG/JPG.
    logo: abs('/assets/img/logo.svg'),
    image: abs('/assets/img/og-image.jpg'),
    telephone: SITE.phone.tel,
    email: SITE.email,
    priceRange: SITE.priceRange,
    // Service-area business: city/region only; street address intentionally omitted (TODO in site.mjs).
    address: { '@type': 'PostalAddress', addressLocality: 'Los Angeles', addressRegion: 'CA', addressCountry: 'US' },
    areaServed: areaServed.map((name) => ({ '@type': 'City', name: `${name}, CA` })),
    openingHoursSpecification: openingHoursSchema(),
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      name: `${SITE.license.board} License #${SITE.license.number}`,
      recognizedBy: { '@type': 'Organization', name: 'Contractors State License Board', url: 'https://www.cslb.ca.gov/' },
    },
  };
  // aggregateRating ONLY with real, non-placeholder numbers (see src/data/reviews.mjs).
  const { placeholder, rating, count } = REVIEW_SUMMARY;
  if (!placeholder && rating != null && count != null) {
    data.aggregateRating = { '@type': 'AggregateRating', ratingValue: rating, reviewCount: count, bestRating: 5 };
  }
  return data;
}

export function faqPage() {
  const answered = FAQ.filter((f) => !f.pending && f.a);
  if (!answered.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: answered.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// crumbs: [{ name, path }]
export function breadcrumbs(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

// Serialize for a <script type="application/ld+json"> block (escape "<" so it can't close the tag).
export const jsonLdTag = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
