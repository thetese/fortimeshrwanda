import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '../dist');
const pages = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) pages.push(full);
  }
}

walk(dist);
if (pages.length !== 15) {
  throw new Error(`Expected 15 HTML files (14 pages + 404.html), found ${pages.length}`);
}

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const is404 = path.basename(file) === '404.html';
  if (!html.includes('<main id="main">') || !html.includes('name="description"') || (!is404 && !html.includes('rel="canonical"'))) {
    throw new Error(`Missing semantic or SEO markup: ${file}`);
  }
  if (!html.includes('tel:+250793086644') || !html.includes('https://wa.me/250793086644') || !html.includes('mailto:fortimeshrwanda@gmail.com')) {
    throw new Error(`Missing verified contact channels in ${file}`);
  }
  const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ldMatch) throw new Error(`Missing JSON-LD structured data in ${file}`);
  JSON.parse(ldMatch[1]);
  for (const match of html.matchAll(/href="(\/(?!\/)[^"?#]*)"/g)) {
    const route = match[1];
    const target = route.endsWith('/') ? path.join(dist, route, 'index.html') : path.join(dist, route);
    if (!fs.existsSync(target)) throw new Error(`Broken local link ${route} in ${file}`);
  }
  for (const match of html.matchAll(/\bsrc="(\/(?!\/)[^"?#]*)"/g)) {
    const asset = match[1];
    if (!fs.existsSync(path.join(dist, asset))) throw new Error(`Missing asset ${asset} in ${file}`);
  }
  for (const match of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const part of match[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url.startsWith('/') && !fs.existsSync(path.join(dist, url))) {
        throw new Error(`Missing srcset asset ${url} in ${file}`);
      }
    }
  }
}

for (const required of ['sitemap.xml', 'robots.txt', 'favicon.ico', 'styles.css', 'app.js']) {
  if (!fs.existsSync(path.join(dist, required))) throw new Error(`Missing dist/${required}`);
}

const rebarHtml = fs.readFileSync(path.join(dist, 'products', 'reinforcement-steel', 'index.html'), 'utf8');
if (!rebarHtml.includes('data-calc="rebar"')) throw new Error('Missing rebar calculator on reinforcement-steel page');

const gabionHtml = fs.readFileSync(path.join(dist, 'products', 'gabion-mesh', 'index.html'), 'utf8');
if (!gabionHtml.includes('data-calc="gabion"')) throw new Error('Missing gabion calculator on gabion-mesh page');

const quoteHtml = fs.readFileSync(path.join(dist, 'quote', 'index.html'), 'utf8');
if (!quoteHtml.includes('id="schedule-rows"') || !quoteHtml.includes('"FAQPage"')) {
  throw new Error('Missing schedule builder or FAQPage schema on quote page');
}

const contactHtml = fs.readFileSync(path.join(dist, 'contact', 'index.html'), 'utf8');
if (!contactHtml.includes('map-card__frame') || !contactHtml.includes('"FAQPage"')) {
  throw new Error('Missing embedded map or FAQPage schema on contact page');
}

const apiQuote = path.resolve(import.meta.dirname, '../api/quote.js');
if (!fs.existsSync(apiQuote)) throw new Error('Missing Vercel serverless endpoint api/quote.js');

console.log(`Checked ${pages.length} HTML files, calculators, schedule builder, FAQ schema, map, and assets.`);
