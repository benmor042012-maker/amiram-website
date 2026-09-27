// Static QA for ./dist (run `npm run build` first). No dependencies.
// Checks: one <h1> per page, no skipped heading levels, title <= 60 / description <= 155 chars
// and unique, canonical = sitemap URL, every <img> has alt, internal links + #anchors resolve,
// tel:/mailto: are well-formed, JSON-LD parses, sitemap lists every indexable page.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { SITE } from '../src/data/site.mjs';

const DIST = 'dist';
const errors = [];
const warn = (file, msg) => errors.push(`${file}: ${msg}`);

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
const urlPath = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '');
const pages = Object.fromEntries(htmlFiles.map((f) => [urlPath(f), readFileSync(f, 'utf8')]));
const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const strip = (html) => html.replace(/<!--[\s\S]*?-->/g, '');
const text = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const titles = new Map(), descs = new Map();

for (const [path, raw] of Object.entries(pages)) {
  const html = strip(raw);
  const noindex = /<meta name="robots" content="noindex">/.test(html);

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) warn(path, `expected exactly 1 <h1>, found ${h1s.length}`);
  let prev = 0;
  for (const [, lvl] of html.matchAll(/<h([1-6])[\s>]/g)) {
    if (+lvl > prev + 1) warn(path, `heading level skips from h${prev} to h${lvl}`);
    prev = +lvl;
  }

  const title = text((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
  const desc = text((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  if (!title) warn(path, 'missing <title>');
  if (title.length > 60) warn(path, `title is ${title.length} chars (> 60): ${title}`);
  if (!desc) warn(path, 'missing meta description');
  if (desc.length > 155) warn(path, `description is ${desc.length} chars (> 155)`);
  if (!noindex) {
    if (titles.has(title)) warn(path, `duplicate title with ${titles.get(title)}`);
    if (descs.has(desc)) warn(path, `duplicate description with ${descs.get(desc)}`);
    titles.set(title, path); descs.set(desc, path);
    const canonical = (html.match(/<link rel="canonical" href="([^"]+)">/) || [])[1];
    if (canonical !== `${SITE.url}${path}`) warn(path, `canonical ${canonical} != ${SITE.url}${path}`);
    if (!sitemapUrls.includes(`${SITE.url}${path}`)) warn(path, 'not in sitemap.xml');
  }

  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(img)) warn(path, `<img> without alt: ${img}`);

  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    if (href === '' || href === '#') { warn(path, `empty link href="${href}"`); continue; }
    if (href.startsWith('tel:')) { if (!/^tel:\+1\d{10}$/.test(href)) warn(path, `bad tel link ${href}`); continue; }
    if (href.startsWith('mailto:')) { if (href !== `mailto:${SITE.email}`) warn(path, `unexpected mailto ${href}`); continue; }
    if (/^https?:/.test(href)) continue; // external: checked manually
    const [p, hash] = href.split('#');
    const target = p === '' ? path : p;
    if (!(target in pages)) { warn(path, `broken internal link ${href}`); continue; }
    if (hash && !idsOf(pages[target]).has(hash)) warn(path, `missing anchor #${hash} (link ${href})`);
  }
  for (const [, src] of html.matchAll(/\s(?:src|href)="(\/assets\/[^"]+|\/site\.webmanifest)"/g)) {
    if (!existsSync(join(DIST, src))) warn(path, `missing asset ${src}`);
  }

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json); } catch (e) { warn(path, `invalid JSON-LD: ${e.message}`); }
  }
}

for (const u of sitemapUrls) if (!(u.replace(SITE.url, '') in pages)) errors.push(`sitemap.xml: ${u} has no page`);

if (errors.length) { console.error(errors.join('\n')); console.error(`\n✗ ${errors.length} problem(s)`); process.exit(1); }
console.log(`✓ ${htmlFiles.length} pages OK (headings, meta, canonical, alt, links, JSON-LD, sitemap)`);
