// SINGLE SOURCE OF TRUTH for business facts used across the site
// (header, footer, hero, forms, JSON-LD). Change a value here and rebuild.

export const SITE = {
  name: 'Family Roofing Inc.',
  url: 'https://familyroofinginc.com',

  phone: {
    display: '(323) 688-8088',
    tel: '+13236888088',
  },

  // One constant for both the visible address and the mailto: link.
  // TODO(Amiram): confirm office@familyroofinginc.com is monitored (the old mailto pointed to ami@).
  email: 'office@familyroofinginc.com',

  license: {
    board: 'CSLB',
    number: '1116287',
    // TODO(Amiram): optionally deep-link to the license detail page once verified, e.g.
    // https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=1116287
    lookupUrl: 'https://www.cslb.ca.gov/',
  },

  // Public service-area line. The street address is intentionally NOT shown.
  // TODO(Amiram): decide whether to publish the full address
  //   (currently on the live site: 1444 N Poinsettia Pl Apt 219, Los Angeles, CA 90046).
  serviceAreaLine: 'Serving Los Angeles & Ventura County',

  // JSON-LD priceRange. TODO(Amiram): confirm ("$" budget … "$$$$" premium).
  priceRange: '$$',

  // Opening hours — used by the header, footer and JSON-LD.
  // TODO(Amiram): confirm the real hours. The live header said "Mon–Sun" while the
  // footer said "Saturday - Closed"; this default follows the header (daily 8am–5pm).
  // days: Mo Tu We Th Fr Sa Su   open/close: 24h "HH:MM"; omit a day to mark it closed.
  hours: [
    { days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], open: '08:00', close: '17:00' },
  ],

  // The ONE promotion shown in the nav and hero. Hidden automatically after endDate
  // (at build time, and in the browser for visitors after that date).
  // TODO(Amiram): confirm the real offer text, its terms and the end date.
  promo: {
    enabled: true,
    title: 'Winter Promotion',
    text: 'Save up to $1,000 on your roofing project.',
    endDate: '2026-12-31', // YYYY-MM-DD, last day the promo is shown (Los Angeles time)
  },

  // Hero promise: "Free Roof Inspection within N hours".
  // TODO(Amiram): set the real response time (number of hours). While null, the hero
  // shows "Free Roof Inspection — schedule yours today" instead of a number.
  inspectionHours: null,

  // Quote form.
  form: {
    // TODO(Amiram): the URL the existing quote form posts to (e.g. your current WordPress
    // form handler, or a free service you already use). Field names must match what that
    // endpoint expects — see src/components/quote-form.mjs. Can also be set at build time
    // with FORM_ENDPOINT=https://... npm run build. While empty, the form validates but
    // tells the visitor to call instead of sending.
    endpoint: process.env.FORM_ENDPOINT || '',
    maxPhotoMB: 10,
  },
};
