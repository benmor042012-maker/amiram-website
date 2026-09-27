// Static QA for ./dist (run `npm run build` first). No dependencies.
// Checks: one <h1> per page, no skipped heading levels, title <= 60 / description <= 155 chars
// and unique, canonical = sitemap URL, every <img> has alt, internal links + #anchors resolve,
// tel:/mailto: are well-formed, JSON-LD parses, sitemap lists every indexable page, and every
// old WordPress URL (src/data/legacy-urls.mjs) is a page or 301s to a page + anchor that exists.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { SITE } from '../src/data/site.mjs';
import { LEGACY_URLS } from '../src/data/legacy-urls.mjs';

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

// Old WordPress URLs: each must be a page here or 301 (in one hop) to a page + #anchor that exists.
const rules = readFileSync(join(DIST, '_redirects'), 'utf8').split('\n')
  .filter((l) => l.trim() && !l.startsWith('#'))
  .map((l) => l.trim().split(/\s+/));
const resolveTarget = (to) => {
  if (to.includes(':')) return null; // placeholder rules (/:slug/feed/*) are not statically checkable
  const [p, hash] = to.split('#');
  if (!(p in pages)) return existsSync(join(DIST, p)) && !hash ? null : `target ${to} is not a page or file`;
  if (hash && !idsOf(pages[p]).has(hash)) return `target ${to}: missing anchor #${hash}`;
  return null;
};
for (const [from, to, status] of rules) {
  if (status !== '301') errors.push(`_redirects: ${from} is not a 301`);
  if (from in pages) errors.push(`_redirects: ${from} is redirected but is also a page (the page wins on most hosts)`);
  const problem = resolveTarget(to);
  if (problem) errors.push(`_redirects: ${from} → ${problem}`);
}
const matchRule = (url) => rules.find(([from]) => from === url || (from.endsWith('/*') && !from.includes(':') && url.startsWith(from.slice(0, -1))));
let legacyCount = 0;
for (const url of Object.values(LEGACY_URLS).flat()) {
  legacyCount++;
  if (url in pages) continue;
  if (!matchRule(url)) errors.push(`old URL ${url} is neither a page nor redirected (src/data/redirects.mjs)`);
  if (!matchRule(url.replace(/\/$/, ''))) errors.push(`old URL ${url.replace(/\/$/, '')} (no trailing slash) is not redirected`);
}

if (errors.length) { console.error(errors.join('\n')); console.error(`\n✗ ${errors.length} problem(s)`); process.exit(1); }
console.log(`✓ ${htmlFiles.length} pages OK (headings, meta, canonical, alt, links, JSON-LD, sitemap)`);
console.log(`✓ ${legacyCount} old WordPress URLs all land on a page (${rules.length} redirect rules checked)`);
