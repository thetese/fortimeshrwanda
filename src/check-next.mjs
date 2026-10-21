import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const nextApp = path.join(root, '.next', 'server', 'app');
const pub = path.join(root, 'public');

if (!fs.existsSync(nextApp)) {
  throw new Error('Missing .next/server/app — run `npm run build` first.');
}

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(nextApp);

if (htmlFiles.length < 14) {
  throw new Error(`Expected at least 14 compiled HTML pages in .next/server/app, found ${htmlFiles.length}`);
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (/AI-generated|ai-hero-kigali|ai-gabion-hills|ai-steel-yard|image-credits/i.test(html)) {
    throw new Error(`Unexpected AI or image-credits reference found in ${file}`);
  }
  if (!html.includes('<main id="main">')) {
    throw new Error(`Missing <main id="main"> in ${file}`);
  }
  if (!html.includes('tel:+250793086644') || !html.includes('https://wa.me/250793086644') || !html.includes('mailto:fortimeshrwanda@gmail.com')) {
    throw new Error(`Missing verified contact channels in ${file}`);
  }
  const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ldMatch) throw new Error(`Missing JSON-LD structured data in ${file}`);
  JSON.parse(ldMatch[1]);
}

const homeHtml = fs.readFileSync(path.join(nextApp, 'index.html'), 'utf8');
if (!homeHtml.includes('data-calc="rebar"') || !homeHtml.includes('data-calc="gabion"') || !homeHtml.includes('"FAQPage"')) {
  throw new Error('Missing calculators or FAQPage schema on Home page');
}

const rebarHtml = fs.readFileSync(path.join(nextApp, 'products', 'reinforcement-steel.html'), 'utf8');
if (!rebarHtml.includes('data-calc="rebar"')) throw new Error('Missing rebar calculator on reinforcement-steel page');

const gabionHtml = fs.readFileSync(path.join(nextApp, 'products', 'gabion-mesh.html'), 'utf8');
if (!gabionHtml.includes('data-calc="gabion"')) throw new Error('Missing gabion calculator on gabion-mesh page');

const quoteHtml = fs.readFileSync(path.join(nextApp, 'quote.html'), 'utf8');
if (!quoteHtml.includes('id="schedule-rows"') || !quoteHtml.includes('"FAQPage"')) {
  throw new Error('Missing schedule builder or FAQPage schema on quote page');
}

const contactHtml = fs.readFileSync(path.join(nextApp, 'contact.html'), 'utf8');
if (!contactHtml.includes('map-card__frame') || !contactHtml.includes('"FAQPage"')) {
  throw new Error('Missing embedded map or FAQPage schema on contact page');
}

const apiRoute = path.join(root, 'app', 'api', 'quote', 'route.js');
if (!fs.existsSync(apiRoute)) {
  throw new Error('Missing Next.js Route Handler app/api/quote/route.js');
}

const manifest = JSON.parse(fs.readFileSync(path.join(pub, 'img', 'manifest.json'), 'utf8'));
for (const [name, meta] of Object.entries(manifest)) {
  for (const w of meta.widths) {
    const rel = `img/${name}-${w}.webp`;
    if (!fs.existsSync(path.join(pub, rel))) {
      throw new Error(`Missing public/${rel}`);
    }
  }
}

for (const asset of ['favicon.ico', 'brand/favicon-32.png', 'brand/logo.png', 'brand/logo-white.png']) {
  if (!fs.existsSync(path.join(pub, asset))) {
    throw new Error(`Missing public/${asset}`);
  }
}

console.log(`Verified ${htmlFiles.length} Next.js static HTML pages, /api/quote Route Handler, calculators, schedule builder, FAQ schema, map, and public assets.`);
