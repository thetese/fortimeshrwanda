import fs from 'node:fs';
import path from 'node:path';

const dist=path.resolve(import.meta.dirname,'../dist');
const pages=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.name==='index.html')pages.push(full);}}
walk(dist);
if(pages.length!==14)throw new Error(`Expected 14 pages, found ${pages.length}`);
for(const file of pages){const html=fs.readFileSync(file,'utf8');if(!html.includes('<main id="main">')||!html.includes('name="description"')||!html.includes('rel="canonical"'))throw new Error(`Missing semantic or SEO markup: ${file}`);for(const match of html.matchAll(/href="(\/(?!\/)[^"?#]*)"/g)){const route=match[1];const target=route.endsWith('/')?path.join(dist,route,'index.html'):path.join(dist,route);if(!fs.existsSync(target))throw new Error(`Broken local link ${route} in ${file}`);}}
console.log(`Checked ${pages.length} pages, metadata, and local links.`);
