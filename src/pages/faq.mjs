import { layout } from '../layout.mjs';
import { hero } from '../components/hero.mjs';
import { faqList, quoteSection } from '../components/sections.mjs';
import { faqPage, breadcrumbs } from '../schema.mjs';

export function renderFaq() {
  const crumb = '<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">FAQ</li></ol></nav>';
  const faqSchema = faqPage();
  const body = `
${hero({
  h1: 'Roofing FAQ: Costs, Insurance, Warranty & More',
  lead: 'Answers to the questions Los Angeles homeowners ask us most about roof repair and roof replacement.',
  breadcrumb: crumb,
})}

<section class="section" aria-label="Questions and answers">
  <div class="container narrow faq-page">
    ${faqList()}
  </div>
</section>

${quoteSection()}`;

  return layout({
    title: 'Roofing FAQ Los Angeles | Family Roofing Inc.',
    description:
      'Roof replacement cost in Los Angeles, insurance claims, job length, warranty, emergency repairs and free roof inspections — answered by Family Roofing Inc.',
    path: '/faq/',
    body: faqSchema ? body : `<!-- TODO(Amiram): FAQPage schema appears once at least one answer is final (src/data/faq.mjs) -->\n${body}`,
    jsonLd: [faqSchema, breadcrumbs([{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq/' }])],
  });
}
