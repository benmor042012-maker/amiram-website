// Browser QA in headless Chromium (dev tools only; not shipped with the site).
//   npm i            (installs playwright + @axe-core/playwright dev dependencies)
//   npm run qa:browser
// Builds the site with a local test form endpoint, then checks every page for:
// axe WCAG 2.1 A/AA violations (incl. color contrast), console errors, layout shift,
// sticky bar not covering the footer, tel/mailto links, the quote form really POSTing
// multipart data (including the photo) to the endpoint, promo auto-hide after its end
// date, dynamic copyright year, skip link and mobile menu keyboard behavior.
// Set CHROME_PATH to use a specific Chromium binary.
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { SITE } from '../src/data/site.mjs';

const PORT = 8095;
const BASE = `http://localhost:${PORT}`;
const PAGES = ['/', '/faq/', '/roofing-company-santa-monica/', '/roofing-company-pasadena/', '/roofing-company-beverly-hills/', '/roofing-company-woodland-hills/', '/404.html'];
const failures = [];
const fail = (msg) => { failures.push(msg); console.log(`  ✗ ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

// 1. Build with a local endpoint so we can observe the real form POST.
execSync('node build.mjs', { stdio: 'inherit', env: { ...process.env, FORM_ENDPOINT: `${BASE}/__submit` } });

// 2. Static server + capture of form submissions.
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const submissions = [];
const server = createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/__submit') {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      submissions.push({ type: req.headers['content-type'], body: Buffer.concat(chunks).toString('latin1') });
      res.writeHead(200, { 'content-type': 'text/html' }).end('<!doctype html><title>Thanks</title><h1>Thanks</h1>');
    });
    return;
  }
  let file = join('dist', decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) { res.writeHead(404, { 'content-type': 'text/html' }).end(readFileSync('dist/404.html')); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }).end(readFileSync(file));
}).listen(PORT);

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const MOBILE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' };
const DESKTOP = { viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' };

async function open(ctxOpts, path) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
      .observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(BASE + path, { waitUntil: 'load' });
  return { ctx, page, errors };
}

try {
  for (const path of PAGES) {
    console.log(`\n${path}`);
    for (const [label, opts] of [['mobile', MOBILE], ['desktop', DESKTOP]]) {
      const { ctx, page, errors } = await open(opts, path);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      if (axe.violations.length) axe.violations.forEach((v) => fail(`${label} axe ${v.impact} ${v.id}: ${v.help} (${v.nodes.length} nodes)`));
      else ok(`${label}: 0 axe violations (WCAG 2.1 AA, incl. color contrast)`);

      await page.mouse.wheel(0, 20000); await page.waitForTimeout(300);
      const cls = await page.evaluate(() => window.__cls);
      cls < 0.1 ? ok(`${label}: CLS ${cls.toFixed(3)}`) : fail(`${label}: CLS ${cls.toFixed(3)} >= 0.1`);

      const bar = await page.locator('.mobile-cta').boundingBox();
      if (label === 'mobile') {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const copyright = await page.locator('.copyright').boundingBox();
        const barNow = await page.locator('.mobile-cta').boundingBox();
        copyright.y + copyright.height <= barNow.y ? ok('sticky bar does not cover footer content') : fail('sticky bar covers footer');
      } else {
        bar === null ? ok('sticky bar hidden on desktop') : fail('sticky bar visible on desktop');
      }
      errors.length ? errors.forEach((e) => fail(`${label} console/network: ${e}`)) : ok(`${label}: no console errors or failed requests`);
      await ctx.close();
    }
  }

  console.log('\nLinks, promo, year, keyboard');
  {
    const { ctx, page } = await open(MOBILE, '/');
    const tels = await page.$$eval('a[href^="tel:"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
    const mails = await page.$$eval('a[href^="mailto:"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
    tels.join() === `tel:${SITE.phone.tel}` ? ok(`tel links: ${tels}`) : fail(`tel links: ${tels}`);
    mails.join() === `mailto:${SITE.email}` ? ok(`mailto links: ${mails}`) : fail(`mailto links: ${mails}`);
    const year = await page.locator('[data-year]').innerText();
    year === String(new Date().getFullYear()) ? ok(`copyright year ${year}`) : fail(`copyright year ${year}`);

    await page.keyboard.press('Tab');
    (await page.evaluate(() => document.activeElement.className)) === 'skip-link' ? ok('first Tab focuses the skip link') : fail('skip link is not first');
    await page.click('.nav-toggle');
    (await page.locator('.nav-toggle').getAttribute('aria-expanded')) === 'true' && (await page.locator('#site-nav').isVisible()) ? ok('menu opens (aria-expanded=true)') : fail('menu did not open');
    await page.keyboard.press('Escape');
    (await page.locator('.nav-toggle').getAttribute('aria-expanded')) === 'false' ? ok('Escape closes menu') : fail('Escape did not close menu');
    await ctx.close();
  }
  {
    // Visitor after the promo end date: promo must disappear without a rebuild.
    const ctx = await browser.newContext(DESKTOP);
    const page = await ctx.newPage();
    const after = new Date(`${SITE.promo.endDate}T12:00:00-08:00`); after.setDate(after.getDate() + 2);
    await page.clock.setFixedTime(after);
    await page.goto(BASE + '/');
    (await page.locator('[data-promo-end]').count()) === 0 ? ok(`promo hidden on ${after.toISOString().slice(0, 10)}`) : fail('promo still visible after end date');
    await ctx.close();
  }

  console.log('\nQuote form');
  {
    const { ctx, page } = await open(MOBILE, '/');
    await page.click('#q-form button[type=submit]');
    const invalid = await page.locator('#q-form [aria-invalid="true"]').count();
    const focused = await page.evaluate(() => document.activeElement.classList.contains('form-summary'));
    invalid === 5 && focused ? ok('empty submit: 5 field errors, focus moved to error summary') : fail(`empty submit: ${invalid} errors, summary focused=${focused}`);

    await page.setInputFiles('#q-photo', { name: 'big.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(11 * 1024 * 1024) });
    await page.click('#q-form button[type=submit]');
    (await page.locator('#q-photo-error').innerText()).includes('too large') ? ok('11 MB photo rejected') : fail('large photo not rejected');

    await page.fill('#q-name', 'QA Test');
    await page.fill('#q-phone', '(323) 555-0100');
    await page.fill('#q-address', '90046');
    await page.selectOption('#q-service', 'Emergency Repair');
    await page.fill('#q-message', 'Leak over the kitchen');
    await page.setInputFiles('#q-photo', { name: 'roof.png', mimeType: 'image/png', buffer: readFileSync('dist/assets/img/apple-touch-icon.png') });
    await page.check('#q-consent');
    await Promise.all([page.waitForURL(`${BASE}/__submit`), page.click('#q-form button[type=submit]')]);
    const s = submissions.at(-1);
    const fields = ['name', 'phone', 'address', 'service', 'message', 'photo', 'consent'];
    const missing = fields.filter((f) => !s?.body.includes(`name="${f}"`));
    s && s.type.startsWith('multipart/form-data') && !missing.length && s.body.includes('filename="roof.png"')
      ? ok(`valid submit POSTed multipart/form-data to the endpoint with ${fields.join(', ')}`)
      : fail(`form POST missing fields: ${missing}`);
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
  execSync('node build.mjs', { stdio: 'ignore' }); // restore the normal build
}

console.log(failures.length ? `\n✗ ${failures.length} failure(s)` : '\n✓ Browser QA passed');
process.exit(failures.length ? 1 : 0);
