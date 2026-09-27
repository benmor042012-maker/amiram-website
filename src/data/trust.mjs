// Owner note and warranty details.

// TODO(Amiram): write a short (2–4 sentence) note in your own words and add a real
// family/team photo (src/static/assets/img/family.webp, ~800x600), then set placeholder: false.
export const FAMILY = {
  placeholder: true,
  photo: { src: '/assets/img/family-placeholder.svg', alt: 'Placeholder for a photo of the Family Roofing team' },
  note: 'Placeholder — a short note from the owner about the family business goes here.',
  signature: null, // e.g. 'Amiram, Owner'
};

// "Limited Lifetime Warranty" is the warranty named on the current site.
// TODO(Amiram): fill in exactly what is covered and excluded (and who issues it —
// Family Roofing, the manufacturer, or both). Do not publish until confirmed.
export const WARRANTY = {
  name: 'Limited Lifetime Warranty',
  covers: [], // e.g. ['Manufacturing defects in shingles', 'Workmanship for N years']
  excludes: [], // e.g. ['Damage from severe weather events', 'Work by other contractors']
  documentUrl: null, // optional link to a PDF of the full warranty terms
};

// Owens Corning contractor badge. Hidden until `confirmed: true`.
// TODO(Amiram): confirm your Owens Corning contractor network status/tier and add the
// official badge file from Owens Corning (src/static/assets/img/owens-corning-badge.png).
export const OC_BADGE = {
  confirmed: false,
  label: 'Owens Corning contractor', // e.g. 'Owens Corning Preferred Contractor'
  src: '/assets/img/owens-corning-badge.png',
  width: 160,
  height: 160,
};
