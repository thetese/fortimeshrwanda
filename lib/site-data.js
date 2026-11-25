import manifest from '../public/img/manifest.json';

export const site = {
  name: 'FORTIMESH AND STEELS RWANDA LTD',
  short: 'Fortimesh',
  origin: (
    process.env.SITE_ORIGIN ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    'https://fortimeshrwanda.vercel.app'
  ).replace(/\/+$/, ''),
  locality: 'Gisozi, Kigali, Rwanda',
  address: 'KG 667 Street, Gisozi, Kigali, Rwanda',
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

export const year = new Date().getFullYear();

export const categories = [
  { id: 'hollow-sections', name: 'Hollow sections', blurb: 'Square hollow sections (SHS), rectangular hollow sections (RHS) and round hollow sections (CHS) in all standard gauges and 6 m lengths.' },
  { id: 'steel', name: 'Beams, channels & plates', blurb: 'Hot-rolled I-beams, H-beams, U-channels, steel C-channels, angle bars, flat mild steel plates and anti-slip chequered plates.' },
  { id: 'reinforcement', name: 'Concrete reinforcement', blurb: 'Deformed high-yield rebar (D8–D32), prefabricated reinforcement column cages, welded BRC mesh and annealed binding wire.' },
  { id: 'fencing-essentials', name: 'Fencing, pipes & essentials', blurb: 'Galvanised & green chain-link wire mesh, barbed/razor wire, GI steel pipes, manhole covers, expanded metal lathing and Sika Hydrofuge HW.' },
];

export const catName = (id) => categories.find((c) => c.id === id)?.name || '';

export const products = [
  {
    slug: 'hollow-sections', name: 'Hollow sections (Square, Rectangular & Round)', cat: 'hollow-sections', image: 'feature', gallery: ['hero-kigali', 'pipe'],
    localTerms: 'Square · Rectangle · Round Hollow Section (SHS / RHS / CHS) · FR: Tubes carrés, rectangulaires & ronds · RW: Tibe',
    summary: 'Square hollow sections (SHS), rectangular hollow sections (RHS) and round hollow sections (CHS) for roof trusses, frames, gates and fabrication.',
    description: 'We stock clean, straight, high-strength Square Hollow Sections (SHS), Rectangular Hollow Sections (RHS) and Round Hollow Sections (CHS) for roof trusses, structural frames, columns, gates, handrails and general steel fabrication across Rwanda. Available in light, medium and heavy wall thicknesses in standard 6 m stock lengths.',
    specs: [
      ['Square Hollow Section (SHS)', '20×20 mm, 25×25 mm, 30×30 mm, 40×40 mm, 50×50 mm, 60×60 mm, 75×75 mm, 100×100 mm to 150×150 mm (1.2 mm – 6.0 mm wall)'],
      ['Rectangle Hollow Section (RHS)', '40×20 mm, 50×25 mm, 60×40 mm, 80×40 mm, 100×50 mm, 120×60 mm to 200×100 mm (1.5 mm – 6.0 mm wall)'],
      ['Round Hollow Section (CHS)', 'Circular structural steel tubes & pipes (20 mm – 168.3 mm OD) in mill black and hot-dip galvanised finishes'],
      ['Standard stock length', '6 m standard lengths (available by the piece, bundle or full truckload)'],
    ],
    uses: ['Commercial, industrial and residential roof trusses', 'Structural columns, canopy frames and portal supports', 'Heavy-duty gates, window grilles, balustrades and perimeter posts', 'Furniture, trailers, workshops and custom steel fabrication'],
    request: ['Section type: Square Hollow Section (SHS), Rectangle Hollow Section (RHS) or Round Hollow Section (CHS)', 'Outer cross-section dimensions (mm) and wall thickness / gauge (mm)', 'Finish (mill black or galvanised)', 'Number of 6 m lengths or total tonnage required'],
  },
  {
    slug: 'structural-steel', name: 'Structural steel beams, channels & angles', cat: 'steel', image: 'beam', gallery: ['steel-yard', 'angle'],
    localTerms: 'FR: Poutrelles IPE/HEB, profilés UPN/C, cornières · RW: Ibyuma by’igisenge, koriniyeri',
    summary: 'Heavy-duty I-beams, H-beams, U-channels, steel C-channels and equal/unequal angle bars for structural frameworks and roof trusses.',
    description: 'Our structural steel range supports warehouse portal frames, commercial roof trusses, bridges, industrial structures and custom steel fabrication across Rwanda. We stock hot-rolled I-beams, U-channels, C-channels and angle bars in standard 6 m and 12 m lengths. Share your fabrication drawings or cutting list for a fast section-by-section quotation.',
    specs: [
      ['I-Beams & H-Beams', 'Universal I-beams (IPE / UB) and H-beams (HEB / UC) for heavy-duty columns, girders and structural spans'],
      ['U-Channels & C-Channels', 'Hot-rolled UPN / U-channels and cold-formed steel C-channels & purlins for roofing and support frameworks'],
      ['Angle bars', 'Equal and unequal structural steel angle iron (25×25 mm to 100×100 mm, 3 mm – 10 mm thickness)'],
      ['Grades & lengths', 'Structural grades S275 / S355 in standard 6 m and 12 m stock lengths'],
    ],
    uses: ['Warehouse, factory and commercial roof trusses', 'Multi-storey structural steel frameworks & mezzanines', 'Bridges, industrial supports and machinery frames', 'Staircases, canopies, towers and general steel fabrication'],
    request: ['Section profile (I-Beam, H-Beam, U-Channel, C-Channel or Angle Bar)', 'Cross-section dimensions and flange/web thickness (mm)', 'Required steel grade (e.g. S275 / S355)', 'Standard 6 m / 12 m lengths and total piece count'],
  },
  {
    slug: 'steel-plates', name: 'Steel plates & chequered plates', cat: 'steel', image: 'plates', gallery: ['beam'],
    localTerms: 'FR: Tôles fortes / noires, tôles larmées (antidérapantes) · RW: Amabati akomeye y’ibyuma',
    summary: 'Flat mild steel plates and anti-slip chequered steel plates in all standard thicknesses for baseplates, flooring and fabrication.',
    description: 'We supply flat hot-rolled/cold-rolled mild steel sheets and raised-tread chequered steel plates for structural baseplates, gussets, industrial walkways, stair treads, truck beds and heavy fabrication work across Rwanda.',
    specs: [
      ['Plain mild steel plates', 'Standard sheets (1.5 mm – 25 mm+ thickness) in 2440×1220 mm (8ft×4ft) and 3000×1500 mm formats'],
      ['Chequered steel plates', 'Anti-slip tear-drop / diamond pattern steel plates (2.5 mm – 8.0 mm thickness)'],
      ['Structural & fabrication grades', 'Weldable mild and structural steel (S235 / S275 / S355)'],
      ['Applications', 'Column baseplates, stiffeners, industrial mezzanines, ramps and vehicle bodies'],
    ],
    uses: ['Structural column baseplates, end-plates and gussets', 'Anti-slip industrial walkways, catwalks and stair treads', 'Service trenches, platform decking and vehicle/truck beds', 'Tanks, hoppers, doors and heavy steel fabrication'],
    request: ['Plate type (plain flat mild steel plate or anti-slip chequered plate)', 'Plate thickness (mm) and sheet size (e.g. 2440×1220 mm)', 'Steel grade required', 'Total sheet count and delivery location'],
  },
  {
    slug: 'reinforcement-steel', name: 'Reinforcement materials & column cages', cat: 'reinforcement', image: 'rebar', gallery: ['lathing'],
    localTerms: 'FR: Fer à béton (HA), cages d’armatures, treillis soudé BRC · RW: Ferabeto (Fer à béton)',
    summary: 'Ribbed high-yield deformed steel bars (rebar), prefabricated reinforcement column cages and welded BRC mesh for structural concrete.',
    description: 'We supply high-yield ribbed reinforcement steel bars, prefabricated reinforcement column/pile cages and welded BRC mesh sheets/rolls for residential, commercial and civil concrete construction. Send us your structural engineer’s bar bending schedule or material list—specifying bar diameters, grade and tonnage—for competitive pricing and coordinated site delivery.',
    specs: [
      ['Deformed bar diameters', 'D8, D10, D12, D16, D20, D25 and D32 mm deformed high-yield bars (12 m lengths)'],
      ['Reinforcement column cages', 'Ready-tied circular and rectangular reinforcement cages with helical/stirrup links'],
      ['Steel grades', 'High-yield weldable reinforcement steel (BS 4449 / Grade 500B / 460B equivalent)'],
      ['Welded reinforcement mesh', 'BRC mesh rolls and sheets (A98, A142, A193, A252, A393) + annealed tying wire'],
    ],
    uses: ['Pad, strip, pile and raft concrete foundations', 'Reinforced concrete columns, shear walls and ring beams', 'Suspended floor slabs and ground-bearing industrial slabs', 'Bridges, culverts and civil concrete structures'],
    request: ['Bar schedule or itemised diameter breakdown (D8 – D32) / cage dimensions', 'Required steel grade and standard compliance', 'BRC mesh ref numbers or sheet/roll counts if needed', 'Total tonnage or bar count and phased delivery dates'],
  },
  {
    slug: 'steel-wire', name: 'Chain-link, wire mesh & fencing', cat: 'fencing-essentials', image: 'hero-site', gallery: ['wire', 'green-mesh'],
    localTerms: 'FR: Grillage simple torsion, treillis inox/vert, fil barbelé, tendeurs · RW: Senyenge, uruzitiro, umukwege',
    summary: 'Galvanised and green PVC-coated chain-link fence rolls, stainless wire mesh, barbed wire, razor wire, turnbuckles and binding wire.',
    description: 'From heavy galvanised and green PVC-coated chain-link fencing rolls to fine stainless wire mesh, high-tensile barbed wire, concertina razor wire, tension turnbuckles and soft annealed binding wire, we stock complete wire and perimeter security solutions for homes, farms, schools, estates and industrial properties across Rwanda.',
    specs: [
      ['Chain-link fencing rolls', 'Galvanised and green PVC-coated diamond mesh rolls; heights 1.2 m – 2.4 m; apertures 50 mm – 75 mm'],
      ['Welded & stainless wire mesh', 'Green PVC-coated wire mesh rolls and corrosion-resistant stainless steel wire mesh'],
      ['Perimeter security & tensioning', 'Double-strand galvanised barbed wire, concertina razor wire and forged hook/eye turnbuckles'],
      ['Binding / tying wire', 'Soft annealed black or galvanised binding wire (1.2 mm – 2.0 mm) in 20 kg – 25 kg coils'],
    ],
    uses: ['Residential, school, farm and industrial perimeter fencing', 'Sports grounds, estates and highway boundary enclosures', 'Security topping with barbed wire, razor wire & turnbuckle tensioning', 'Daily rebar tying, formwork fixing and general screening'],
    request: ['Product type (chain-link, green wire mesh, stainless mesh, barbed/razor wire, turnbuckles, binding wire)', 'Wire gauge, aperture size and roll height/length', 'Finish: galvanised, green PVC-coated, stainless or black annealed', 'Quantity in rolls, coils or units'],
  },
  {
    slug: 'plumbing-materials', name: 'Galvanised pipes, plumbing & drainage', cat: 'fencing-essentials', image: 'gi-pipe', gallery: ['pipe'],
    localTerms: 'FR: Tuyaux acier galvanisé (GI), regards de visite, PPR/PVC · RW: Amatiyo y’ibyuma n’ay’amazi',
    summary: 'Galvanised steel pipes (GI), heavy-duty manhole covers, PPR/uPVC/HDPE pipework, pressure fittings and valves for building and civil works.',
    description: 'We supply corrosion-resistant galvanised steel pipes (GI) for water reticulation, fencing posts and structural pipework, alongside heavy-duty road and drainage manhole covers, PPR, uPVC and HDPE pipes, fittings and valves for residential, commercial and civil projects across Rwanda.',
    specs: [
      ['Galvanised steel pipes (GI)', 'Hot-dip galvanised circular steel pipes (DN15 – DN150 / 1/2" to 6") in light, medium and heavy classes'],
      ['Drainage & manhole covers', 'Heavy-duty cast ductile iron and composite manhole covers & frames for roads, compounds and drainage chambers'],
      ['Water supply & drainage pipework', 'PPR hot/cold water pipes (PN16/PN20), HDPE coils and uPVC underground drainage pipes with fittings'],
      ['Valves & accessories', 'Gate, ball and check valves, threaded GI fittings, flanges, clamps and thread sealants'],
    ],
    uses: ['Mainline water distribution, standpipes and exposed steel pipework', 'Stormwater, sewer and inspection chamber manhole installations', 'Fence posts, signposts, scaffolding and outdoor pipe structures', 'Building potable water supply and waste drainage networks'],
    request: ['Pipe material (Galvanised GI steel pipe, PPR, uPVC, HDPE) or manhole cover load class/size', 'Nominal diameter (mm or inches) and wall class / PN rating', 'Matching fittings, valves or frames required', 'Total lengths/units and site delivery location'],
  },
  {
    slug: 'general-construction', name: 'Waterproofing & construction essentials', cat: 'fencing-essentials', image: 'blocks', gallery: ['lathing'],
    localTerms: 'FR: Hydrofuge Sika HW, métal déployé (udutimba), accessoires · RW: Sika, udutimba n’ibikoresho by’ubwubatsi',
    summary: 'Sika Hydrofuge HW waterproofing admixtures, expanded metal lathing (udutimba), turnbuckles, fasteners and essential site hardware.',
    description: 'Consolidate your procurement by sourcing genuine Sika Hydrofuge HW concrete and mortar waterproofing admixtures, Crocodile 6FT×2FT expanded metal lathing (udutimba) for plastering and screening, formwork tie hardware, turnbuckles and daily site consumables alongside your primary steel order.',
    specs: [
      ['Waterproofing & chemicals', 'Sika Hydrofuge HW water-repellent admixtures for concrete and mortar, bonding agents and plasticisers'],
      ['Expanded metal lathing (udutimba)', 'Crocodile 6FT × 2FT expanded metal lathing sheets/bundles for plaster reinforcement, ceilings and partitions'],
      ['Rigging & fasteners', 'Hook-and-eye turnbuckles, common & roofing nails, high-tensile bolts, nuts and threaded rods'],
      ['Formwork & site consumables', 'Tie rods, wing nuts, DPC membranes, cutting/grinding discs and welding electrodes'],
    ],
    uses: ['Basement, water tank, foundation and wet-area waterproofing with Sika Hydrofuge HW', 'Plaster key reinforcement on masonry joints, ceilings and conduits using expanded metal lathing (udutimba)', 'Wire tensioning, formwork assembly and structural bolting', 'Consolidated multi-item contractor site procurement'],
    request: ['Consolidated material schedule or BoQ section', 'Specific product & packaging (e.g. Sika Hydrofuge HW jerrycan count, 6FT×2FT lathing bundles)', 'Quantities in jerrycans, bundles, boxes or units', 'Site location in Kigali or across Rwanda'],
  },
].map((p, i) => ({ ...p, n: String(i + 1).padStart(2, '0') }));

export const bySlug = (s) => products.find((p) => p.slug === s);

export const faqs = [
  {
    q: 'Can I combine multiple product families into a single quotation?',
    a: 'Yes. Use our multi-item quote builder on the Request a Quote page to select several product families (for example, I-beams, hollow sections, deformed rebar, chain-link fencing and Sika Hydrofuge HW waterproofing) and list individual line items in a single proforma request.',
  },
  {
    q: 'Do you deliver outside Kigali to other districts in Rwanda?',
    a: 'Yes. Customers can collect directly from our yard on KG 667 Street in Gisozi, Kigali, or arrange site delivery across Kigali and provincial districts (including Bugesera, Musanze, Rubavu, Huye, Rwamagana and Rusizi) based on order volume and schedule.',
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

export const applications = [
  { n: '01', label: 'Structural steel & portal frames', title: 'Build the frame.', image: 'beam', products: ['structural-steel', 'hollow-sections', 'steel-plates'],
    text: 'From hot-rolled I-beams, U-channels, C-channels and angle bars to square, rectangular and round hollow sections, we supply complete structural steelwork and chequered/mild steel plates against your fabrication cutting list.' },
  { n: '02', label: 'Reinforced concrete structures', title: 'Anchor the structure.', image: 'rebar', products: ['reinforcement-steel', 'general-construction'],
    text: 'We deliver D8–D32 high-yield deformed rebar, prefabricated reinforcement column cages, welded BRC mesh and annealed tying wire for foundations, columns, slabs and civil concrete works.' },
  { n: '03', label: 'Perimeter security & wire fencing', title: 'Secure the boundary.', image: 'wire', products: ['steel-wire', 'hollow-sections'],
    text: 'Protect residential estates, farms, schools and industrial facilities with galvanised and green PVC-coated chain-link fence rolls, stainless wire mesh, barbed wire, razor wire, steel posts and heavy-duty turnbuckles.' },
  { n: '04', label: 'Piping, drainage & waterproofing', title: 'Protect & reticulate.', image: 'gi-pipe', products: ['plumbing-materials', 'general-construction'],
    text: 'Combine galvanised steel pipes (GI), heavy-duty manhole covers and plumbing pipework with Sika Hydrofuge HW waterproofing admixtures and expanded metal lathing (udutimba) in one coordinated site delivery.' },
];

export const steps = [
  { title: 'Send your schedule', text: 'Share your bill of quantities, bar bending schedule, drawings or itemised material list via our quote tool or WhatsApp.' },
  { title: 'Receive itemised pricing', text: 'Our Gisozi sales desk verifies stock availability, technical grades and unit pricing for your exact specification.' },
  { title: 'Coordinate site delivery', text: 'Collect from our Kigali stockyard on KG 667 Street or schedule direct dispatch to your project site anywhere in Rwanda.' },
];

export const photos = {
  'hero-kigali': { title: 'Rectangular hollow steel sections (RHS) in stock', alt: 'Stacked rectangular hollow structural steel sections in the Fortimesh and Steels Rwanda stockyard in Kigali' },
  'steel-yard': { title: 'Structural steel U-channels in stock', alt: 'Stacked structural steel U-channels in the Fortimesh and Steels Rwanda stockyard' },
  'hero-site': { title: 'Galvanised chain-link fencing mesh', alt: 'Rolled and unrolled galvanised diamond chain-link fence mesh supplied by Fortimesh and Steels Rwanda' },
  'green-mesh': { title: 'PVC-coated green wire mesh rolls', alt: 'Stacked rolls of green PVC-coated wire mesh fencing in the Fortimesh warehouse' },
  wire: { title: 'Chain-link fence mesh rolls', alt: 'Warehouse stack of wrapped galvanised chain-link fencing mesh rolls at Fortimesh Rwanda' },
  rebar: { title: 'Reinforcement steel column cages', alt: 'Prefabricated ribbed reinforcement steel column cages and deformed bars at Fortimesh and Steels Rwanda' },
  beam: { title: 'Structural steel I-beams', alt: 'Heavy-duty structural steel I-beams stacked in the Fortimesh and Steels Rwanda stockyard' },
  angle: { title: 'Structural steel angle bars', alt: 'Stacked hot-rolled structural steel angle bars in the Fortimesh Rwanda warehouse' },
  plates: { title: 'Chequered and mild steel plates', alt: 'Stacked anti-slip chequered steel plates supplied by Fortimesh and Steels Rwanda' },
  pipe: { title: 'Round hollow steel sections (CHS)', alt: 'Cross-section view of stacked circular steel tubes and round hollow sections in stock' },
  'gi-pipe': { title: 'Galvanised steel pipes (GI)', alt: 'Bundles of hot-dip galvanised steel pipes stacked in the Fortimesh Rwanda stockyard' },
  lathing: { title: 'Expanded metal lathing (udutimba)', alt: 'Bundles of Crocodile 6FT x 2FT expanded metal lathing at Fortimesh and Steels Rwanda' },
  blocks: { title: 'Sika Hydrofuge HW waterproofing admixture', alt: 'Yellow jerrycan of Sika Hydrofuge HW concrete and mortar waterproofing admixture supplied by Fortimesh Rwanda' },
  feature: { title: 'Square hollow steel sections (SHS)', alt: 'Stacked square hollow structural steel tubes in the Fortimesh and Steels Rwanda warehouse' },
};

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== false && v !== '').map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`)).join('');

export function img(name, { sizes = '100vw', cls, eager = false, alt } = {}) {
  const m = manifest[name];
  if (!m || !photos[name]) throw new Error(`Unknown image: ${name}`);
  const srcset = m.widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ');
  const fallback = `/img/${name}-${m.widths.find((w) => w >= 1000) ?? m.widths.at(-1)}.webp`;
  return `<img${attrs({
    class: cls, src: fallback, srcset, sizes, width: m.width, height: m.height,
    alt: alt ?? photos[name].alt, loading: eager ? undefined : 'lazy', fetchpriority: eager ? 'high' : undefined, decoding: 'async',
  })}>`;
}

export const paths = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  up: '<path d="M7 17 17 7M8 7h9v9"/>',
  left: '<path d="M20 12H5m6-6-6 6 6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.4"/>',
  phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  chat: '<path d="M3.5 20.5l1.4-4.1a8.5 8.5 0 1 1 3.2 3.2Z"/><path fill="currentColor" stroke="none" d="M9.4 7.8c-.3 0-.6.1-.8.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.7 4.2 3.7 2.1.8 2.5.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.4l-1.4-.7c-.2-.1-.4-.1-.6.2-.2.3-.6.7-.7.9-.1.1-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.3 0-.4.1-.5l.4-.4.2-.4c.1-.1 0-.3 0-.4l-.6-1.5c-.2-.4-.4-.4-.6-.4h-.5Z"/>',
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

export const icon = (name, cls) => `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;

export const btn = (href, label, variant = 'primary', ic = 'up', extra = {}) =>
  `<a class="btn btn--${variant}${extra.cls ? ` ${extra.cls}` : ''}" href="${href}"${extra.attrs ?? ''}><span>${label}</span><span class="btn__icon">${icon(ic)}${icon(ic)}</span></a>`;

export function split(text, delayMs = 0) {
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

export const highlight = (text) => text.split(/\s+/).map((w) => {
  const accent = w.startsWith('*');
  const clean = w.replace(/\*/g, '');
  return `<span class="hw${accent || w.endsWith('*') ? ' is-accent' : ''}">${clean}</span>`;
}).join(' ');

export const mesh = (cls = '') => `<div class="mesh${cls ? ` ${cls}` : ''}" aria-hidden="true"></div>`;

export const navItems = [
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

export const headerHtml = (active = '') => `
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
      ${active === 'quote' ? btn('/products/', 'Browse products', 'primary', 'arrow', { cls: 'btn--sm hdr__cta' }) : btn('/quote/', 'Request a quote', 'primary', 'up', { cls: 'btn--sm hdr__cta' })}
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

export const footerHtml = `
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
        <p>Structural steel, hollow sections, reinforcement rebar, wire mesh fencing and construction materials supplied from Gisozi, Kigali for the projects moving Rwanda forward.</p>
      </div>
      <nav class="ftr__col" aria-label="Company">
        <h2>Company</h2>
        <a href="/about/">About Fortimesh</a>
        <a href="/applications/">Applications</a>
        <a href="/contact/">Contact &amp; location</a>
        <a href="/quote/">Request a quote</a>
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
      <span>KG 667 Street, Gisozi, Kigali, Rwanda</span>
    </div>
  </div>
  <div class="ftr__word" aria-hidden="true">FORTIMESH</div>
</footer>
<a class="wa-float" href="https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Hello Fortimesh Rwanda, I would like to inquire about material availability and pricing.')}" target="_blank" rel="noopener noreferrer" aria-label="Chat with Fortimesh sales desk on WhatsApp (${esc(site.contact.phone)})">
  <span class="wa-float__icon" aria-hidden="true">${icon('chat')}<i class="wa-float__dot"></i></span>
  <span class="wa-float__text"><strong>WhatsApp Sales</strong><small>${esc(site.contact.phone)}</small></span>
</a>`;

export function buildMetadata({ title, description, pathName, image = 'hero-kigali', product }) {
  const url = site.origin + pathName;
  const fullTitle = pathName === '/' ? `${site.name} | ${title}` : `${title} | ${site.short} Rwanda`;
  const imgMeta = manifest[image] || manifest['hero-kigali'];
  const ogWidth = imgMeta.widths.at(-1);
  const ogHeight = Math.round((imgMeta.height * ogWidth) / imgMeta.width);
  const ogImage = `${site.origin}/img/${image}-${ogWidth}.webp`;
  const ogAlt = photos[image]?.alt || site.name;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: product ? 'website' : 'website',
      siteName: site.name,
      locale: 'en_RW',
      title: fullTitle,
      description,
      url,
      images: [{ url: ogImage, width: ogWidth, height: ogHeight, alt: ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function buildSchema({ pathName, image = 'hero-kigali', crumbs, product, includeFaq = false }) {
  const url = site.origin + pathName;
  const imgMeta = manifest[image] || manifest['hero-kigali'];
  const ogWidth = imgMeta.widths.at(-1);
  const ogImage = `${site.origin}/img/${image}-${ogWidth}.webp`;

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
      streetAddress: 'KG 667 Street, Gisozi',
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
  return { '@context': 'https://schema.org', '@graph': graph };
}

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

export const ctaHtml = `
<section class="cta">
  <div class="cta__media px" data-parallax="0.2">${img('rebar', { alt: '', sizes: '100vw' })}</div>
  ${mesh()}
  <div class="container cta__inner">
    <p class="label label--light" data-reveal="fade">Ready to price your material schedule?</p>
    <h2 class="display-2" data-reveal="words">${split('Let’s get your project *moving.*')}</h2>
    <p data-reveal style="--i:2">Send your quantities, dimensions and delivery site to our Gisozi, Kigali sales desk—online, on WhatsApp or by phone.</p>
    <div class="cta__actions" data-reveal style="--i:3">
      ${btn('/quote/', 'Request a quote', 'light')}
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

const stepsList = () => `
<ol class="steps" data-reveal="steps">
  ${steps.map((s, i) => `<li class="step" style="--i:${i}"><span class="step__n">Step ${String(i + 1).padStart(2, '0')}</span><h3>${s.title}</h3><p>${s.text}</p></li>`).join('')}
</ol>`;

const productChips = (slugs) => `<div class="chips">${slugs.map((s) => `<a class="chip-link" href="/products/${s}/">${bySlug(s).name} ${icon('up')}</a>`).join('')}</div>`;

export const faqSection = `
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

export function calculatorSection(slug) {
  if (slug === 'reinforcement-steel') {
    return `
    <div class="calc" data-calc="rebar" data-reveal>
      <div class="calc__head">
        <div>
          <p class="label">${icon('calc')} Concrete Reinforcement Estimator</p>
          <h2 class="h3">Rebar &amp; Column Cage Weight Calculator</h2>
          <p>Estimate nominal steel weight (W = d² ÷ 162.2 × L), 12 m bar counts and prefabricated reinforcement column cage tonnage.</p>
        </div>
      </div>
      <div class="calc__grid">
        <label class="field">
          <span class="field__label">Rebar diameter or column cage</span>
          <select data-rebar-dia>
            <optgroup label="Straight Deformed Rebar (BS 4449)">
              <option value="8" data-label="D8 deformed steel bars">D8 (8 mm — 0.395 kg/m)</option>
              <option value="10" data-label="D10 deformed steel bars">D10 (10 mm — 0.617 kg/m)</option>
              <option value="12" data-label="D12 deformed steel bars" selected>D12 (12 mm — 0.888 kg/m)</option>
              <option value="14" data-label="D14 deformed steel bars">D14 (14 mm — 1.208 kg/m)</option>
              <option value="16" data-label="D16 deformed steel bars">D16 (16 mm — 1.578 kg/m)</option>
              <option value="20" data-label="D20 deformed steel bars">D20 (20 mm — 2.466 kg/m)</option>
              <option value="25" data-label="D25 deformed steel bars">D25 (25 mm — 3.853 kg/m)</option>
              <option value="32" data-label="D32 deformed steel bars">D32 (32 mm — 6.313 kg/m)</option>
            </optgroup>
            <optgroup label="Prefabricated Reinforcement Column Cages">
              <option value="cage:4.85" data-label="4-Bar D12 Column Cage (200×200 mm + D8 links)">4-Bar D12 Column Cage (200×200 mm · ~4.85 kg/m)</option>
              <option value="cage:7.65" data-label="4-Bar D16 Column Cage (250×250 mm + D8 links)">4-Bar D16 Column Cage (250×250 mm · ~7.65 kg/m)</option>
              <option value="cage:11.2" data-label="6-Bar D16 Column Cage (300×300 mm + D8 links)">6-Bar D16 Column Cage (300×300 mm · ~11.20 kg/m)</option>
              <option value="cage:14.8" data-label="8-Bar D16 Circular/Square Column Cage (Ø350 mm + D8 links)">8-Bar D16 Column Cage (Ø350 mm · ~14.80 kg/m)</option>
              <option value="cage:22.4" data-label="8-Bar D20 Structural Column Cage (400×400 mm + D10 links)">8-Bar D20 Column Cage (400×400 mm · ~22.40 kg/m)</option>
              <option value="cage:33.5" data-label="12-Bar D20 Heavy Column / Pile Cage (Ø500 mm + D10 spiral)">12-Bar D20 Column / Pile Cage (Ø500 mm · ~33.50 kg/m)</option>
            </optgroup>
          </select>
        </label>
        <label class="field">
          <span class="field__label">Bar / cage length (m)</span>
          <select data-rebar-len>
            <option value="12" selected>12 m standard full length</option>
            <option value="6">6 m half / single-storey column length</option>
            <option value="4">4 m standard floor column height</option>
            <option value="3">3 m residential column / footing length</option>
          </select>
        </label>
        <label class="field">
          <span class="field__label">Number of bars / cages</span>
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
  if (slug === 'structural-steel' || slug === 'hollow-sections') {
    return `
    <div class="calc" data-calc="steel" data-reveal>
      <div class="calc__head">
        <div>
          <p class="label">${icon('calc')} Hollow Section &amp; Steel Estimator</p>
          <h2 class="h3">Hollow Section (SHS, RHS &amp; CHS) Weight Calculator</h2>
          <p>Select any Square, Rectangular or Round Hollow Section size and wall thickness (1.2 mm – 6.0 mm) to calculate bar weight (kg) and metric tonnage (t).</p>
        </div>
      </div>
      <div class="calc__grid">
        <label class="field">
          <span class="field__label">Hollow section size (mm)</span>
          <select data-steel-profile>
            <optgroup label="Square Hollow Section (SHS)">
              <option value="shs:15:15" data-label="SHS 15×15 mm">SHS 15 × 15 mm</option>
              <option value="shs:20:20" data-label="SHS 20×20 mm">SHS 20 × 20 mm</option>
              <option value="shs:25:25" data-label="SHS 25×25 mm">SHS 25 × 25 mm (1" × 1")</option>
              <option value="shs:30:30" data-label="SHS 30×30 mm">SHS 30 × 30 mm</option>
              <option value="shs:35:35" data-label="SHS 35×35 mm">SHS 35 × 35 mm</option>
              <option value="shs:40:40" data-label="SHS 40×40 mm">SHS 40 × 40 mm (1.5" × 1.5")</option>
              <option value="shs:50:50" data-label="SHS 50×50 mm" selected>SHS 50 × 50 mm (2" × 2")</option>
              <option value="shs:60:60" data-label="SHS 60×60 mm">SHS 60 × 60 mm</option>
              <option value="shs:75:75" data-label="SHS 75×75 mm">SHS 75 × 75 mm (3" × 3")</option>
              <option value="shs:80:80" data-label="SHS 80×80 mm">SHS 80 × 80 mm</option>
              <option value="shs:90:90" data-label="SHS 90×90 mm">SHS 90 × 90 mm</option>
              <option value="shs:100:100" data-label="SHS 100×100 mm">SHS 100 × 100 mm (4" × 4")</option>
              <option value="shs:120:120" data-label="SHS 120×120 mm">SHS 120 × 120 mm</option>
              <option value="shs:150:150" data-label="SHS 150×150 mm">SHS 150 × 150 mm (6" × 6")</option>
            </optgroup>
            <optgroup label="Rectangle Hollow Section (RHS)">
              <option value="rhs:30:20" data-label="RHS 30×20 mm">RHS 30 × 20 mm</option>
              <option value="rhs:40:20" data-label="RHS 40×20 mm">RHS 40 × 20 mm</option>
              <option value="rhs:40:25" data-label="RHS 40×25 mm">RHS 40 × 25 mm</option>
              <option value="rhs:50:25" data-label="RHS 50×25 mm">RHS 50 × 25 mm (2" × 1")</option>
              <option value="rhs:50:30" data-label="RHS 50×30 mm">RHS 50 × 30 mm</option>
              <option value="rhs:60:30" data-label="RHS 60×30 mm">RHS 60 × 30 mm</option>
              <option value="rhs:60:40" data-label="RHS 60×40 mm">RHS 60 × 40 mm</option>
              <option value="rhs:75:50" data-label="RHS 75×50 mm">RHS 75 × 50 mm (3" × 2")</option>
              <option value="rhs:80:40" data-label="RHS 80×40 mm">RHS 80 × 40 mm</option>
              <option value="rhs:90:50" data-label="RHS 90×50 mm">RHS 90 × 50 mm</option>
              <option value="rhs:100:50" data-label="RHS 100×50 mm">RHS 100 × 50 mm (4" × 2")</option>
              <option value="rhs:120:60" data-label="RHS 120×60 mm">RHS 120 × 60 mm</option>
              <option value="rhs:150:75" data-label="RHS 150×75 mm">RHS 150 × 75 mm (6" × 3")</option>
              <option value="rhs:150:100" data-label="RHS 150×100 mm">RHS 150 × 100 mm (6" × 4")</option>
              <option value="rhs:200:100" data-label="RHS 200×100 mm">RHS 200 × 100 mm (8" × 4")</option>
            </optgroup>
            <optgroup label="Round Hollow Section (CHS)">
              <option value="chs:21.3" data-label="CHS 21.3 mm (1/2&quot; NB)">CHS 21.3 mm OD (1/2" NB · DN15)</option>
              <option value="chs:26.9" data-label="CHS 26.9 mm (3/4&quot; NB)">CHS 26.9 mm OD (3/4" NB · DN20)</option>
              <option value="chs:33.7" data-label="CHS 33.7 mm (1&quot; NB)">CHS 33.7 mm OD (1" NB · DN25)</option>
              <option value="chs:42.4" data-label="CHS 42.4 mm (1-1/4&quot; NB)">CHS 42.4 mm OD (1-1/4" NB · DN32)</option>
              <option value="chs:48.3" data-label="CHS 48.3 mm (1-1/2&quot; NB)">CHS 48.3 mm OD (1-1/2" NB · DN40)</option>
              <option value="chs:60.3" data-label="CHS 60.3 mm (2&quot; NB)">CHS 60.3 mm OD (2" NB · DN50)</option>
              <option value="chs:76.1" data-label="CHS 76.1 mm (2-1/2&quot; NB)">CHS 76.1 mm OD (2-1/2" NB · DN65)</option>
              <option value="chs:88.9" data-label="CHS 88.9 mm (3&quot; NB)">CHS 88.9 mm OD (3" NB · DN80)</option>
              <option value="chs:114.3" data-label="CHS 114.3 mm (4&quot; NB)">CHS 114.3 mm OD (4" NB · DN100)</option>
              <option value="chs:139.7" data-label="CHS 139.7 mm (5&quot; NB)">CHS 139.7 mm OD (5" NB · DN125)</option>
              <option value="chs:168.3" data-label="CHS 168.3 mm (6&quot; NB)">CHS 168.3 mm OD (6" NB · DN150)</option>
            </optgroup>
            <optgroup label="Structural Steel Columns (UC / HEB H-Beams)">
              <option value="fixed:20.4" data-label="HEB 100 / UC 100×100 mm Column">HEB 100 / UC 100 × 100 mm Column (20.4 kg/m)</option>
              <option value="fixed:26.7" data-label="HEB 120 / UC 120×120 mm Column">HEB 120 / UC 120 × 120 mm Column (26.7 kg/m)</option>
              <option value="fixed:33.7" data-label="HEB 140 / UC 140×140 mm Column">HEB 140 / UC 140 × 140 mm Column (33.7 kg/m)</option>
              <option value="fixed:23.0" data-label="UC 152×152×23 Column">UC 152 × 152 × 23 kg/m Column</option>
              <option value="fixed:30.0" data-label="UC 152×152×30 Column">UC 152 × 152 × 30 kg/m Column</option>
              <option value="fixed:37.0" data-label="UC 152×152×37 Column">UC 152 × 152 × 37 kg/m Column</option>
              <option value="fixed:42.6" data-label="HEB 160 / UC 160×160 mm Column">HEB 160 / UC 160 × 160 mm Column (42.6 kg/m)</option>
              <option value="fixed:46.1" data-label="UC 203×203×46 Column">UC 203 × 203 × 46 kg/m Column</option>
              <option value="fixed:60.0" data-label="UC 203×203×60 / HEB 200 Column">UC 203 × 203 × 60 kg/m / HEB 200 Column</option>
              <option value="fixed:72.9" data-label="UC 254×254×73 Column">UC 254 × 254 × 73 kg/m Column</option>
            </optgroup>
            <optgroup label="Universal I-Beams &amp; U-Channels (IPE / UPN)">
              <option value="fixed:8.1" data-label="IPE 100 I-Beam">IPE 100 I-Beam (8.10 kg/m)</option>
              <option value="fixed:10.4" data-label="IPE 120 I-Beam">IPE 120 I-Beam (10.40 kg/m)</option>
              <option value="fixed:12.9" data-label="IPE 140 I-Beam">IPE 140 I-Beam (12.90 kg/m)</option>
              <option value="fixed:15.8" data-label="IPE 160 I-Beam">IPE 160 I-Beam (15.80 kg/m)</option>
              <option value="fixed:18.8" data-label="IPE 180 I-Beam">IPE 180 I-Beam (18.80 kg/m)</option>
              <option value="fixed:22.4" data-label="IPE 200 I-Beam">IPE 200 I-Beam (22.40 kg/m)</option>
              <option value="fixed:26.2" data-label="IPE 220 I-Beam">IPE 220 I-Beam (26.20 kg/m)</option>
              <option value="fixed:30.7" data-label="IPE 240 I-Beam">IPE 240 I-Beam (30.70 kg/m)</option>
              <option value="fixed:8.64" data-label="UPN 80 U-Channel">UPN 80 U-Channel (8.64 kg/m)</option>
              <option value="fixed:10.6" data-label="UPN 100 U-Channel">UPN 100 U-Channel (10.60 kg/m)</option>
              <option value="fixed:13.4" data-label="UPN 120 U-Channel">UPN 120 U-Channel (13.40 kg/m)</option>
              <option value="fixed:16.0" data-label="UPN 140 U-Channel">UPN 140 U-Channel (16.00 kg/m)</option>
              <option value="fixed:18.8" data-label="UPN 160 U-Channel">UPN 160 U-Channel (18.80 kg/m)</option>
              <option value="fixed:25.3" data-label="UPN 200 U-Channel">UPN 200 U-Channel (25.30 kg/m)</option>
            </optgroup>
          </select>
        </label>
        <label class="field">
          <span class="field__label">Wall thickness (mm)</span>
          <select data-steel-thick>
            <option value="1.2">1.2 mm (Light gauge)</option>
            <option value="1.5">1.5 mm</option>
            <option value="1.8">1.8 mm</option>
            <option value="2.0">2.0 mm</option>
            <option value="2.5">2.5 mm</option>
            <option value="3.0" selected>3.0 mm (Standard structural)</option>
            <option value="4.0">4.0 mm (Heavy)</option>
            <option value="5.0">5.0 mm (Extra heavy)</option>
            <option value="6.0">6.0 mm (Thick wall)</option>
          </select>
        </label>
        <label class="field">
          <span class="field__label">Bar length (m)</span>
          <select data-steel-len>
            <option value="6" selected>6 m standard stock length</option>
            <option value="12">12 m custom / mill length</option>
          </select>
        </label>
        <label class="field">
          <span class="field__label">Number of bars</span>
          <input type="number" min="1" max="10000" step="1" value="40" data-steel-qty>
        </label>
      </div>
      <div class="calc__out">
        <div class="calc__stat"><small>Linear weight</small><strong data-steel-kgm>4.43 kg/m</strong></div>
        <div class="calc__stat"><small>Weight per bar</small><strong data-steel-unit>26.6 kg</strong></div>
        <div class="calc__stat"><small>Total weight</small><strong data-steel-kg>1,063 kg</strong></div>
        <div class="calc__stat"><small>Metric tonnage</small><strong data-steel-tonnes>1.06 t</strong></div>
      </div>
      <div class="calc__actions">
        <a class="btn btn--primary btn--sm" data-steel-quote href="/quote/?product=hollow-sections&amp;qty=40%20bars%20(1.06%20t)&amp;spec=SHS%2050%C3%9750%20mm%20%C3%97%203.0%20mm%20hollow%20sections%20(6m%20length)%20%E2%80%94%2040%20bars%20(~1,063%20kg)"><span>Send calculation to Quote</span><span class="btn__icon">${icon('up')}${icon('up')}</span></a>
        <small>Theoretical mass calculated at steel density 7.85 g/cm³ per EN 10219 / ISO 4019.</small>
      </div>
    </div>`;
  }
  return '';
}

export const homeHtml = `
<section class="hero">
  <div class="hero__media px" data-parallax="0.22">${img('hero-kigali', { eager: true, sizes: '100vw' })}</div>
  ${mesh()}
  <div class="container hero__content">
    <p class="eyebrow eyebrow--light" data-reveal="fade">Structural Steel · Rebar · Wire Mesh · Construction Materials — Kigali, Rwanda</p>
    <h1 class="display hero__title" data-reveal="words">${split('Strength for | *what’s next.*', 250)}</h1>
    <div class="hero__row">
      <p class="hero__lead" data-reveal style="--i:6">We supply structural steel beams, channels and hollow sections, steel plates, deformed reinforcement rebar, chain-link fencing wire, galvanised pipes and Sika waterproofing materials to contractors, engineers and developers across Rwanda.</p>
      <div class="hero__ctas" data-reveal style="--i:7">
        ${btn('/products/', 'Explore our products', 'primary')}
        ${btn('#calculators', 'Material calculators', 'ghost', 'calc')}
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
      <p class="intro__text" data-highlight>${highlight('From our stockyard in Gisozi, Kigali, Fortimesh and Steels Rwanda supplies *structural *steel, *hollow *sections, reinforcement rebar, wire mesh fencing and construction materials to contractors, engineers, developers, institutions and builders across Rwanda.')}</p>
      <div class="stats">
        <div class="stat" data-reveal style="--i:0"><span class="stat__n" data-count="${products.length}">0${products.length}</span><span class="stat__l">Core product families stocked &amp; sourced</span></div>
        <div class="stat" data-reveal style="--i:1"><span class="stat__n" data-count="${categories.length}">0${categories.length}</span><span class="stat__l">Supply divisions, from heavy structural steel to site waterproofing</span></div>
        <div class="stat" data-reveal style="--i:2"><span class="stat__n">KGL</span><span class="stat__l">KG 667 St, Gisozi — dispatching nationwide across Rwanda</span></div>
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
        <p>From structural steel beams, hollow sections and steel plates to concrete reinforcement, chain-link fencing and Sika waterproofing, explore our seven core supply families.</p>
        <a class="link" href="/products/">View full catalogue &amp; specs ${icon('arrow')}</a>
      </div>
    </header>
    <div class="bento">
      ${products.map((p, i) => `
      <a class="tile tile--${i}" href="/products/${p.slug}/" data-reveal="up" style="--i:${i % 3}">
        <div class="tile__media">${img(p.image, { sizes: i === 0 ? '(max-width: 960px) 100vw, 60vw' : i === 6 ? '100vw' : '(max-width: 640px) 100vw, (max-width: 960px) 50vw, 40vw' })}</div>
        <div class="tile__top"><span>${p.n} / 07</span><span>${esc(catName(p.cat))}</span></div>
        <div class="tile__body"><h3>${p.name}</h3>${p.localTerms ? `<small class="tile__terms">${esc(p.localTerms)}</small>` : ''}<p><span>${p.summary}</span></p></div>
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
      <p class="lead" data-reveal>We supply quality structural steel, hollow sections, steel plates, reinforcement rebar, wire mesh fencing, galvanised pipes and essential building materials for residential, commercial and civil projects across Rwanda—combining responsive pricing with dependable site logistics.</p>
      <ol class="pillars">
        <li class="pillar" data-reveal style="--i:0"><span class="pillar__n">01</span><div><h3>Complete project consolidation</h3><p>Source I-beams, channels, hollow sections, steel plates, rebar, chain-link fencing, GI pipes and Sika waterproofing solutions through a single Kigali supplier.</p></div></li>
        <li class="pillar" data-reveal style="--i:1"><span class="pillar__n">02</span><div><h3>Quotes matched to your specification</h3><p>We verify bar diameters, section wall thicknesses, plate thicknesses, wire gauges, coatings and quantities directly against your BoQ or drawings.</p></div></li>
        <li class="pillar" data-reveal style="--i:2"><span class="pillar__n">03</span><div><h3>Yard collection or nationwide delivery</h3><p>Collect directly from KG 667 Street in Gisozi, Kigali, or coordinate phased truck deliveries to your project site anywhere in Rwanda.</p></div></li>
      </ol>
      <div class="prose__actions" data-reveal>
        ${btn('/about/', 'About our company', 'dark')}
        <button class="chip chip--print" type="button" data-print>${icon('print')} Print Company Profile (PDF)</button>
      </div>
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

<section class="section section--white on-light" id="calculators">
  <div class="container">
    <header class="sec-head">
      <div>
        <p class="label" data-reveal="fade"><span class="num">(05)</span> Project estimators</p>
        <h2 class="h2 on-light" data-reveal="words">${split('Calculate *rebar tonnage* &amp; *steel section weight.*')}</h2>
      </div>
      <div class="sec-head__aside" data-reveal>
        <p>Run instant quantity and tonnage checks for deformed steel bars (D8–D32) and structural hollow sections / beams, then transfer your numbers straight into a quotation.</p>
      </div>
    </header>
    <div class="calc-pair">
      ${calculatorSection('reinforcement-steel')}
      ${calculatorSection('structural-steel')}
    </div>
  </div>
</section>

<section class="section process">
  <div class="container">
    <header class="sec-head">
      <div>
        <p class="label" data-reveal="fade"><span class="num">(06)</span> How ordering works</p>
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

${faqSection}

<section class="section on-light">
  <div class="container">
    <header class="sec-head">
      <div>
        <p class="label" data-reveal="fade"><span class="num">(08)</span> Kigali stockyard &amp; dispatch</p>
        <h2 class="h2 on-light" data-reveal="words">${split('Visit us in *Gisozi, Kigali.*')}</h2>
      </div>
      <div class="sec-head__aside" data-reveal>
        <p>Located on KG 667 Street, Gisozi Sector, Gasabo District—equipped for contractor walk-ins, yard collections and flatbed dispatches across Rwanda.</p>
        <a class="link" href="/contact/">Full contact &amp; dispatch details ${icon('arrow')}</a>
      </div>
    </header>
    <div class="map-card" data-reveal style="margin-top:0">
      <div class="map-card__head">
        <div>
          <p class="label">Yard location &amp; directions</p>
          <h3 class="h3">KG 667 Street, Gisozi — Kigali, Rwanda</h3>
          <p>Direct sales desk: ${esc(site.contact.phone)} · ${esc(site.contact.email)}</p>
        </div>
        ${btn('https://www.google.com/maps/search/?api=1&query=KG+667+St+Gisozi+Kigali+Rwanda', 'Open in Google Maps', 'dark', 'up', { cls: 'btn--sm', attrs: ' target="_blank" rel="noopener noreferrer"' })}
      </div>
      <div class="map-card__frame">
        <iframe title="Map showing Gisozi, Kigali — Fortimesh and Steels Rwanda Ltd" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.openstreetmap.org/export/embed.html?bbox=30.0524%2C-1.9301%2C30.0804%2C-1.9101&amp;layer=mapnik&amp;marker=-1.9201%2C30.0664"></iframe>
      </div>
    </div>
  </div>
</section>
${ctaHtml}`;

export const catalogHtml = `
${pageHero({ label: 'Product catalogue', title: 'Materials with a *job to do.*', image: 'steel-yard', crumbs: [['Home', '/'], ['Products', '/products/']], lead: 'Explore our seven core supply families. Select any product family for standard dimensions, grades and a direct quotation.' })}
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
    <p class="note">We supply both standard stocked sizes and project-specific orders across Rwanda. Contact our Gisozi sales desk on <a href="tel:${site.contact.phone.replace(/[^+\d]/g, '')}">${esc(site.contact.phone)}</a> to confirm current batch availability and delivery lead times.</p>
  </div>
</section>
${ctaHtml}`;

export function productPageHtml(p, i) {
  const prev = products[(i - 1 + products.length) % products.length];
  const next = products[(i + 1) % products.length];
  const related = products.filter((x) => x.slug !== p.slug).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat)).slice(0, 3);
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
        ${btn(`/quote/?product=${p.slug}`, 'Quote this product', 'primary')}
        <button class="btn btn--ghost btn--sm" type="button" data-print><span>Print spec sheet</span><span class="btn__icon">${icon('print')}${icon('print')}</span></button>
        <a class="link link--light" href="/products/">All products ${icon('arrow')}</a>
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
${ctaHtml}`;
}

export const aboutHtml = `
${pageHero({ label: 'About Fortimesh', title: 'Strength that *secures your future.*', image: 'beam', crumbs: [['Home', '/'], ['About', '/about/']], lead: 'Based in Gisozi, Kigali, we supply structural steel, hollow sections, reinforcement rebar, wire mesh fencing and essential construction materials for projects shaping communities across Rwanda.' })}
<section class="section">
  <div class="container split">
    <div>
      <p class="label" data-reveal="fade">Our company</p>
      <h2 class="h2 on-light" data-reveal="words">${split('Reliable materials. | *Practical service.*')}</h2>
    </div>
    <div class="prose" data-reveal>
      <p><strong>FORTIMESH AND STEELS RWANDA LTD</strong> is a Kigali-based construction materials and steel supplier located at KG 667 Street, Gisozi. Guided by our commitment—<em>“If it carries my name, it must be strong”</em>—we partner with civil and building contractors, structural engineers, real estate developers, public institutions and private homebuilders across Rwanda.</p>
      <p>Our core strength lies in bridging heavy structural and reinforcement steel requirements—such as I-beams, U/C-channels, angle bars, square/rectangular/round hollow sections, chequered and mild steel plates, deformed reinforcement bars and prefabricated column cages—with chain-link wire mesh fencing, galvanised steel pipes, expanded metal lathing (udutimba) and Sika Hydrofuge HW waterproofing supplies.</p>
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
    ${stepsList()}
  </div>
</section>
${ctaHtml}`;

export const applicationsHtml = `
${pageHero({ label: 'Applications', title: 'For the places *taking shape.*', image: 'hero-site', crumbs: [['Home', '/'], ['Applications', '/applications/']], lead: 'From commercial steel roof trusses and multi-storey concrete frames to perimeter fencing, galvanised piping and waterproofing, see how our product families work together on site.' })}
<section class="section on-light">
  <div class="container">
    ${applications.map((a) => `
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
${ctaHtml}`;

const infoRow = (ic, label, value, note, href) => {
  const inner = `<span class="info__icon">${icon(ic)}</span><div><small>${label}</small><strong>${value}</strong>${note ? `<p>${note}</p>` : ''}</div>${href ? icon('up') : ''}`;
  return href ? `<a class="info__row" href="${href}"${href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${inner}</a>` : `<div class="info__row">${inner}</div>`;
};

export const contactHtml = `
${pageHero({ label: 'Contact', title: 'Start the *conversation.*', image: 'hero-kigali', position: '20% 50%', short: true, crumbs: [['Home', '/'], ['Contact', '/contact/']], lead: 'Reach our Gisozi, Kigali sales desk directly by phone, WhatsApp or email—or prepare a structured material request online.' })}
<section class="section on-light">
  <div class="container contact-grid">
    <div>
      <p class="label" data-reveal="fade">Kigali office &amp; yard</p>
      <h2 class="h2" data-reveal="words">${split('Based in Gisozi. | *Serving Rwanda.*')}</h2>
      <p class="lead" data-reveal>Call, message us on WhatsApp or visit our office on KG 667 Street in Gisozi, Kigali to discuss stock availability, technical specifications and site delivery across Rwanda.</p>
      <div class="info" data-reveal style="--i:1">
        ${infoRow('pin', 'Address', site.address, 'Gisozi sector, Gasabo District, Kigali', 'https://www.google.com/maps/search/?api=1&query=KG+667+St+Gisozi+Kigali+Rwanda')}
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
            <h3 class="h3">KG 667 Street, Gisozi — Kigali</h3>
            <p>Easy flatbed and truck access in Gisozi Sector, Gasabo District.</p>
          </div>
          ${btn('https://www.google.com/maps/search/?api=1&query=KG+667+St+Gisozi+Kigali+Rwanda', 'Open in Google Maps', 'dark', 'up', { cls: 'btn--sm', attrs: ' target="_blank" rel="noopener noreferrer"' })}
        </div>
        <div class="map-card__frame">
          <iframe title="Map showing Gisozi, Kigali — Fortimesh and Steels Rwanda Ltd" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.openstreetmap.org/export/embed.html?bbox=30.0524%2C-1.9301%2C30.0804%2C-1.9101&amp;layer=mapnik&amp;marker=-1.9201%2C30.0664"></iframe>
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
      <small>We respond promptly to contractor and project inquiries across Rwanda.</small>
    </aside>
  </div>
</section>
${faqSection}
${ctaHtml}`;

export const quoteHtml = `
${pageHero({ label: 'Request a quote', title: 'Tell us what the *job needs.*', image: 'wire', short: true, crumbs: [['Home', '/'], ['Request a quote', '/quote/']], lead: 'Build a structured multi-item material schedule and send it straight to our Kigali sales team via online dispatch, WhatsApp or email.' })}
<section class="section on-light">
  <div class="container quote-grid">
    <div>
      <form id="quote-form" class="qform" action="/api/quote" method="POST" novalidate data-reveal>
        <input type="text" name="_website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none">
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
                <input name="item_spec" placeholder="Size / grade (e.g. D12 12m, SHS 50×50×3mm)" aria-label="Item specification" maxlength="140">
                <input name="item_qty" placeholder="Qty (e.g. 120 bars)" aria-label="Item quantity" maxlength="80">
                <button class="sched__del" type="button" data-remove-row aria-label="Remove line item" title="Remove line item">${icon('trash')}</button>
              </div>
            </div>
          </div>
          <div class="fields">
            <label class="field"><span class="field__label">Total quantity / summary <span class="req">*</span></span><input name="quantity" placeholder="e.g. 40 bars SHS 50×50×3mm + 4 tonnes D12 rebar" required maxlength="140"></label>
            <label class="field"><span class="field__label">When do you need it?</span><input name="timeline" placeholder="e.g. Immediate / Next week / Phased delivery" maxlength="100"></label>
            <label class="field field--full"><span class="field__label">Sizes, grade, specifications or additional BoQ notes <span class="req">*</span></span><textarea name="specification" rows="5" placeholder="Include dimensions (e.g. IPE 160 I-beams, UPN 100 U-channels, SHS 50×50×3mm, D12/D16 rebar, chain-link rolls), coatings, standards or additional items from your BoQ" required maxlength="1500"></textarea></label>
          </div>
        </div>
        <div class="qform__sec">
          <div class="qform__head"><span>02</span><h2>Project &amp; delivery</h2></div>
          <div class="fields">
            <label class="field field--full"><span class="field__label">Site location or collection preference <span class="req">*</span></span><input name="location" placeholder="e.g. Nyarutarama site delivery, Bugesera, Musanze, or Yard collection in Gisozi" required maxlength="150"></label>
          </div>
        </div>
        <div class="qform__sec">
          <div class="qform__head"><span>03</span><h2>Your details</h2></div>
          <div class="fields">
            <label class="field field--full"><span class="field__label">Your name &amp; company <span class="req">*</span></span><input name="name" autocomplete="name" placeholder="Name / Contractor or company" required maxlength="100"></label>
            <label class="field"><span class="field__label">Email address (receives confirmation) <span class="req">*</span></span><input type="email" name="email" autocomplete="email" placeholder="you@company.com" required maxlength="150"></label>
            <label class="field"><span class="field__label">Phone / WhatsApp <span class="req">*</span></span><input type="tel" name="contact" autocomplete="tel" placeholder="+250 7XX XXX XXX" required maxlength="100"></label>
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
        <p>Choose your preferred channel below—WhatsApp is fastest for immediate stock and pricing confirmation, or click <strong>Submit online</strong> to send directly to our sales desk and receive an instant confirmation email.</p>
        <pre id="quote-message"></pre>
        <div class="result__actions">
          <a id="whatsapp-request" class="btn btn--primary" data-number="${site.contact.whatsapp}" href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener noreferrer"><span>Send on WhatsApp</span><span class="btn__icon">${icon('chat')}${icon('chat')}</span></a>
          <button id="online-request" class="btn btn--light" type="button" data-api="/api/quote"><span>Submit online</span><span class="btn__icon">${icon('send')}${icon('send')}</span></button>
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
          <li>${icon('check')}<span>Site delivery district or Gisozi yard pickup</span></li>
        </ul>
      </div>
    </aside>
  </div>
</section>
${faqSection}`;

export const notFoundHtml = `
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
