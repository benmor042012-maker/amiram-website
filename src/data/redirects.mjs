// 301 redirects from the old WordPress site's URLs (every URL is listed in legacy-urls.mjs).
// build.mjs turns these into dist/_redirects (Netlify / Cloudflare Pages format), and
// `npm run check` verifies every old URL lands on a page (and #anchor) that exists.
//
// Rules of thumb used here:
// - an old URL whose path is also a page of this site is NOT redirected (same URL, e.g. the
//   city pages in CITY_PAGES);
// - otherwise it goes to the most relevant page or section, never blindly to the home page.
//
// TODO(Amiram): the old service pages and project posts currently point at sections of the
// home page. If any of them brings in real traffic (check Google Search Console → Pages),
// consider rebuilding it as its own page here instead of redirecting it.
import { SERVICE_AREA, CITY_PAGES, cityId, legacyCityPath } from './cities.mjs';
import { promoActive } from '../lib.mjs';

const SERVICES = '/#services';
const PROJECTS = '/#projects';
const FAMILY = '/#family';
const QUOTE = '/#quote';

// Old pages (page-sitemap.xml) other than the city pages.
const PAGES = {
  '/services/': SERVICES,
  '/roof-repair-services-in-los-angeles-ca/': SERVICES,
  '/roof-replacement/': SERVICES,
  '/new-roof-installation-services-in-los-angeles-ca/': SERVICES,
  '/about-us/': FAMILY,
  '/contact-us/': QUOTE,
  // The promotion banner has id="promo" only while a promotion is running.
  '/fall-promotion/': promoActive() ? '/#promo' : '/',
};

// Old blog posts (post-sitemap.xml).
const POSTS = {
  // Before/after project write-ups.
  '/recent-projects-in-california/': PROJECTS,
  '/roof-replacement-in-norwalk-ca/': PROJECTS,
  '/roof-replacement-in-van-nuys-ca/': PROJECTS,
  '/roof-repair-in-glendale-ca/': PROJECTS,
  '/roof-replacement-in-north-hollywood-ca/': PROJECTS,
  '/roof-replacement-in-pasadena-ca/': PROJECTS,
  '/roof-replacement-in-windsor-hills-ca/': PROJECTS,
  '/roof-replacement-in-anaheim-ca/': PROJECTS,
  '/roof-replacement-in-cypress-ca/': PROJECTS,
  '/roof-replacement-in-cypress-ca-2/': PROJECTS,
  '/roof-replacement-in-alhambra-ca/': PROJECTS,
  '/roof-replacement-in-whittier-ca/': PROJECTS,
  '/roof-replacement-in-los-angeles-ca/': PROJECTS,
  '/tile-roof-repair-in-brea-ca/': PROJECTS,
  '/roof-replacement-in-long-beach-ca/': PROJECTS,
  '/roof-replacement-in-cerritos-ca/': PROJECTS,
  '/roof-replacement-in-central-la-ca/': PROJECTS,

  // Articles about a specific service.
  '/best-roofing-repair-services-near-me-trusted-experts-you-can-count-on/': SERVICES,
  '/emergency-roof-repair-company-near-me-why-family-roofing-is-your-trusted-local-partner/': SERVICES,
  '/emergency-roofing-and-gutter-installation-specialists-near-me-trusted-services-by-family-roofing/': SERVICES,
  '/family-roofing-top-rated-roofing-inspection-company-near-me/': SERVICES,
  '/top-rated-roofing-solutions-for-flat-roof-repair-near-me-why-family-roofing-is-the-local-expert-you-can-trust/': SERVICES,
  '/long-lasting-roof-solutions-contractors-near-me-expert-services-by-family-roofing/': SERVICES,
  '/affordable-new-roof-installation-contractors-near-me-family-roofing-you-can-trust/': SERVICES,
  '/family-roofing-dependable-roofing-team-for-tile-roofs-near-me/': SERVICES,
  '/roofing-and-siding-installation-services/': SERVICES,
  '/experienced-roofers-for-asphalt-shingles/': SERVICES,
  '/best-residential-roof-replacement-company/': SERVICES,
  '/roofing-team-for-tile-roofs-company/': SERVICES,
  '/best-roof-repair-and-ventilation-services/': SERVICES,
  '/best-roofing-services/': SERVICES,
  '/best-roofing-and-siding-installation-services-in-los-angeles-ca-by-family-roofing/': SERVICES,
  '/top-reliable-roofing-maintenance-services-in-los-angeles-ca-by-family-roofing/': SERVICES,
  '/top-rated-roofing-inspection-company-in-los-angeles-ca-family-roofing/': SERVICES,
  '/skilled-roofers-for-chimney-flashing-repairs-in-los-angeles-ca-trusted-solutions-by-family-roofing/': SERVICES,
  '/commercial-roofing-contractors-with-great-reviews-in-los-angeles-ca-trusted-expertise-from-family-roofing/': SERVICES,
  '/commercial-roofing-and-gutter-installation-specialists-in-los-angeles-ca-protect-your-business-with-family-roofing/': SERVICES,
  '/top-metal-roofing-installation-company-in-los-angeles-ca-premium-roofing-solutions-by-family-roofing/': SERVICES,
  '/long-lasting-roof-solutions-contractors/': SERVICES,
  '/affordable-new-roof-installation-company/': SERVICES,
  '/best-roofing-solutions-for-flat-roof-repair/': SERVICES,

  // Articles about the company itself.
  '/family-roofing-affordable-family-owned-roofing-company-near-me/': FAMILY,
  '/licensed-family-roofing-specialists/': FAMILY,
  '/free-estimate-roofing-contractors-near-me-family-roofing-you-can-trust/': QUOTE,
  '/family-roofing-trusted-residential-roofing-experts-near-me/': '/',
  '/eco-friendly-roofing-company-near-me-choose-family-roofing-for-sustainable-solutions-that-last/': '/',
  '/eco-friendly-family-roofing-company-in-los-angeles-ca-family-roofing/': '/',
  '/roofing-contractors-los-angeles/': '/',
  '/best-roofing-company/': '/',
  '/affordable-roofing-contractors/': '/',
  '/affordable-roofing-company-offering-senior-discounts/': '/',
};

// Old category archives (category-sitemap.xml). Anything else under /category/ → home.
const CATEGORIES = {
  '/category/roof-repair/': SERVICES,
  '/category/roof-replacement/': SERVICES,
  '/category/roofers-for-asphalt-shingles/': SERVICES,
  '/category/affordable-family-owned-roofing-company-near-me/': FAMILY,
  '/category/trusted-family-owned-residential-roofing-experts/': FAMILY,
};

// Old city pages: those that still exist here keep their URL; the rest go to that city on
// /service-area/. Adding a city to CITY_PAGES removes its redirect automatically.
function cityRedirects() {
  const kept = new Set(CITY_PAGES.map((c) => `/${c.slug}/`));
  return Object.fromEntries(
    SERVICE_AREA.filter((name) => !kept.has(legacyCityPath(name))).map((name) => [
      legacyCityPath(name),
      // Los Angeles is the home page's own city.
      name === 'Los Angeles' ? '/' : `/service-area/#${cityId(name)}`,
    ]),
  );
}

// Exact old URL → new URL.
export function exactRedirects() {
  return { ...PAGES, ...cityRedirects(), ...POSTS, ...CATEGORIES };
}

// Pattern rules, applied after the exact ones (order matters: first match wins).
export const PATTERN_REDIRECTS = [
  // Old XML sitemaps (Search Console may still have them registered).
  ['/sitemap_index.xml', '/sitemap.xml'],
  ['/wp-sitemap.xml', '/sitemap.xml'],
  ['/news-sitemap.xml', '/sitemap.xml'],
  ['/post-sitemap.xml', '/sitemap.xml'],
  ['/page-sitemap.xml', '/sitemap.xml'],
  ['/category-sitemap.xml', '/sitemap.xml'],
  ['/post_tag-sitemap.xml', '/sitemap.xml'],
  ['/author-sitemap.xml', '/sitemap.xml'],
  // WordPress archives and feeds.
  ['/category/*', '/'],
  ['/tag/*', '/'],
  ['/author/*', FAMILY],
  ['/feed/*', '/'],
  ['/comments/feed/*', '/'],
  ['/:slug/feed/*', '/:slug/'],
];
