import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');

/* =========================================================================
   Site configuration
   Override `SITE_ORIGIN` at build time when deploying to a custom domain:
     SITE_ORIGIN=https://fortimesh.rw npm run build
   ========================================================================= */
const site = {
  name: 'FORTIMESH AND STEELS RWANDA LTD',
  short: 'Fortimesh',
  origin: (
    process.env.SITE_ORIGIN ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    'https://fortimeshrwanda.vercel.app'
  ).replace(/\/+$/, ''),
  locality: 'Kimironko, Kigali, Rwanda',
  address: 'KG 667 Street, Kimironko, Kigali, Rwanda',
  hours: 'Confirm visit & yard collection hours by phone or WhatsApp',
  leadership: 'Mutuyimana Jean Bosco, Managing Director',
  directory: 'https://pinkbazaar.in/service/fortimesh-and-steels-rwanda-ltd-113232/',
  social: {
    instagram: 'https://www.instagram.com/fortimesh_rwanda/',
    instagramHandle: '@fortimesh_rwanda',
  },
  contact: {
    phone: '+250 793 086 644',
    whatsapp: '250793086644',
    email: 'fortimeshrwanda@gmail.com',
  },
};
const year = new Date().getFullYear();
const buildDate = new Date().toISOString().slice(0, 10);

/* =========================================================================
   Content
   ========================================================================= */
const categories = [
  { id: 'gabion-wire', name: 'Gabion & wire', blurb: 'Hexagonal gabion baskets, chain-link fencing, barbed wire and tying wire for civil works and perimeter security.' },
  { id: 'steel', name: 'Steel & reinforcement', blurb: 'Deformed high-yield rebar, BRC mesh, hollow sections, I-beams and steel pipes for concrete and structural frames.' },
  { id: 'services', name: 'Building services', blurb: 'Pressure plumbing pipework, drainage systems, electrical cables, conduits and distribution hardware.' },
  { id: 'essentials', name: 'Construction essentials', blurb: 'Waterproofing admixtures (including Sika solutions), site hardware, fasteners and general building supplies.' },
];
const catName = (id) => categories.find((c) => c.id === id).name;

const products = [
  {
    slug: 'gabion-mesh', name: 'Gabion mesh', cat: 'gabion-wire', image: 'ai-gabion-hills', gallery: ['gabion'],
    localTerms: 'FR: Cages de gabion, matelas Reno · RW: Gabiyo (uruzitiro rw’amabuye)',
    summary: 'Heavy-duty woven and welded gabion baskets and mattresses for retaining walls, slope stabilisation and erosion control.',
    description: 'We supply double-twisted hexagonal woven and welded gabion baskets and mattresses engineered for Rwanda’s hillside terrain, road corridors and riverbanks. Available in heavy galvanised and PVC-coated finishes with matching selvedge and lacing wire. Share your project drawings, box dimensions and quantity to receive a fast, itemised quotation.',
    specs: [
      ['Standard box sizes', '2m × 1m × 1m · 1.5m × 1m × 1m · 3m × 1m × 1m · 2m × 1m × 0.5m'],
      ['Mattress sizes', '3m × 2m × 0.3m · 6m × 2m × 0.3m (internal diaphragms at 1m centres)'],
      ['Mesh aperture', '60 × 80 mm · 80 × 100 mm · 100 × 120 mm double-twisted hexagonal'],
      ['Wire & coating', '2.7 mm – 3.9 mm mesh/selvedge wire; heavy zinc galvanised or grey/green PVC coated'],
    ],
    uses: ['Hillside retaining walls & terracing', 'Road embankment & culvert protection', 'Riverbank & channel erosion control', 'Architectural landscape walls'],
    request: ['Basket or mattress dimensions (L × W × H)', 'Mesh aperture (e.g. 80×100 mm) and internal diaphragms', 'Wire diameter and finish (heavy galvanised or PVC-coated)', 'Total unit count and site delivery location'],
  },
  {
    slug: 'steel-wire', name: 'Steel wire products', cat: 'gabion-wire', image: 'wire', gallery: ['ai-steel-yard'],
    localTerms: 'FR: Fil de recuit (fil d’attache), grillage, fil barbelé · RW: Umukwege, senyenge',
    summary: 'Galvanised chain-link fencing, barbed wire, binding wire and heavy-duty coils for site fixing, fencing and fabrication.',
    description: 'From soft annealed black binding wire for daily rebar tying to galvanised chain-link mesh and high-tensile barbed wire for perimeter fencing, we stock reliable wire products for contractors and fabricators across Rwanda. Tell us the gauge, coating, roll length and quantity required for immediate stock confirmation.',
    specs: [
      ['Binding / tying wire', 'Soft annealed black or galvanised wire (1.2 mm – 2.0 mm) in 20 kg – 25 kg coils'],
      ['Chain-link fencing', 'Galvanised and PVC-coated rolls; heights 1.2 m – 2.4 m; apertures 50 mm – 75 mm'],
      ['Security wire', 'Double-strand galvanised barbed wire and concertina razor wire coils'],
      ['General fabrication wire', 'Plain hard-drawn and heavy galvanised steel wire (2.0 mm – 4.0 mm)'],
    ],
    uses: ['Rebar tying and formwork fixing', 'Perimeter & estate chain-link fencing', 'Agricultural and highway boundary security', 'Gabion lacing and general steel fabrication'],
    request: ['Product type (binding wire, chain-link, barbed wire, plain coil)', 'Wire diameter / gauge and roll height or length', 'Finish: black annealed, galvanised or PVC-coated', 'Quantity in rolls, coils or metric tonnes'],
  },
  {
    slug: 'reinforcement-steel', name: 'Reinforcement materials', cat: 'steel', image: 'rebar', gallery: ['feature', 'hero-site'],
    localTerms: 'FR: Fer à béton (HA), treillis soudé BRC · RW: Ferabeto (Fer à béton)',
    summary: 'Ribbed high-yield deformed steel bars (rebar) and welded BRC mesh for structural concrete foundations, columns and slabs.',
    description: 'We supply high-yield ribbed reinforcement steel bars and welded BRC mesh sheets/rolls for residential, commercial and civil concrete construction. Send us your structural engineer’s bar bending schedule or material list—specifying bar diameters, grade and tonnage—for competitive pricing and coordinated site delivery.',
    specs: [
      ['Bar diameters', 'D8, D10, D12, D16, D20, D25 and D32 mm deformed high-yield bars'],
      ['Standard bar length', '12 m straight lengths (bundle or piece supply)'],
      ['Steel grades', 'High-yield weldable reinforcement steel (BS 4449 / Grade 500B / 460B equivalent)'],
      ['Welded reinforcement mesh', 'BRC mesh rolls and sheets (A98, A142, A193, A252, A393) + annealed tying wire'],
    ],
    uses: ['Pad, strip and raft foundations', 'Reinforced concrete columns, shear walls and beams', 'Suspended floor slabs and ground-bearing slabs', 'Bridges, culverts and retaining structures'],
    request: ['Bar schedule or itemised diameter breakdown (D8 – D32)', 'Required steel grade and standard compliance', 'BRC mesh ref numbers or sheet/roll counts if needed', 'Total tonnage or bar count and phased delivery dates'],
  },
  {
    slug: 'structural-steel', name: 'Structural steel', cat: 'steel', image: 'beam', gallery: ['ai-steel-yard'],
    localTerms: 'FR: Tube carré / rectangulaire (SHS/RHS), poutrelles IPE/HEB, cornières · RW: Ibyuma by’igisenge, tibe',
    summary: 'I-beams, H-beams, square and rectangular hollow sections (SHS/RHS), angle iron, channels and galvanised steel pipes.',
    description: 'Our structural steel range supports roof trusses, warehouse portal frames, multi-storey steel structures and custom fabrication work. We supply hot-rolled open sections alongside cold-formed hollow sections and galvanised circular pipes. Share your fabrication drawings or cutting list for a complete section-by-section quote.',
    specs: [
      ['Hollow sections (SHS / RHS)', 'Square (20×20 mm to 150×150 mm) and rectangular (40×20 mm to 200×100 mm), 1.5 mm – 6.0 mm wall'],
      ['Open sections & beams', 'Universal I-beams (IPE / UB), H-beams (HEB / UC), UPN/C-channels and Lipped Z/C purlins'],
      ['Merchant bar & plates', 'Equal angle iron (25×25 mm to 100×100 mm), flat bars and mild steel/chequered plates'],
      ['Steel pipes & tubes', 'Black and hot-dip galvanised circular steel pipes (CHS) in light, medium and heavy classes'],
    ],
    uses: ['Warehouse, factory and commercial roof trusses', 'Multi-storey structural steel frames and mezzanines', 'Canopies, staircases, gates and architectural steelwork', 'Signage gantries, towers and civil infrastructure'],
    request: ['Section profile (SHS, RHS, IPE, HEB, Angle, Channel, CHS pipe)', 'Cross-section dimensions and wall thickness (mm)', 'Steel grade (e.g. S275 / S355) and finish (mill black or galvanised)', 'Standard 6 m / 12 m lengths and quantity per profile'],
  },
  {
    slug: 'plumbing-materials', name: 'Plumbing materials', cat: 'services', image: 'pipe', gallery: [],
    localTerms: 'FR: Tuyaux PPR, PVC pression / évacuation, PEHD, vannes · RW: Amatiyo y’amazi (Plomberie)',
    summary: 'PPR, uPVC, HDPE and GI pipes, pressure fittings, valves and drainage supplies for building and civil water systems.',
    description: 'We supply durable plumbing and water-distribution materials for housing estates, commercial complexes and public infrastructure across Rwanda. Submit your plumbing bill of quantities—covering supply lines, waste drainage and control valves—so our team can price every line item accurately.',
    specs: [
      ['Hot & cold water supply', 'PPR pipes and fusion fittings (PN16 / PN20, DN20 – DN110 mm)'],
      ['Drainage & soil waste', 'uPVC soil, waste, vent and underground drainage pipes (DN32 – DN315 mm) with fittings'],
      ['Mainline & external water', 'HDPE pressure coils/bars (PN10 / PN16) and threaded galvanised iron (GI) pipes'],
      ['Flow control & ancillaries', 'Brass and cast-iron gate/ball/check valves, water meter fittings, thread sealants and clamps'],
    ],
    uses: ['Potable hot and cold water distribution', 'Foul sewer and stormwater drainage networks', 'Water storage tank manifolds and pump rooms', 'Commercial washrooms and site water reticulation'],
    request: ['Plumbing bill of quantities (BoQ) or material take-off', 'Pipe material (PPR, uPVC, HDPE, GI), nominal diameter and PN pressure rating', 'Matching elbows, tees, reducers, couplings and valves', 'Delivery site and required delivery schedule'],
  },
  {
    slug: 'electrical-supplies', name: 'Electrical supplies', cat: 'services', image: 'electric', gallery: [],
    localTerms: 'FR: Câbles électriques, gaines, tableaux, disjoncteurs · RW: Ibikoresho by’amashanyarazi',
    summary: 'Power cables, conduits, distribution boards, circuit protection and earthing hardware for building and site installations.',
    description: 'Equip residential developments, commercial buildings and construction sites with dependable electrical installation materials. We supply cables, containment conduits, distribution switchgear and earthing components matched to your electrical engineer’s schedule.',
    specs: [
      ['Wiring & power cables', 'Single-core and multi-core PVC/XLPE copper cables (1.5 mm² – 35 mm²+) and SWA armoured cables'],
      ['Cable containment', 'Heavy-duty uPVC and galvanised steel conduits (20 mm – 50 mm), surface trunking and cable trays'],
      ['Distribution & protection', 'Consumer units, 3-phase distribution boards, MCBs, MCCBs, RCDs and isolator switches'],
      ['Earthing & accessories', 'Copper-bond earth rods, earth mats, clamps, weatherproof junction boxes, switches and sockets'],
    ],
    uses: ['First-fix and second-fix building electrical wiring', 'Sub-main power distribution and switchgear panels', 'Temporary site power and exterior lighting networks', 'Lightning protection and electrical earthing systems'],
    request: ['Itemised electrical schedule or BoQ', 'Cable cross-section (mm²), core count and insulation/armouring type', 'Ratings, pole counts and preferred standards for switchgear', 'Quantities in coils, metres or units'],
  },
  {
    slug: 'general-construction', name: 'General construction materials', cat: 'essentials', image: 'blocks', gallery: [],
    localTerms: 'FR: Hydrofuge Sika, pointes, tiges filetées, coffrage · RW: Ibikoresho rusange by’ubwubatsi',
    summary: 'Waterproofing admixtures (including Sika solutions), fasteners, formwork hardware and essential site supplies.',
    description: 'Consolidate your procurement by sourcing essential construction chemicals, waterproofing admixtures and site hardware alongside your steel and gabion order. We stock trusted waterproofing products such as Sika Hydrofuge, bonding agents, fasteners and daily site consumables to keep your project moving on schedule.',
    specs: [
      ['Waterproofing & chemicals', 'Sika Hydrofuge water-repellent admixtures, mortar plasticisers, concrete curing and bonding agents'],
      ['Fasteners & fixings', 'Common wire nails, roofing nails, masonry anchors, high-tensile bolts, nuts and threaded rods'],
      ['Formwork & masonry', 'Tie rods, wing nuts, damp-proof course (DPC) membranes, polythene sheeting and brickforce mesh'],
      ['Site consumables', 'Cutting & grinding discs, welding electrodes, protective hardware and general builder’s supplies'],
    ],
    uses: ['Basement, tank and wet-area concrete waterproofing', 'Masonry, plastering and structural concrete works', 'Formwork assembly and roof carpentry fixing', 'Consolidated multi-item site procurement'],
    request: ['Consolidated material schedule or BoQ section', 'Specific brand or product grade (e.g. Sika Hydrofuge jerrycan size)', 'Quantities and packaging units (kg, litres, boxes, rolls)', 'Site location in Kigali or across Rwanda'],
  },
].map((p, i) => ({ ...p, n: String(i + 1).padStart(2, '0') }));
const bySlug = (s) => products.find((p) => p.slug === s);

const faqs = [
  {
    q: 'Can I combine multiple product families into a single quotation?',
    a: 'Yes. Use our multi-item quote builder on the Request a Quote page to select several product families (for example, deformed rebar, binding wire, gabion baskets and Sika waterproofing) and list individual line items in a single proforma request.',
  },
  {
    q: 'Do you deliver outside Kigali to other districts in Rwanda?',
    a: 'Yes. Customers can collect directly from our yard on KG 667 Street in Kimironko, Kigali, or arrange site delivery across Kigali and provincial districts (including Bugesera, Musanze, Rubavu, Huye, Rwamagana and Rusizi) based on order volume and schedule.',
  },
  {
    q: 'How do I share a full Bill of Quantities (BoQ) or bar bending schedule?',
    a: 'You can paste your schedule items into the quote builder, add individual line items, or click the WhatsApp button (+250 793 086 644) or email link (fortimeshrwanda@gmail.com) to attach PDF, Excel or CAD files directly.',
  },
  {
    q: 'Do you provide formal Proforma Invoices for company and institutional procurement?',
    a: 'Yes. Include your company or institution name and contact details in your quote request, and our Kigali sales desk will prepare an itemised quotation / proforma invoice confirming unit prices, grades and current stock availability.',
  },
];

const applications = [
  { n: '01', label: 'Civil & hillside engineering', title: 'Hold the ground.', image: 'ai-gabion-hills', products: ['gabion-mesh', 'steel-wire'],
    text: 'Rwanda’s terraced hills and road corridors demand durable slope protection. We supply heavy galvanised and PVC-coated gabion baskets, mattresses, lacing wire and perimeter chain-link fencing built to withstand heavy rainfall and earth pressure.' },
  { n: '02', label: 'Reinforced concrete & steel frames', title: 'Build the frame.', image: 'beam', products: ['reinforcement-steel', 'structural-steel'],
    text: 'From D8–D32 deformed rebar and BRC mesh in the foundation to I-beams, hollow sections and galvanised pipes in the roof structure, we deliver structural steel against your engineer’s bar schedule and cutting list.' },
  { n: '03', label: 'Mechanical & electrical services', title: 'Make it work.', image: 'pipe', products: ['plumbing-materials', 'electrical-supplies'],
    text: 'Complete your building envelope with PPR/uPVC/HDPE pipework, valves, power cables, conduits and distribution switchgear—sourced directly from your mechanical and electrical bills of quantities.' },
  { n: '04', label: 'Waterproofing & site essentials', title: 'Keep the site supplied.', image: 'blocks', products: ['general-construction'],
    text: 'Combine your primary steel delivery with Sika waterproofing chemicals, tie wire, nails, welding consumables and formwork hardware to reduce transport trips and keep crews productive.' },
];

const steps = [
  { title: 'Send your schedule', text: 'Share your bill of quantities, bar bending schedule, drawings or itemised material list via our quote tool or WhatsApp.' },
  { title: 'Receive itemised pricing', text: 'Our Kimironko sales desk verifies stock availability, technical grades and unit pricing for your exact specification.' },
  { title: 'Coordinate site delivery', text: 'Collect from our Kigali stockyard on KG 667 Street or schedule direct dispatch to your project site anywhere in Rwanda.' },
];

/* Image metadata. `kind: 'ai'` images were generated for this site and are disclosed as such. */
const photos = {
  'ai-hero-kigali': { kind: 'ai', title: 'Hillside construction, Kigali-style terrain', alt: 'A concrete building under construction on green terraced hills at sunrise, with rebar columns in the foreground' },
  'ai-gabion-hills': { kind: 'ai', title: 'Gabion retaining wall on a hillside road', alt: 'A long stone-filled gabion retaining wall following a red-earth road across terraced hills' },
  'ai-steel-yard': { kind: 'ai', title: 'Steel stockyard', alt: 'Bundles of ribbed reinforcement bar, wire coils and steel beams stored in a bright warehouse' },
  'hero-site': { kind: 'photo', title: 'Construction site', source: 'Pexels', url: 'https://www.pexels.com/photo/workers-at-a-construction-site-11580364/', alt: 'Workers spreading across a reinforcement steel mesh laid over a foundation slab' },
  gabion: { kind: 'photo', title: 'Gabion mesh close-up', source: 'Unsplash', url: 'https://unsplash.com/photos/gabion-wall-filled-with-light-colored-rocks-Cmkb8xnGmlE', alt: 'Close-up of light-coloured stones held inside a welded gabion mesh' },
  wire: { kind: 'photo', title: 'Steel wire', source: 'Unsplash', url: 'https://unsplash.com/photos/a-close-up-of-a-coil-of-wire-9y6hRUIpifY', alt: 'Close-up of a coil of steel wire' },
  rebar: { kind: 'photo', title: 'Reinforcement steel', source: 'Pexels', url: 'https://www.pexels.com/photo/gray-metal-bars-in-close-up-shot-5623179/', alt: 'Tightly stacked ribbed reinforcement bars' },
  beam: { kind: 'photo', title: 'Structural steel', source: 'Pexels', url: 'https://www.pexels.com/photo/metal-beams-in-a-construction-site-3818947/', alt: 'A structural steel frame with bolted beam connections under construction' },
  pipe: { kind: 'photo', title: 'Plumbing', source: 'Pexels', url: 'https://www.pexels.com/photo/pipes-instalation-on-building-wall-12778827/', alt: 'Plumbing pipework installed along a building wall' },
  electric: { kind: 'photo', title: 'Electrical work', source: 'Pexels', url: 'https://www.pexels.com/photo/construction-workers-installing-cables-at-train-station-36289775/', alt: 'Workers installing bundles of electrical cable from an elevated platform' },
  blocks: { kind: 'photo', title: 'General construction materials', source: 'Pexels', url: 'https://www.pexels.com/photo/concrete-construction-site-with-building-materials-36162732/', alt: 'Formwork boards and props stacked beside fresh concrete walls on a building site' },
  feature: { kind: 'photo', title: 'Reinforcement work', source: 'Pexels', url: 'https://www.pexels.com/photo/builder-standing-on-rebar-at-construction-site-19407552/', alt: 'A builder tying reinforcement steel on a concrete slab' },
};

/* =========================================================================
   Helpers
   ========================================================================= */
const manifest = JSON.parse(fs.readFileSync(path.join(src, 'img', 'manifest.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== false && v !== '').map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`)).join('');

/** Responsive <img> from the prepared WebP renditions. */
function img(name, { sizes = '100vw', cls, eager = false, alt } = {}) {
  const m = manifest[name];
  if (!m || !photos[name]) throw new Error(`Unknown image: ${name}`);
  const srcset = m.widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ');
  const fallback = `/img/${name}-${m.widths.find((w) => w >= 1000) ?? m.widths.at(-1)}.webp`;
  return `<img${attrs({
    class: cls, src: fallback, srcset, sizes, width: m.width, height: m.height,
    alt: alt ?? photos[name].alt, loading: eager ? undefined : 'lazy', fetchpriority: eager ? 'high' : undefined, decoding: 'async',
  })}>`;
}

const paths = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  up: '<path d="M7 17 17 7M8 7h9v9"/>',
  left: '<path d="M20 12H5m6-6-6 6 6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.4"/>',
  phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  chat: '<path d="M3.5 20.5l1.4-4.1a8.5 8.5 0 1 1 3.2 3.2Z"/><path d="M9.2 9.4a5.8 5.8 0 0 0 5.4 5.4l1.3-1.1a.6.6 0 0 1 .6-.1l1.6.7a.6.6 0 0 1 .3.7 2.2 2.2 0 0 1-2.2 1.7A7.9 7.9 0 0 1 8 9.2a2.2 2.2 0 0 1 1.7-2.2.6.6 0 0 1 .7.3l.7 1.6a.6.6 0 0 1-.1.6Z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
  share: '<path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
  doc: '<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7"/>',
  print: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/>',
  calc: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/>',
};
const icon = (name, cls) => `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;

/** Button with the sliding double-arrow micro-interaction. */
const btn = (href, label, variant = 'primary', ic = 'up', extra = {}) =>
  `<a class="btn btn--${variant}${extra.cls ? ` ${extra.cls}` : ''}" href="${href}"${extra.attrs ?? ''}><span>${label}</span><span class="btn__icon">${icon(ic)}${icon(ic)}</span></a>`;

/**
 * Split a headline into masked words for the reveal animation.
 * `*text*` marks an accent run; `|` forces a line break.
 */
function split(text, delayMs = 0) {
  let wi = 0;
  let accent = false;
  return text.split('|').map((line) => line.trim().split(/\s+/).map((raw) => {
    let word = raw;
    const open = word.startsWith('*');
    if (open) { accent = true; word = word.slice(1); }
    const close = word.endsWith('*');
    if (close) word = word.slice(0, -1);
    const inner = accent ? `<em>${word}</em>` : word;
    if (close) accent = false;
    return `<span class="w"><span style="--wi:${wi++}${delayMs ? `;--d:${delayMs}ms` : ''}">${inner}</span></span>`;
  }).join(' ')).join('<br>');
}

/** Words for the scroll-linked highlight paragraph. `*word*` is accented. */
const highlight = (text) => text.split(/\s+/).map((w) => {
  const accent = w.startsWith('*');
  const clean = w.replace(/\*/g, '');
  return `<span class="hw${accent || w.endsWith('*') ? ' is-accent' : ''}">${clean}</span>`;
}).join(' ');

const mesh = (cls = '') => `<div class="mesh${cls ? ` ${cls}` : ''}" aria-hidden="true"></div>`;

/* =========================================================================
   Shared layout
   ========================================================================= */
const navItems = [
  { href: '/products/', label: 'Products', key: 'products' },
  { href: '/applications/', label: 'Applications', key: 'applications' },
  { href: '/about/', label: 'About', key: 'about' },
  { href: '/contact/', label: 'Contact', key: 'contact' },
];
const current = (active, key) => (active === key ? ' aria-current="page"' : '');

const contactLinks = () => [
  site.contact.phone && `<a href="tel:${site.contact.phone.replace(/[^+\d]/g, '')}">${esc(site.contact.phone)}</a>`,
  site.contact.whatsapp && `<a href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp (${esc(site.contact.phone)})</a>`,
  site.contact.email && `<a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a>`,
  site.social?.instagram && `<a href="${site.social.instagram}" target="_blank" rel="noopener noreferrer">Instagram ${esc(site.social.instagramHandle)}</a>`,
].filter(Boolean).join('');

const header = (active) => `
<a class="skip" href="#main">Skip to content</a>
<header class="hdr" data-hdr>
  <div class="container hdr__bar">
    <a class="hdr__brand" href="/" aria-label="${site.short} — home">
      <img class="hdr__logo hdr__logo--light" src="/brand/logo-white.png" alt="" width="480" height="167">
      <img class="hdr__logo hdr__logo--dark" src="/brand/logo.png" alt="" width="480" height="167">
    </a>
    <nav class="hdr__nav" aria-label="Main">
      ${navItems.map((n) => `<a href="${n.href}"${current(active, n.key)}>${n.label}</a>`).join('')}
    </nav>
    <div class="hdr__actions">
      ${site.contact.phone ? `<a class="hdr__phone" href="tel:${site.contact.phone.replace(/[^+\d]/g, '')}" aria-label="Call ${esc(site.contact.phone)}">${icon('phone')}<span>${esc(site.contact.phone)}</span></a>` : ''}
      ${btn('/quote/', 'Request a quote', 'primary', 'up', { cls: 'btn--sm hdr__cta' })}
      <button class="hdr__toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="menu" id="menu" aria-hidden="true" inert>
  ${mesh()}
  <nav class="menu__nav" aria-label="Mobile">
    ${[{ href: '/', label: 'Home', key: 'home' }, ...navItems, { href: '/quote/', label: 'Request a quote', key: 'quote' }]
      .map((n, i) => `<a href="${n.href}" style="--i:${i}"${current(active, n.key)}><small>${String(i + 1).padStart(2, '0')}</small>${n.label}</a>`).join('')}
  </nav>
  <div class="menu__foot">
    <p>${site.name}<br>${site.address}</p>
    <div class="menu__contact">${contactLinks()}</div>
  </div>
</div>`;

const footer = `
<footer class="ftr">
  <div class="container">
    <div class="ftr__cta">
      <div>
        <p class="ftr__kicker">Have a bill of quantities or material list?</p>
        <a class="ftr__big" href="/quote/"><span>Start a quote request</span><i>${icon('up')}</i></a>
      </div>
    </div>
    <div class="ftr__grid">
      <div class="ftr__brand">
        <img src="/brand/logo-white.png" alt="${site.name}" width="480" height="167" loading="lazy">
        <p>Steel, gabion solutions and construction materials supplied from Kimironko, Kigali for the projects moving Rwanda forward.</p>
      </div>
      <nav class="ftr__col" aria-label="Company">
        <h2>Company</h2>
        <a href="/about/">About Fortimesh</a>
        <a href="/applications/">Applications</a>
        <a href="/contact/">Contact &amp; location</a>
        <a href="/quote/">Request a quote</a>
        <a href="/image-credits/">Image credits</a>
      </nav>
      <nav class="ftr__col" aria-label="Products">
        <h2>Products</h2>
        ${products.map((p) => `<a href="/products/${p.slug}/">${p.name}</a>`).join('')}
      </nav>
      <div class="ftr__col">
        <h2>Kigali sales desk</h2>
        <p>${site.address}<br><small>${site.hours}</small></p>
        ${contactLinks()}
      </div>
    </div>
    <div class="ftr__bottom">
      <span>© ${year} ${site.name}. All rights reserved.</span>
      <span>KG 667 Street, Kimironko, Kigali · <a href="/image-credits/">Image credits</a></span>
    </div>
  </div>
  <div class="ftr__word" aria-hidden="true">FORTIMESH</div>
</footer>
<a class="wa-float" href="https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Hello Fortimesh Rwanda, I would like to inquire about material availability and pricing.')}" target="_blank" rel="noopener noreferrer" aria-label="Chat with Fortimesh sales desk on WhatsApp (${esc(site.contact.phone)})">
  <span class="wa-float__icon" aria-hidden="true">${icon('chat')}<i class="wa-float__dot"></i></span>
  <span class="wa-float__text"><strong>WhatsApp Sales</strong><small>${esc(site.contact.phone)}</small></span>
</a>`;

const fonts = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Inter:wght@400..700&display=swap';

function page({ title, description, pathName, body, active = '', image = 'ai-hero-kigali', crumbs, product, includeFaq = false }) {
  const url = site.origin + pathName;
  const fullTitle = pathName === '/' ? `${site.name} | ${title}` : `${title} | ${site.short} Rwanda`;
  const imgMeta = manifest[image];
  const ogWidth = imgMeta.widths.at(-1);
  const ogHeight = Math.round((imgMeta.height * ogWidth) / imgMeta.width);
  const ogImage = `${site.origin}/img/${image}-${ogWidth}.webp`;
  const ogAlt = photos[image]?.alt || site.name;

  const orgNode = {
    '@type': ['Organization', 'HardwareStore'],
    '@id': `${site.origin}/#organization`,
    name: site.name,
    alternateName: `${site.short} Rwanda`,
    url: site.origin,
    logo: `${site.origin}/brand/logo.png`,
    image: ogImage,
    telephone: site.contact.phone.replace(/\s+/g, ''),
    email: site.contact.email,
    priceRange: '$$',
    areaServed: { '@type': 'Country', name: 'Rwanda' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'KG 667 Street, Kimironko',
      addressLocality: 'Kigali',
      addressCountry: 'RW',
    },
    sameAs: [site.social?.instagram, site.directory].filter(Boolean),
  };

  const graph = [orgNode];
  if (crumbs) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map(([name, href], i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name,
        item: site.origin + href,
      })),
    });
  }
  if (product) {
    graph.push({
      '@type': 'Product',
      name: product.name,
      alternateName: product.localTerms || undefined,
      description: product.description,
      image: ogImage,
      category: catName(product.cat),
      brand: { '@type': 'Brand', name: site.short },
      manufacturer: { '@id': `${site.origin}/#organization` },
      offers: {
        '@type': 'Offer',
        url,
        areaServed: { '@type': 'Country', name: 'Rwanda' },
        seller: { '@id': `${site.origin}/#organization` },
      },
    });
  }
  if (includeFaq) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  const schema = { '@context': 'https://schema.org', '@graph': graph };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0a1416">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/brand/favicon-32.png">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
<meta property="og:type" content="${product ? 'product' : 'website'}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:locale" content="en_RW">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="${ogWidth}">
<meta property="og:image:height" content="${ogHeight}">
<meta property="og:image:alt" content="${esc(ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<link rel="stylesheet" href="/styles.css">
<script>document.documentElement.classList.add('js')</script>
<script src="/app.js" defer></script>
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${header(active)}
<main id="main">
${body}
</main>
${footer}
</body>
</html>`;
}

/* =========================================================================
   Reusable sections
   ========================================================================= */
const crumbsNav = (items) => `<nav class="crumbs" aria-label="Breadcrumb" data-reveal="fade">${items.map(([name, href], i) => (i === items.length - 1 ? `<span aria-current="page">${name}</span>` : `<a href="${href}">${name}</a><span aria-hidden="true">/</span>`)).join('')}</nav>`;

const pageHero = ({ label, title, lead, image, crumbs, short = false, position }) => `
<section class="phero${short ? ' phero--short' : ''}">
  <div class="phero__media px" data-parallax="0.18">${img(image, { eager: true, sizes: '100vw' }).replace('<img', `<img${position ? ` style="object-position:${position}"` : ''}`)}</div>
  ${mesh()}
  <div class="container phero__inner">
    ${crumbs ? crumbsNav(crumbs) : ''}
    <p class="eyebrow eyebrow--light" data-reveal="fade">${label}</p>
    <h1 class="display phero__title" data-reveal="words">${split(title, 150)}</h1>
    ${lead ? `<p class="phero__lead" data-reveal style="--i:4">${lead}</p>` : ''}
  </div>
</section>`;

const cta = `
<section class="cta">
  <div class="cta__media px" data-parallax="0.2">${img('rebar', { alt: '', sizes: '100vw' })}</div>
  ${mesh()}
  <div class="container cta__inner">
    <p class="label label--light" data-reveal="fade">Ready to price your material schedule?</p>
    <h2 class="display-2" data-reveal="words">${split('Let’s get your project *moving.*')}</h2>
    <p data-reveal style="--i:2">Send your quantities, dimensions and delivery site to our Kimironko, Kigali sales desk—online, on WhatsApp or by phone.</p>
    <div class="cta__actions" data-reveal style="--i:3">
      ${btn('/quote/', 'Request a quote', 'light')}
      ${btn(`https://wa.me/${site.contact.whatsapp}`, 'Chat on WhatsApp', 'ghost', 'chat', { attrs: ' target="_blank" rel="noopener noreferrer"' })}
      ${btn('/products/', 'Browse products', 'ghost', 'arrow')}
    </div>
  </div>
</section>`;

const card = (p, i) => `
<a class="card" href="/products/${p.slug}/" data-cat="${p.cat}" data-reveal style="--i:${i % 3};view-transition-name:card-${p.slug}">
  <div class="card__media">${img(p.image, { sizes: '(max-width: 640px) 100vw, (max-width: 960px) 50vw, 420px' })}<span class="card__tag">${esc(catName(p.cat))}</span></div>
  <div class="card__body">
    <span class="card__n">${p.n} / ${String(products.length).padStart(2, '0')}</span>
    <h3>${p.name}</h3>
    ${p.localTerms ? `<small class="local-terms">${esc(p.localTerms)}</small>` : ''}
    <p>${p.summary}</p>
    <span class="link">Specifications &amp; quote ${icon('arrow')}</span>
  </div>
</a>`;

const stepsList = (dark = false) => `
<ol class="steps" data-reveal="steps">
  ${steps.map((s, i) => `<li class="step" style="--i:${i}"><span class="step__n">Step ${String(i + 1).padStart(2, '0')}</span><h3>${s.title}</h3><p>${s.text}</p></li>`).join('')}
</ol>`;

const productChips = (slugs) => `<div class="chips">${slugs.map((s) => `<a class="chip-link" href="/products/${s}/">${bySlug(s).name} ${icon('up')}</a>`).join('')}</div>`;

const faqSection = `
<section class="section section--white on-light faq-sec">
  <div class="container">
    <header class="sec-head">
      <div>
        <p class="label" data-reveal="fade">Contractor FAQ</p>
        <h2 class="h2" data-reveal="words">${split('Procurement &amp; *delivery questions.*')}</h2>
      </div>
      <div class="sec-head__aside" data-reveal>
        <p>Answers to common tender, billing and logistics questions for projects across Kigali and all provinces of Rwanda.</p>
      </div>
    </header>
    <div class="faq-list">
      ${faqs.map((f, i) => `
      <details class="faq-item" data-reveal style="--i:${i}"${i === 0 ? ' open' : ''}>
        <summary><span>0${i + 1}</span><strong>${esc(f.q)}</strong><i>${icon('plus')}</i></summary>
        <div class="faq-item__body"><p>${esc(f.a)}</p></div>
      </details>`).join('')}
    </div>
  </div>
</section>`;

function calculatorSection(slug) {
  if (slug === 'reinforcement-steel') {
    return `
    <div class="calc" data-calc="rebar" data-reveal>
      <div class="calc__head">
        <div>
          <p class="label">${icon('calc')} Engineer’s Estimator</p>
          <h2 class="h3">Rebar Weight &amp; Tonnage Calculator</h2>
          <p>Estimate nominal steel weight (W = d² ÷ 162.2 × L) and 12 m bar counts for your concrete schedule.</p>
        </div>
      </div>
      <div class="calc__grid">
        <label class="field">
          <span class="field__label">Bar diameter (mm)</span>
          <select data-rebar-dia>
            <option value="8">D8 (8 mm — 0.395 kg/m)</option>
            <option value="10">D10 (10 mm — 0.617 kg/m)</option>
            <option value="12" selected>D12 (12 mm — 0.888 kg/m)</option>
            <option value="16">D16 (16 mm — 1.578 kg/m)</option>
            <option value="20">D20 (20 mm — 2.466 kg/m)</option>
            <option value="25">D25 (25 mm — 3.853 kg/m)</option>
            <option value="32">D32 (32 mm — 6.313 kg/m)</option>
          </select>
        </label>
        <label class="field">
          <span class="field__label">Bar length (m)</span>
          <select data-rebar-len>
            <option value="12" selected>12 m standard stock bar</option>
            <option value="6">6 m half length</option>
          </select>
        </label>
        <label class="field">
          <span class="field__label">Number of bars</span>
          <input type="number" min="1" max="50000" value="100" data-rebar-qty>
        </label>
      </div>
      <div class="calc__out">
        <div class="calc__stat"><small>Weight per bar</small><strong data-rebar-unit>10.65 kg</strong></div>
        <div class="calc__stat"><small>Total weight</small><strong data-rebar-kg>1,065 kg</strong></div>
        <div class="calc__stat"><small>Metric tonnage</small><strong data-rebar-tonnes>1.07 t</strong></div>
        <div class="calc__stat"><small>Est. binding wire (~1.2%)</small><strong data-rebar-wire>13 kg</strong></div>
      </div>
      <div class="calc__actions">
        <a class="btn btn--primary btn--sm" data-rebar-quote href="/quote/?product=reinforcement-steel&amp;qty=100%20bars%20(1.07%20t)&amp;spec=D12%20deformed%20steel%20bars%20(12m%20length)%20%E2%80%94%20100%20bars%20(~1,065%20kg)"><span>Send calculation to Quote</span><span class="btn__icon">${icon('up')}${icon('up')}</span></a>
        <small>Nominal theoretical weights per BS 4449 / ISO 6935-2.</small>
      </div>
    </div>`;
  }
  if (slug === 'gabion-mesh') {
    return `
    <div class="calc" data-calc="gabion" data-reveal>
      <div class="calc__head">
        <div>
          <p class="label">${icon('calc')} Civil Retaining Estimator</p>
          <h2 class="h3">Gabion Basket &amp; Stone Volume Calculator</h2>
          <p>Calculate total retaining wall volume (m³), standard gabion basket count and quarry stone fill requirements.</p>
        </div>
      </div>
      <div class="calc__grid">
        <label class="field">
          <span class="field__label">Wall length (m)</span>
          <input type="number" min="1" max="2000" step="0.5" value="20" data-gab-l>
        </label>
        <label class="field">
          <span class="field__label">Wall height (m)</span>
          <input type="number" min="0.5" max="20" step="0.5" value="2" data-gab-h>
        </label>
        <label class="field">
          <span class="field__label">Wall thickness / width (m)</span>
          <input type="number" min="0.5" max="10" step="0.5" value="1" data-gab-w>
        </label>
        <label class="field">
          <span class="field__label">Basket unit size</span>
          <select data-gab-box>
            <option value="2" data-label="2m × 1m × 1m" selected>2m × 1m × 1m (2.0 m³)</option>
            <option value="1.5" data-label="1.5m × 1m × 1m">1.5m × 1m × 1m (1.5 m³)</option>
            <option value="3" data-label="3m × 1m × 1m">3m × 1m × 1m (3.0 m³)</option>
            <option value="1" data-label="2m × 1m × 0.5m">2m × 1m × 0.5m (1.0 m³)</option>
          </select>
        </label>
      </div>
      <div class="calc__out">
        <div class="calc__stat"><small>Total wall volume</small><strong data-gab-vol>40.0 m³</strong></div>
        <div class="calc__stat"><small>Gabion baskets needed</small><strong data-gab-boxes>20 boxes</strong></div>
        <div class="calc__stat"><small>Est. rock fill (+15% packing)</small><strong data-gab-stone>46.0 m³</strong></div>
      </div>
      <div class="calc__actions">
        <a class="btn btn--primary btn--sm" data-gab-quote href="/quote/?product=gabion-mesh&amp;qty=20%20gabion%20boxes%20(40%20m%C2%B3)&amp;spec=2m%20%C3%97%201m%20%C3%97%201m%20double-twisted%20woven%20gabion%20baskets%20for%2020m%20%C3%97%202m%20%C3%97%201m%20wall"><span>Send calculation to Quote</span><span class="btn__icon">${icon('up')}${icon('up')}</span></a>
        <small>Includes standard allowance for internal diaphragms and lacing wire.</small>
      </div>
    </div>`;
  }
  return '';
}

/* =========================================================================
   Pages
   ========================================================================= */
const home = `
<section class="hero">
  <div class="hero__media px" data-parallax="0.22">${img('ai-hero-kigali', { eager: true, sizes: '100vw' })}</div>
  ${mesh()}
  <div class="container hero__content">
    <p class="eyebrow eyebrow--light" data-reveal="fade">Steel · Gabions · Construction Materials — Kigali, Rwanda</p>
    <h1 class="display hero__title" data-reveal="words">${split('Strength for | *what’s next.*', 250)}</h1>
    <div class="hero__row">
      <p class="hero__lead" data-reveal style="--i:6">We supply structural and reinforcement steel, heavy-duty gabion mesh, fencing wire, plumbing, electrical and essential building materials to contractors, engineers and developers across Rwanda.</p>
      <div class="hero__ctas" data-reveal style="--i:7">
        ${btn('/products/', 'Explore our products', 'primary')}
        ${btn('/quote/', 'Request a quote', 'ghost', 'arrow')}
      </div>
    </div>
  </div>
  <nav class="container hero__rail" aria-label="Product categories" data-reveal style="--i:8">
    ${categories.map((c, i) => `<a class="hero__cat" href="/products/?category=${c.id}"><span class="hero__cat-n">0${i + 1}</span><span>${esc(c.name)}</span>${icon('up')}</a>`).join('')}
  </nav>
</section>

<section class="ticker" aria-label="Product families">
  <div class="ticker__track">
    ${[0, 1].map((k) => `<div class="ticker__group"${k ? ' aria-hidden="true"' : ''}>${products.map((p) => `<span class="ticker__item">${p.name}<img src="/brand/mark.png" alt="" width="105" height="128" loading="lazy"></span>`).join('')}</div>`).join('')}
  </div>
</section>

<section class="section intro">
  <div class="container intro__grid">
    <p class="label" data-reveal="fade"><span class="num">(01)</span> Who we are</p>
    <div>
      <p class="intro__text" data-highlight>${highlight('From our stockyard in Kimironko, Kigali, Fortimesh and Steels Rwanda supplies *steel *products, *gabion *solutions and construction materials to contractors, engineers, developers, institutions and individual builders across Rwanda.')}</p>
      <div class="stats">
        <div class="stat" data-reveal style="--i:0"><span class="stat__n" data-count="${products.length}">0${products.length}</span><span class="stat__l">Core product families stocked &amp; sourced</span></div>
        <div class="stat" data-reveal style="--i:1"><span class="stat__n" data-count="${categories.length}">0${categories.length}</span><span class="stat__l">Supply divisions, from civil groundworks to MEP services</span></div>
        <div class="stat" data-reveal style="--i:2"><span class="stat__n">KGL</span><span class="stat__l">KG 667 St, Kimironko — dispatching nationwide across Rwanda</span></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--white products">
  <div class="container">
    <header class="sec-head">
      <div>
        <p class="label" data-reveal="fade"><span class="num">(02)</span> What we supply</p>
        <h2 class="h2 on-light" data-reveal="words">${split('Materials for every *critical stage.*')}</h2>
      </div>
      <div class="sec-head__aside" data-reveal>
        <p>From hillside gabion retention and concrete reinforcement to roof steelwork and building services, explore our seven core supply families.</p>
        <a class="link" href="/products/">View full catalogue &amp; specs ${icon('arrow')}</a>
      </div>
    </header>
    <div class="bento">
      ${products.map((p, i) => `
      <a class="tile tile--${i}" href="/products/${p.slug}/" data-reveal="up" style="--i:${i % 3}">
        <div class="tile__media">${img(p.image, { sizes: i === 0 ? '(max-width: 960px) 100vw, 60vw' : i === 6 ? '100vw' : '(max-width: 640px) 100vw, (max-width: 960px) 50vw, 40vw' })}</div>
        <div class="tile__top"><span>${p.n} / 07</span><span>${esc(catName(p.cat))}</span></div>
        <div class="tile__body"><h3>${p.name}</h3><p><span>${p.summary}</span></p></div>
        <span class="tile__go">${icon('up')}</span>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="section approach">
  <div class="container approach__grid">
    <div class="approach__media">
      <figure class="approach__fig px" data-reveal="clip" data-parallax="0.1">
        ${img('feature', { sizes: '(max-width: 960px) 100vw, 50vw' })}
        <figcaption><strong>Supply<br>with purpose.</strong><small>Kigali · Rwanda</small></figcaption>
      </figure>
    </div>
    <div class="approach__copy">
      <p class="label" data-reveal="fade"><span class="num">(03)</span> The Fortimesh advantage</p>
      <h2 class="h2 on-light" data-reveal="words">${split('Focused on the materials behind *lasting work.*')}</h2>
      <p class="lead" data-reveal>We supply quality steel products, gabion mesh, fencing wire and essential building materials for residential, commercial and civil infrastructure projects across Rwanda—combining responsive pricing with dependable site logistics.</p>
      <ol class="pillars">
        <li class="pillar" data-reveal style="--i:0"><span class="pillar__n">01</span><div><h3>Complete project consolidation</h3><p>Source gabions, wire, rebar, structural steel, plumbing, electrical and Sika waterproofing solutions through a single Kigali supplier.</p></div></li>
        <li class="pillar" data-reveal style="--i:1"><span class="pillar__n">02</span><div><h3>Quotes matched to your specification</h3><p>We verify bar diameters, section wall thicknesses, wire gauges, zinc/PVC coatings and quantities directly against your BoQ or drawings.</p></div></li>
        <li class="pillar" data-reveal style="--i:2"><span class="pillar__n">03</span><div><h3>Yard collection or nationwide delivery</h3><p>Collect directly from KG 667 Street in Kimironko, Kigali, or coordinate phased truck deliveries to your project site anywhere in Rwanda.</p></div></li>
      </ol>
      <div data-reveal>${btn('/about/', 'About our company', 'dark')}</div>
    </div>
  </div>
</section>

<section class="uses" data-uses>
  ${mesh('mesh--left')}
  <div class="container uses__grid">
    <div class="uses__sticky">
      <p class="label label--light" data-reveal="fade"><span class="num">(04)</span> Where materials work</p>
      <h2 class="h2" data-reveal="words">${split('Built around *real site* needs.')}</h2>
      <div class="uses__frames">
        ${applications.map((a, i) => `<div class="uses__frame${i === 0 ? ' is-active' : ''}" data-frame="${i}">${img(a.image, { sizes: '(max-width: 960px) 100vw, 50vw', alt: '' })}</div>`).join('')}
        <p class="uses__count"><b data-uses-current>01</b> / 0${applications.length}</p>
      </div>
    </div>
    <div class="uses__list">
      ${applications.map((a, i) => `
      <article class="use${i === 0 ? ' is-active' : ''}" data-use="${i}">
        <div class="use__media">${img(a.image, { sizes: '100vw' })}</div>
        <p class="use__n">${a.n} — ${a.label}</p>
        <h3>${a.title}</h3>
        <p>${a.text}</p>
        ${productChips(a.products)}
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="section process">
  <div class="container">
    <header class="sec-head">
      <div>
        <p class="label" data-reveal="fade"><span class="num">(05)</span> How ordering works</p>
        <h2 class="h2 on-light" data-reveal="words">${split('From schedule to *site delivery.*')}</h2>
      </div>
      <div class="sec-head__aside" data-reveal>
        <p>A clear specification is the fastest route to an accurate quotation. Three straightforward steps get materials moving to your site.</p>
        <a class="link" href="/quote/">Start your request ${icon('arrow')}</a>
      </div>
    </header>
    ${stepsList()}
  </div>
</section>
${cta}`;

const catalog = `
${pageHero({ label: 'Product catalogue', title: 'Materials with a *job to do.*', image: 'ai-steel-yard', crumbs: [['Home', '/'], ['Products', '/products/']], lead: 'Explore our seven core supply families. Select any product family for standard dimensions, grades and a direct quotation.' })}
<section class="section">
  <div class="container">
    <div class="filters__bar">
      <div class="filters" role="group" aria-label="Filter products by category">
        <button class="chip is-active" type="button" data-filter="all" aria-pressed="true">All <sup>0${products.length}</sup></button>
        ${categories.map((c) => `<button class="chip" type="button" data-filter="${c.id}" aria-pressed="false">${esc(c.name)} <sup>0${products.filter((p) => p.cat === c.id).length}</sup></button>`).join('')}
      </div>
      <div class="filters__right">
        <p class="filters__status" aria-live="polite" data-filter-status>Showing ${products.length} product families</p>
        <button class="chip chip--print" type="button" data-print>${icon('print')} Print / Save PDF catalogue</button>
      </div>
    </div>
    <div class="cards" data-catalog>${products.map(card).join('')}</div>
    <p class="note">We supply both standard stocked sizes and project-specific orders across Rwanda. Contact our Kimironko sales desk on <a href="tel:${site.contact.phone.replace(/[^+\d]/g, '')}">${esc(site.contact.phone)}</a> to confirm current batch availability and delivery lead times.</p>
  </div>
</section>
${cta}`;

function productPage(p, i) {
  const prev = products[(i - 1 + products.length) % products.length];
  const next = products[(i + 1) % products.length];
  const related = products.filter((x) => x.slug !== p.slug).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat)).slice(0, 3);
  const waHref = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(`Hello Fortimesh, I would like to request pricing and availability for ${p.name}.`)}`;
  return `
<section class="pd-hero">
  ${mesh('mesh--left')}
  <div class="container pd-hero__grid">
    <div class="pd-hero__copy">
      ${crumbsNav([['Home', '/'], ['Products', '/products/'], [p.name, `/products/${p.slug}/`]])}
      <p class="eyebrow eyebrow--light" data-reveal="fade">${esc(catName(p.cat))} — ${p.n} / 07</p>
      <h1 class="display-2" data-reveal="words">${split(p.name, 120)}</h1>
      ${p.localTerms ? `<p class="pd-hero__local" data-reveal style="--i:2"><span>FR / RW trade terms:</span> ${esc(p.localTerms)}</p>` : ''}
      <p class="pd-hero__lead" data-reveal style="--i:3">${p.summary}</p>
      <div class="pd-hero__actions" data-reveal style="--i:4">
        ${btn(`/quote/?product=${p.slug}`, 'Request a quote', 'primary')}
        ${btn(waHref, 'WhatsApp inquiry', 'ghost', 'chat', { attrs: ' target="_blank" rel="noopener noreferrer"' })}
        <button class="btn btn--ghost btn--sm" type="button" data-print><span>Print spec sheet</span><span class="btn__icon">${icon('print')}${icon('print')}</span></button>
      </div>
      <ul class="pd-hero__tags" data-reveal style="--i:5" aria-label="Common applications">${p.uses.map((u) => `<li>${u}</li>`).join('')}</ul>
    </div>
    <figure class="pd-hero__media" data-reveal="clip">
      ${img(p.image, { eager: true, sizes: '(max-width: 960px) 100vw, 50vw' })}
      <figcaption>${esc(catName(p.cat))} · Fortimesh Rwanda</figcaption>
    </figure>
  </div>
</section>

<section class="section section--white on-light">
  <div class="container">
    <div class="pd-body__grid">
      <div class="pd-overview">
        <p class="label" data-reveal="fade">Overview</p>
        <p class="lead-lg" data-reveal>${p.description}</p>
        <h2 class="h3" data-reveal>Typical specifications &amp; options</h2>
        <dl class="spec-grid" data-reveal>${p.specs.map(([k, v]) => `<div class="spec-card"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <p class="note" data-reveal>Specifications above reflect typical industry sizes and options in this category. Contact our Kigali desk to confirm current stock and exact grades for your order.</p>
        ${calculatorSection(p.slug)}
        <h2 class="h3" data-reveal>Common applications</h2>
        <ul class="num-list">${p.uses.map((u, k) => `<li data-reveal style="--i:${k}"><span>0${k + 1}</span><strong>${u}</strong></li>`).join('')}</ul>
      </div>
      <aside class="panel" data-reveal>
        ${mesh()}
        <p class="label label--light">For an accurate quote</p>
        <h2 class="h3">What to include</h2>
        <ul class="checks">${p.request.map((r) => `<li>${icon('check')}<span>${r}</span></li>`).join('')}</ul>
        ${btn(`/quote/?product=${p.slug}`, `Prepare a quote`, 'primary', 'up', { cls: 'btn--block' })}
        ${btn(waHref, `Ask on WhatsApp`, 'ghost', 'chat', { cls: 'btn--block', attrs: ' target="_blank" rel="noopener noreferrer"' })}
        <small>Direct sales desk: ${esc(site.contact.phone)} · ${esc(site.locality)}</small>
      </aside>
    </div>
    ${p.gallery.length ? `<div class="gallery">${p.gallery.map((g, k) => `<figure class="px" data-reveal="clip" data-parallax="0.08" style="--i:${k}">${img(g, { sizes: '(max-width: 640px) 100vw, 50vw' })}</figure>`).join('')}</div>` : ''}
  </div>
</section>

<nav class="pd-nav" aria-label="More products">
  <a href="/products/${prev.slug}/"><small>← Previous</small><strong>${prev.name}</strong></a>
  <a href="/products/${next.slug}/"><small>Next →</small><strong>${next.name}</strong></a>
</nav>

<section class="section">
  <div class="container">
    <header class="sec-head">
      <div>
        <p class="label" data-reveal="fade">Keep exploring</p>
        <h2 class="h2 on-light" data-reveal="words">${split('Related *materials.*')}</h2>
      </div>
      <a class="link" href="/products/" data-reveal>View all products ${icon('arrow')}</a>
    </header>
    <div class="cards">${related.map(card).join('')}</div>
  </div>
</section>
${cta}`;
}

const about = `
${pageHero({ label: 'About Fortimesh', title: 'Strength that *secures your future.*', image: 'beam', crumbs: [['Home', '/'], ['About', '/about/']], lead: 'Based in Kimironko, Kigali, we supply steel, gabion solutions and essential construction materials for projects shaping communities across Rwanda.' })}
<section class="section">
  <div class="container split">
    <div>
      <p class="label" data-reveal="fade">Our company</p>
      <h2 class="h2 on-light" data-reveal="words">${split('Reliable materials. | *Practical service.*')}</h2>
    </div>
    <div class="prose" data-reveal>
      <p><strong>FORTIMESH AND STEELS RWANDA LTD</strong> is a Kigali-based construction materials and steel supplier located at KG 667 Street, Kimironko. We partner with civil and building contractors, structural engineers, real estate developers, public institutions and private homebuilders across Rwanda.</p>
      <p>Our core strength lies in bridging heavy civil and structural steel requirements—such as double-twisted gabion baskets, chain-link fencing, deformed reinforcement bars and structural hollow/open sections—with everyday building services and waterproofing supplies like Sika Hydrofuge.</p>
      <p>Whether your procurement starts from an engineer’s bar bending schedule, a tender bill of quantities or an urgent site requisition, our sales team provides clear specifications, competitive unit pricing and dependable delivery coordination.</p>
      <div class="prose__actions">
        <a class="link" href="/products/">Explore our product range ${icon('arrow')}</a>
        <button class="chip chip--print" type="button" data-print>${icon('print')} Print / Save Company Profile (PDF)</button>
      </div>
    </div>
  </div>
</section>
<section class="section section--white on-light">
  <div class="container">
    <header class="sec-head">
      <div>
        <p class="label" data-reveal="fade">What we supply</p>
        <h2 class="h2" data-reveal="words">${split('Four divisions. | *Seven* product families.')}</h2>
      </div>
    </header>
    <div class="cats">
      ${categories.map((c, i) => `
      <article class="cat" data-reveal style="--i:${i}">
        <span class="cat__n">0${i + 1}</span>
        <h3>${esc(c.name)}</h3>
        <p>${c.blurb}</p>
        <ul>${products.filter((p) => p.cat === c.id).map((p) => `<li><a href="/products/${p.slug}/">${p.name}${icon('up')}</a></li>`).join('')}</ul>
      </article>`).join('')}
    </div>
  </div>
</section>
<section class="section section--dark" style="position:relative;overflow:hidden">
  ${mesh()}
  <div class="container" style="position:relative;z-index:2">
    <header class="sec-head">
      <div>
        <p class="label label--light" data-reveal="fade">How we work with you</p>
        <h2 class="h2" data-reveal="words">${split('From schedule to *site delivery.*')}</h2>
      </div>
    </header>
    ${stepsList(true)}
  </div>
</section>
${cta}`;

const applicationsPage = `
${pageHero({ label: 'Applications', title: 'For the places *taking shape.*', image: 'hero-site', crumbs: [['Home', '/'], ['Applications', '/applications/']], lead: 'From hillside retaining walls and road embankments to multi-storey concrete frames and MEP installations, see how our product families work together on site.' })}
<section class="section on-light">
  <div class="container">
    ${applications.map((a, i) => `
    <article class="app-row">
      <figure class="app-row__media px" data-reveal="clip" data-parallax="0.1">${img(a.image, { sizes: '(max-width: 960px) 100vw, 50vw' })}</figure>
      <div class="app-row__copy">
        <p class="label" data-reveal="fade">${a.n} — ${a.label}</p>
        <h2 class="h2" data-reveal="words">${split(a.title)}</h2>
        <p data-reveal>${a.text}</p>
        <div data-reveal style="--i:1">${productChips(a.products)}</div>
      </div>
    </article>`).join('')}
  </div>
</section>
${cta}`;

const infoRow = (ic, label, value, note, href) => {
  const inner = `<span class="info__icon">${icon(ic)}</span><div><small>${label}</small><strong>${value}</strong>${note ? `<p>${note}</p>` : ''}</div>${href ? icon('up') : ''}`;
  return href ? `<a class="info__row" href="${href}"${href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${inner}</a>` : `<div class="info__row">${inner}</div>`;
};

const contact = `
${pageHero({ label: 'Contact', title: 'Start the *conversation.*', image: 'ai-hero-kigali', position: '20% 50%', short: true, crumbs: [['Home', '/'], ['Contact', '/contact/']], lead: 'Reach our Kimironko, Kigali sales desk directly by phone, WhatsApp or email—or prepare a structured material request online.' })}
<section class="section on-light">
  <div class="container contact-grid">
    <div>
      <p class="label" data-reveal="fade">Kigali office &amp; yard</p>
      <h2 class="h2" data-reveal="words">${split('Based in Kimironko. | *Serving Rwanda.*')}</h2>
      <p class="lead" data-reveal>Call, message us on WhatsApp or visit our office on KG 667 Street in Kimironko, Kigali to discuss stock availability, technical specifications and site delivery across Rwanda.</p>
      <div class="info" data-reveal style="--i:1">
        ${infoRow('pin', 'Address', site.address, 'Kimironko sector, Gasabo District, Kigali', 'https://www.google.com/maps/search/?api=1&query=KG+667+St+Kimironko+Kigali+Rwanda')}
        ${infoRow('phone', 'Phone', esc(site.contact.phone), 'Direct sales & stock inquiries', `tel:${site.contact.phone.replace(/[^+\d]/g, '')}`)}
        ${infoRow('chat', 'WhatsApp', esc(site.contact.phone), 'Fastest for sharing BoQs, photos & bar schedules', `https://wa.me/${site.contact.whatsapp}`)}
        ${infoRow('mail', 'Email', esc(site.contact.email), 'Official quotations & tender documentation', `mailto:${site.contact.email}`)}
        ${infoRow('clock', 'Business hours', site.hours, 'Yard collections & dispatches by arrangement')}
        ${site.social?.instagram ? infoRow('instagram', 'Instagram', esc(site.social.instagramHandle), 'Product updates & stock arrivals', site.social.instagram) : ''}
      </div>
      <div class="map-card" data-reveal style="--i:2">
        <div class="map-card__head">
          <div>
            <p class="label">Location &amp; yard directions</p>
            <h3 class="h3">KG 667 Street, Kimironko — Kigali</h3>
            <p>Easy flatbed and truck access in Kimironko Sector, Gasabo District.</p>
          </div>
          ${btn('https://www.google.com/maps/search/?api=1&query=KG+667+St+Kimironko+Kigali+Rwanda', 'Open in Google Maps', 'dark', 'up', { cls: 'btn--sm', attrs: ' target="_blank" rel="noopener noreferrer"' })}
        </div>
        <div class="map-card__frame">
          <iframe title="Map showing Kimironko, Kigali — Fortimesh and Steels Rwanda Ltd" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.openstreetmap.org/export/embed.html?bbox=30.1140%2C-1.9560%2C30.1420%2C-1.9360&amp;layer=mapnik&amp;marker=-1.9460%2C30.1280"></iframe>
        </div>
      </div>
    </div>
    <aside class="panel" data-reveal style="--i:1">
      ${mesh()}
      <p class="label label--light">Have a material list?</p>
      <h2 class="h3">Get a fast, itemised quote.</h2>
      <ul class="checks">
        <li>${icon('check')}<span>Required products, sizes, gauges or steel grades</span></li>
        <li>${icon('check')}<span>Quantities in tonnes, bars, rolls, coils or units</span></li>
        <li>${icon('check')}<span>Site delivery location and target schedule</span></li>
      </ul>
      ${btn('/quote/', 'Open quote composer', 'primary', 'up', { cls: 'btn--block' })}
      ${btn(`https://wa.me/${site.contact.whatsapp}`, 'Message on WhatsApp', 'ghost', 'chat', { cls: 'btn--block', attrs: ' target="_blank" rel="noopener noreferrer"' })}
      <small>We respond promptly to contractor and project inquiries across Rwanda.</small>
    </aside>
  </div>
</section>
${faqSection}
${cta}`;

const quote = `
${pageHero({ label: 'Request a quote', title: 'Tell us what the *job needs.*', image: 'wire', short: true, crumbs: [['Home', '/'], ['Request a quote', '/quote/']], lead: 'Build a structured multi-item material schedule and send it straight to our Kigali sales team via online dispatch, WhatsApp or email.' })}
<section class="section on-light">
  <div class="container quote-grid">
    <div>
      <form id="quote-form" class="qform" action="https://formsubmit.co/${esc(site.contact.email)}" method="POST" novalidate data-reveal>
        <input type="hidden" name="_subject" value="New Fortimesh Material Quote Request">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="false">
        <noscript><p class="note">JavaScript is disabled—submitting this form will send your request directly to ${esc(site.contact.email)}, or you can call/WhatsApp us on ${esc(site.contact.phone)}.</p></noscript>
        <div class="qform__sec">
          <div class="qform__head"><span>01</span><h2>Materials &amp; schedule</h2></div>
          <fieldset class="pick">
            <legend>Select product families (choose one or more) <span class="req">*</span></legend>
            <div class="pick__grid">
              ${products.map((p) => `<label class="pick__item"><input type="checkbox" name="product" value="${p.slug}"><span class="pick__img">${img(p.image, { sizes: '180px', alt: '' })}</span><span class="pick__name">${p.name}</span><span class="pick__check">${icon('check')}</span></label>`).join('')}
            </div>
          </fieldset>
          <div class="sched" data-sched>
            <div class="sched__head">
              <div>
                <strong>Itemised Material Schedule (optional BoQ builder)</strong>
                <small>Add specific sizes and quantities for each line item in your order.</small>
              </div>
              <button class="chip chip--add" type="button" id="add-line-item">${icon('plus')} Add line item</button>
            </div>
            <div class="sched__rows" id="schedule-rows">
              <div class="sched__row" data-sched-row>
                <select name="item_family" aria-label="Product family">
                  ${products.map((p) => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join('')}
                </select>
                <input name="item_spec" placeholder="Size / grade (e.g. D12 12m, 2×1×1m box)" aria-label="Item specification" maxlength="140">
                <input name="item_qty" placeholder="Qty (e.g. 120 bars)" aria-label="Item quantity" maxlength="80">
                <button class="sched__del" type="button" data-remove-row aria-label="Remove line item" title="Remove line item">${icon('trash')}</button>
              </div>
            </div>
          </div>
          <div class="fields">
            <label class="field"><span class="field__label">Total quantity / summary <span class="req">*</span></span><input name="quantity" placeholder="e.g. 50 gabion boxes + 4 tonnes D12 rebar" required maxlength="140"></label>
            <label class="field"><span class="field__label">When do you need it?</span><input name="timeline" placeholder="e.g. Immediate / Next week / Phased delivery" maxlength="100"></label>
            <label class="field field--full"><span class="field__label">Sizes, grade, specifications or additional BoQ notes <span class="req">*</span></span><textarea name="specification" rows="5" placeholder="Include dimensions (e.g. 2m×1m×1m gabions, D12/D16 rebar, SHS 50×50×3mm), coatings, standards or additional items from your BoQ" required maxlength="1500"></textarea></label>
          </div>
        </div>
        <div class="qform__sec">
          <div class="qform__head"><span>02</span><h2>Project &amp; delivery</h2></div>
          <div class="fields">
            <label class="field field--full"><span class="field__label">Site location or collection preference <span class="req">*</span></span><input name="location" placeholder="e.g. Nyarutarama site delivery, Bugesera, Musanze, or Yard collection in Kimironko" required maxlength="150"></label>
          </div>
        </div>
        <div class="qform__sec">
          <div class="qform__head"><span>03</span><h2>Your details</h2></div>
          <div class="fields">
            <label class="field"><span class="field__label">Your name &amp; company <span class="req">*</span></span><input name="name" autocomplete="name" placeholder="Name / Contractor or company" required maxlength="100"></label>
            <label class="field"><span class="field__label">Phone / WhatsApp or email <span class="req">*</span></span><input name="contact" autocomplete="email" placeholder="+250 7XX XXX XXX or email" required maxlength="150"></label>
          </div>
        </div>
        <div class="qform__submit">
          <button class="btn btn--primary" type="submit"><span>Prepare &amp; send request</span><span class="btn__icon">${icon('arrow')}${icon('arrow')}</span></button>
          <p>Generates your formatted quote reference so you can submit online or send directly via WhatsApp (${esc(site.contact.phone)}) or email.</p>
        </div>
      </form>
      <section id="quote-result" class="result" hidden tabindex="-1" aria-live="polite" aria-labelledby="result-title">
        ${mesh()}
        <p class="label label--light">Quote reference ready</p>
        <h2 class="h3" id="result-title">Send to Fortimesh sales desk.</h2>
        <p>Choose your preferred channel below—WhatsApp is fastest for immediate stock and pricing confirmation, or click <strong>Submit online</strong> to deliver directly to our sales inbox.</p>
        <pre id="quote-message"></pre>
        <div class="result__actions">
          <a id="whatsapp-request" class="btn btn--primary" data-number="${site.contact.whatsapp}" href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener noreferrer"><span>Send on WhatsApp</span><span class="btn__icon">${icon('chat')}${icon('chat')}</span></a>
          <button id="online-request" class="btn btn--light" type="button" data-api="/api/quote" data-endpoint="https://formsubmit.co/ajax/${esc(site.contact.email)}"><span>Submit online</span><span class="btn__icon">${icon('send')}${icon('send')}</span></button>
          <a id="email-request" class="btn btn--ghost" data-email="${site.contact.email}" href="mailto:${site.contact.email}"><span>Open in email app</span><span class="btn__icon">${icon('mail')}${icon('mail')}</span></a>
          <button id="copy-request" class="btn btn--ghost" type="button"><span>Copy text</span><span class="btn__icon">${icon('copy')}${icon('copy')}</span></button>
          <button id="share-request" class="btn btn--ghost" type="button"><span>Share</span><span class="btn__icon">${icon('share')}${icon('share')}</span></button>
        </div>
        <p id="copy-status" class="result__status" role="status"></p>
      </section>
    </div>
    <aside class="qaside">
      <div class="panel" data-reveal style="--i:1">
        ${mesh()}
        <p class="label label--light">Your progress</p>
        <ol class="progress">
          <li data-progress="material"><i><b>1</b>${icon('check')}</i>Material details</li>
          <li data-progress="project"><i><b>2</b>${icon('check')}</i>Project location</li>
          <li data-progress="contact"><i><b>3</b>${icon('check')}</i>Your details</li>
        </ol>
        <div class="panel__direct">
          <small>Prefer to talk right now?</small>
          <a href="tel:${site.contact.phone.replace(/[^+\d]/g, '')}">${icon('phone')}<span>${esc(site.contact.phone)}</span></a>
          <a href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener noreferrer">${icon('chat')}<span>WhatsApp sales desk</span></a>
        </div>
      </div>
      <div class="tip" data-reveal style="--i:2">
        <h3>Useful details to include</h3>
        <ul class="checks">
          <li>${icon('check')}<span>Product families and intended structural/civil use</span></li>
          <li>${icon('check')}<span>Dimensions, bar diameter, wall thickness or coating</span></li>
          <li>${icon('check')}<span>Quantity in tonnes, bars, rolls, boxes or units</span></li>
          <li>${icon('check')}<span>Site delivery district or Kimironko yard pickup</span></li>
        </ul>
      </div>
    </aside>
  </div>
</section>
${faqSection}`;

const credits = `
${pageHero({ label: 'Image credits', title: 'Imagery with *context.*', image: 'gabion', short: true, crumbs: [['Home', '/'], ['Image credits', '/image-credits/']], lead: 'Images on this site show representative construction materials and work. They do not depict verified Fortimesh stock, staff, facilities or completed projects.' })}
<section class="section on-light">
  <div class="container">
    <div class="credits">
      ${Object.entries(photos).map(([name, ph], i) => `
      <article class="credit" data-reveal style="--i:${i % 3}">
        <figure>${img(name, { sizes: '(max-width: 640px) 100vw, 400px', alt: '' })}</figure>
        <div class="credit__body">
          <span class="credit__kind">${ph.kind === 'ai' ? 'AI-generated illustration' : 'Representative photograph'}</span>
          <h3>${ph.title}</h3>
          <p>${ph.kind === 'ai' ? 'Created for this site. Does not depict a real Fortimesh site, product, stock or project.' : `Source: <a href="${ph.url}" target="_blank" rel="noopener noreferrer">${ph.source}</a>`}</p>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`;

const notFound = `
<section class="phero nf">
  <div class="phero__media px" data-parallax="0.18">${img('beam', { eager: true, alt: '' })}</div>
  ${mesh()}
  <div class="container phero__inner">
    <p class="eyebrow eyebrow--light" data-reveal="fade">Page not found</p>
    <h1 class="display phero__title" data-reveal="words">${split('4*0*4')}</h1>
    <p class="phero__lead" data-reveal style="--i:3">This page isn’t part of the structure. Explore our product range or reach our Kigali team directly.</p>
    <div class="hero__ctas" data-reveal style="--i:4" style="margin-top:36px">
      ${btn('/', 'Back to home', 'primary', 'arrow')}
      ${btn('/products/', 'Browse products', 'ghost', 'arrow')}
    </div>
  </div>
</section>`;

/* =========================================================================
   Write output
   ========================================================================= */
function write(route, html) {
  const dir = path.join(dist, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const routes = [];
const add = (route, opts) => { routes.push(opts.pathName); write(route, page(opts)); };

add('', { title: 'Steel, Gabion Mesh & Construction Materials in Kigali, Rwanda', description: 'Fortimesh and Steels Rwanda Ltd supplies gabion baskets, chain-link fencing, deformed rebar, structural steel, plumbing, electrical and Sika construction materials from Kimironko, Kigali.', pathName: '/', body: home, active: 'home' });
add('products', { title: 'Products & Specifications', description: 'Explore Fortimesh product families and specifications: gabion mesh, steel wire, reinforcement rebar, structural steel, plumbing, electrical and construction materials in Rwanda.', pathName: '/products/', body: catalog, active: 'products', image: 'ai-steel-yard', crumbs: [['Home', '/'], ['Products', '/products/']] });
products.forEach((p, i) => add(`products/${p.slug}`, { title: p.name, description: `${p.summary} Call or WhatsApp ${site.contact.phone} for stock and delivery from Fortimesh in Kigali, Rwanda.`, pathName: `/products/${p.slug}/`, body: productPage(p, i), active: 'products', image: p.image, crumbs: [['Home', '/'], ['Products', '/products/'], [p.name, `/products/${p.slug}/`]], product: p }));
add('about', { title: 'About Fortimesh', description: 'Learn about Fortimesh and Steels Rwanda Ltd, located at KG 667 Street, Kimironko, Kigali—supplying steel, gabion solutions and construction materials nationwide.', pathName: '/about/', body: about, active: 'about', image: 'beam', crumbs: [['Home', '/'], ['About', '/about/']] });
add('applications', { title: 'Applications', description: 'Explore civil, structural and MEP applications for Fortimesh gabion baskets, rebar, hollow sections, plumbing and electrical supplies across Rwanda.', pathName: '/applications/', body: applicationsPage, active: 'applications', image: 'hero-site', crumbs: [['Home', '/'], ['Applications', '/applications/']] });
add('contact', { title: 'Contact & Kigali Location', description: `Contact Fortimesh and Steels Rwanda Ltd at KG 667 Street, Kimironko, Kigali. Call or WhatsApp ${site.contact.phone} or email ${site.contact.email}.`, pathName: '/contact/', body: contact, active: 'contact', crumbs: [['Home', '/'], ['Contact', '/contact/']], includeFaq: true });
add('quote', { title: 'Request a Quote', description: `Request an itemised quotation for gabion mesh, rebar, structural steel and building materials from Fortimesh in Kigali (${site.contact.phone}).`, pathName: '/quote/', body: quote, active: 'quote', image: 'wire', crumbs: [['Home', '/'], ['Request a quote', '/quote/']], includeFaq: true });
add('image-credits', { title: 'Image Credits', description: 'Sources and disclosures for the imagery used on the Fortimesh website.', pathName: '/image-credits/', body: credits, image: 'gabion', crumbs: [['Home', '/'], ['Image credits', '/image-credits/']] });
fs.writeFileSync(path.join(dist, '404.html'), page({ title: 'Page not found', description: 'The page you were looking for could not be found.', pathName: '/404.html', body: notFound, image: 'beam' }).replace('<link rel="canonical" href="' + site.origin + '/404.html">', '<meta name="robots" content="noindex">'));

const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`;
fs.writeFileSync(path.join(src, 'robots.txt'), robotsTxt);
for (const file of ['styles.css', 'app.js', 'robots.txt', 'favicon.ico']) fs.copyFileSync(path.join(src, file), path.join(dist, file));
for (const dir of ['brand', 'img']) fs.cpSync(path.join(src, dir), path.join(dist, dir), { recursive: true });
fs.rmSync(path.join(dist, 'img', 'manifest.json'));

fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${site.origin}${r}</loc><lastmod>${buildDate}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${routes.length} pages (+404) to ${dist}`);
