// Service area. `areaServed` in the JSON-LD and the service-area section use this list.
// TODO(Amiram): confirm the full list of cities you serve (the brief says
// "Los Angeles & Ventura County"); add or remove entries as needed.
export const SERVICE_AREA = [
  'Los Angeles',
  'Santa Monica',
  'Pasadena',
  'Beverly Hills',
  'Woodland Hills',
  'North Hollywood',
];

// Cities with their own landing page (src/pages/city.mjs). Each needs unique copy.
// TODO(Amiram): review/rewrite every `intro` — they are drafts and must describe
// your real experience in that city. Add local project photos/reviews when available.
export const CITY_PAGES = [
  {
    city: 'Santa Monica',
    slug: 'roofing-company-santa-monica',
    title: 'Santa Monica Roof Repair & Replacement | Free Inspection',
    description: 'Roof repair and roof replacement in Santa Monica, CA by Family Roofing Inc. Licensed CSLB #1116287. Book your free roof inspection: (323) 688-8088.',
    intro: [
      'Homes near the coast deal with salt air, marine-layer moisture and strong afternoon sun — conditions that wear down flashing, fasteners and roofing materials over time.',
      'Family Roofing Inc. repairs and replaces roofs for Santa Monica homeowners and property owners. We start with a free inspection, show you what we find, and give you a clear written estimate before any work begins.',
    ],
  },
  {
    city: 'Pasadena',
    slug: 'roofing-company-pasadena',
    title: 'Pasadena Roof Repair & Replacement | Free Inspection',
    description: 'Roof repair and roof replacement in Pasadena, CA by Family Roofing Inc. Licensed CSLB #1116287. Book your free roof inspection: (323) 688-8088.',
    intro: [
      'From Craftsman bungalows to mid-century homes, Pasadena has a wide mix of roof styles and ages — and each one needs the right materials and details to stay watertight.',
      'Family Roofing Inc. repairs and replaces roofs across Pasadena. Your project starts with a free roof inspection and a clear written estimate, so you know exactly what your roof needs.',
    ],
  },
  {
    city: 'Beverly Hills',
    slug: 'roofing-company-beverly-hills',
    title: 'Beverly Hills Roof Repair & Replacement | Free Inspection',
    description: 'Roof repair and roof replacement in Beverly Hills, CA by Family Roofing Inc. Licensed CSLB #1116287. Book your free roof inspection: (323) 688-8088.',
    intro: [
      'Tile, slate and custom roof designs are common in Beverly Hills, and they call for careful repair work that matches the materials and look of the home.',
      'Family Roofing Inc. provides roof repair and roof replacement for Beverly Hills properties, starting with a free inspection and a detailed written estimate.',
    ],
  },
  {
    city: 'Woodland Hills',
    slug: 'roofing-company-woodland-hills',
    title: 'Woodland Hills Roof Repair & Replacement | Free Inspection',
    description: 'Roof repair and roof replacement in Woodland Hills, CA by Family Roofing Inc. Licensed CSLB #1116287. Book your free roof inspection: (323) 688-8088.',
    intro: [
      'Hot San Fernando Valley summers put heavy stress on roofing — heat and UV exposure can dry out shingles, crack sealants and shorten the life of an older roof.',
      'Family Roofing Inc. repairs and replaces roofs for Woodland Hills homeowners. Book a free roof inspection and get a clear written estimate before any work begins.',
    ],
  },
];
