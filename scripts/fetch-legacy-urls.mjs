// Re-captures every URL of the live WordPress site from its Yoast sitemaps and rewrites
// src/data/legacy-urls.mjs. Run this right before switching DNS, then `npm run check`:
// any new old URL without a page or redirect is reported.
import { writeFileSync } from 'node:fs';

const ORIGIN = 'https://familyroofinginc.com';
const SITEMAPS = { post: 'post-sitemap.xml', page: 'page-sitemap.xml', category: 'category-sitemap.xml', tag: 'post_tag-sitemap.xml', author: 'author-sitemap.xml' };

const groups = {};
for (const [key, file] of Object.entries(SITEMAPS)) {
  const res = await fetch(`${ORIGIN}/${file}`);
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  groups[key] = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

const today = new Date().toISOString().slice(0, 10);
const body = Object.entries(groups).map(([key, urls]) => `  // ${SITEMAPS[key]}\n  ${key}: [\n${urls.map((u) => `    '${u}',`).join('\n')}\n  ],`).join('\n');
writeFileSync('src/data/legacy-urls.mjs', `// Every URL listed in the live WordPress site's sitemaps (Yoast), captured ${today} from
// ${ORIGIN}/sitemap_index.xml. \`npm run check\` verifies that each one is
// either a page of this site or redirected (src/data/redirects.mjs) to a page that exists.
// Regenerate before launch in case pages were added: node scripts/fetch-legacy-urls.mjs
export const LEGACY_URLS = {
${body}
};
`);
console.log(Object.entries(groups).map(([k, v]) => `${k}: ${v.length}`).join(', '));
