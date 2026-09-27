// Frequently asked questions — used by /faq/ (with FAQPage JSON-LD) and the home page.
// An item with `pending: true` is shown with a "call us" fallback and is LEFT OUT of
// the FAQPage schema, so Google never sees an unconfirmed answer.
// TODO(Amiram): write the pending answers (and the TODO parts of the others), then set
// pending: false.
export const FAQ = [
  {
    q: 'How much does a roof replacement cost in Los Angeles?',
    a: 'The price depends on the size and pitch of the roof, the material you choose (shingle, tile or flat roofing), how many old layers need to be removed, and any repairs needed to the wood deck underneath. We inspect the roof for free and give you a written estimate before any work begins.',
    // TODO(Amiram): optionally add a typical price range for an average LA home.
    pending: false,
  },
  {
    q: 'Do you help with insurance claims?',
    a: null, // TODO(Amiram): do you work with insurance adjusters / document damage for claims?
    pending: true,
  },
  {
    q: 'How long does a roof replacement take?',
    a: null, // TODO(Amiram): typical duration for an average home, and what can extend it.
    pending: true,
  },
  {
    q: 'What warranty do you offer?',
    a: 'Our roof installations come with a Limited Lifetime Warranty. Ask us for the full terms, including what is and isn’t covered.',
    // TODO(Amiram): add the coverage details once confirmed (see src/data/trust.mjs).
    pending: false,
  },
  {
    q: 'How fast can you respond to a roofing emergency?',
    a: null, // TODO(Amiram): real emergency response time and availability (e.g. nights/weekends?).
    pending: true,
  },
  {
    q: 'Is the roof inspection really free?',
    a: 'Yes. Roof inspections and quotes are free. Call us or send the quote form to schedule yours.',
    // TODO(Amiram): add how soon an inspection happens (same value as SITE.inspectionHours).
    pending: false,
  },
];
