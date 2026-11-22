// Renders og/og.html to public/og.jpg, the 1200×630 share image used by pages without their own.
// {{tokens}} in og.html are filled from src/config.ts (Node 22.18+ loads .ts files directly).
// Needs `playwright`, or `playwright-core` with CHROME_PATH pointing at a Chrome/Chromium binary.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { config, siteHost } from '../src/config.ts';

const require = createRequire(import.meta.url);
const { chromium } = (() => {
  try { return require('playwright'); } catch { return require('playwright-core'); }
})();

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const tokens = { name: config.name, monogram: config.monogram, host: siteHost, availability: config.availability.short };
const html = (await readFile(join(root, 'og', 'og.html'), 'utf8')).replace(/\{\{(\w+)\}\}/g, (m, k) => (k in tokens ? escape(tokens[k]) : m));
const filled = join(root, 'og', '.og.filled.html');
await writeFile(filled, html);

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto('file://' + filled, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, 'public', 'og.jpg'), type: 'jpeg', quality: 90 });
} finally {
  await browser.close();
  await rm(filled, { force: true });
}
console.log('Wrote public/og.jpg');
