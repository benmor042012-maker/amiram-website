import { layout } from '../layout.mjs';
import { SITE } from '../data/site.mjs';
import { esc } from '../lib.mjs';
import { quoteSection } from '../components/sections.mjs';

export function renderNotFound() {
  const body = `
<section class="hero">
  <div class="container hero__inner">
    <h1>Page Not Found</h1>
    <p class="hero__lead">Sorry, we couldn’t find that page. Try the <a class="on-dark" href="/">home page</a>, our <a class="on-dark" href="/faq/">FAQ</a>, or call <a class="on-dark" href="tel:${SITE.phone.tel}">${esc(SITE.phone.display)}</a>.</p>
  </div>
</section>

${quoteSection()}`;
  return layout({ title: 'Page Not Found | Family Roofing Inc.', description: 'This page could not be found.', path: '/404.html', body, noindex: true });
}
