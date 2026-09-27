// Static site generator for Family Roofing Inc. — no dependencies.
// Usage: node build.mjs            -> writes the site to ./dist
//        FORM_ENDPOINT=https://… node build.mjs  -> override the quote form endpoint
import { rmSync, mkdirSync, cpSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pages } from './src/pages.mjs';

const OUT = 'dist';

rmSync(OUT, { recursive: true, force: true });
cpSync('src/static', OUT, { recursive: true });

const built = pages();
for (const page of built) {
  const file = join(OUT, page.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page.html);
}

console.log(`Built ${built.length} page(s) into ./${OUT}`);
