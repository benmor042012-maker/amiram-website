import { renderHome } from './pages/home.mjs';
import { renderCity } from './pages/city.mjs';
import { renderFaq } from './pages/faq.mjs';
import { renderServiceArea } from './pages/service-area.mjs';
import { renderNotFound } from './pages/not-found.mjs';
import { CITY_PAGES } from './data/cities.mjs';

// Every page of the site. `path` is the URL path; indexable pages go into sitemap.xml.
export function pages() {
  return [
    { path: '/', html: renderHome(), priority: '1.0' },
    ...CITY_PAGES.map((c) => ({ path: `/${c.slug}/`, html: renderCity(c), priority: '0.8' })),
    { path: '/service-area/', html: renderServiceArea(), priority: '0.7' },
    { path: '/faq/', html: renderFaq(), priority: '0.6' },
    { path: '/404.html', html: renderNotFound(), noindex: true },
  ];
}
