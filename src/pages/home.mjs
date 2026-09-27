import { layout } from '../layout.mjs';
import { hero } from '../components/hero.mjs';
import { reviewsSection, projectsSection, familySection, warrantySection } from '../components/trust.mjs';
import { servicesSection, howSection, serviceAreaSection, faqSection, quoteSection } from '../components/sections.mjs';
import { roofingContractor } from '../schema.mjs';

export function renderHome() {
  const body = `
${hero({
  h1: 'Roof Repair & Replacement in Los Angeles',
  lead: 'Family Roofing Inc. repairs, replaces and installs roofs for homes and businesses across Los Angeles and Ventura County.',
})}

${servicesSection()}

${reviewsSection()}

${howSection()}

${projectsSection()}

${familySection()}

${warrantySection()}

${serviceAreaSection()}

${faqSection({ alt: true })}

${quoteSection({ alt: false })}`;

  return layout({
    title: 'Roof Repair & Replacement in Los Angeles | Free Inspection',
    description:
      'Family Roofing Inc. repairs and replaces roofs across Los Angeles. Licensed CSLB #1116287. Call (323) 688-8088 for a free roof inspection and quote.',
    path: '/',
    body,
    // FAQPage markup lives on /faq/ only (Google: mark up one instance of repeated FAQs).
    jsonLd: [roofingContractor()],
  });
}
