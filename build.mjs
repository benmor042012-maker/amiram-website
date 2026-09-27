// Static site generator for Family Roofing Inc. — no dependencies.
// Usage: node build.mjs            -> writes the site to ./dist
//        FORM_ENDPOINT=https://… node build.mjs  -> override the quote form endpoint
import { rmSync, mkdirSync, cpSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pages } from './src/pages.mjs';
import { SITE } from './src/data/site.mjs';

const OUT = 'dist';

rmSync(OUT, { recursive: true, force: true });
cpSync('src/static', OUT, { recursive: true });

const built = pages();
for (const page of built) {
  const file = page.path.endsWith('.html') ? join(OUT, page.path) : join(OUT, page.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page.html);
}

// sitemap.xml — indexable pages only, absolute canonical URLs.
const today = new Date().toISOString().slice(0, 10);
const urls = built
  .filter((p) => !p.noindex)
  .map((p) => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`);

writeFileSync(join(OUT, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`);

writeFileSync(join(OUT, 'site.webmanifest'), JSON.stringify({
  name: SITE.name,
  short_name: 'Family Roofing',
  start_url: '/',
  display: 'browser',
  background_color: '#ffffff',
  theme_color: '#0b1f35',
  icons: [
    { src: '/assets/img/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: '/assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
}, null, 2));

console.log(`Built ${built.length} page(s) + sitemap.xml, robots.txt into ./${OUT}`);
