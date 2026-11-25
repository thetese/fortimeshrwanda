import nodemailer from 'nodemailer';

const DEFAULT_INBOX = 'fortimeshrwanda@gmail.com';
const DEFAULT_HOST = 'smtp.gmail.com';
const DEFAULT_PORT = 465;
const DEFAULT_ORIGIN = 'https://fortimeshrwanda.vercel.app';
const COMPANY_NAME = 'FORTIMESH AND STEELS RWANDA LTD';
const COMPANY_TAGLINE = 'If it carries my name, it must be strong.';
const COMPANY_ADDRESS = 'KG 667 Street, Gisozi, Gasabo District, Kigali, Rwanda';
const COMPANY_PHONE = '+250 793 086 644';
const COMPANY_WHATSAPP = '250793086644';
const COMPANY_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=KG+667+St+Gisozi+Kigali+Rwanda';
const COMPANY_INSTAGRAM_URL = 'https://www.instagram.com/fortimesh_rwanda/';

const REQUIRED_FIELDS = [
  'product_family',
  'quantity',
  'specifications',
  'delivery_location',
  'client_name',
  'reply_contact',
];

function cap(value, maxLength) {
  const trimmed = String(value ?? '').trim();
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
}

function generateReference() {
  const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `FM-${dateStamp}-${suffix}`;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeHeaderValue(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
}

export function extractEmail(contact) {
  const raw = String(contact ?? '');
  if (/[\r\n]/.test(raw)) return undefined;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 254) return undefined;
  if (/^[^\s@<>(),;:"\\]+@[^\s@<>(),;:"\\]+\.[^\s@<>(),;:"\\]{2,}$/.test(trimmed)) {
    return trimmed;
  }
  return undefined;
}

export function resolveClientEmail(quote = {}) {
  const explicit = extractEmail(quote.client_email);
  if (explicit) return explicit;

  const direct = extractEmail(quote.reply_contact);
  if (direct) return direct;

  const rawContact = String(quote.reply_contact ?? '');
  if (/[\r\n]/.test(rawContact)) return undefined;
  const tokenMatch = rawContact.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24}/);
  return tokenMatch ? extractEmail(tokenMatch[0]) : undefined;
}

function extractPhoneLinks(contact) {
  const raw = String(contact ?? '').trim();
  if (!raw || raw.includes('@')) {
    const phonePart = raw.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24}/g, '').trim();
    if (!phonePart) return null;
    return extractPhoneLinks(phonePart);
  }
  const cleaned = raw.replace(/[^\d+]/g, '');
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 15) return null;

  if (/^07\d{8}$/.test(digits)) {
    const intl = `250${digits.slice(1)}`;
    return { tel: `+${intl}`, wa: intl, display: raw };
  }
  return {
    tel: cleaned.startsWith('+') ? cleaned : `+${digits}`,
    wa: digits,
    display: raw,
  };
}

function formatKigaliTimestamp(isoString) {
  try {
    const date = isoString ? new Date(isoString) : new Date();
    if (Number.isNaN(date.getTime())) return String(isoString || '');
    const formatted = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Africa/Kigali',
    }).format(date);
    return `${formatted} CAT`;
  } catch {
    return String(isoString || '');
  }
}

function getSiteOrigin(env = process.env) {
  const raw =
    env.SITE_ORIGIN ||
    (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    DEFAULT_ORIGIN;
  return String(raw).replace(/\/+$/, '');
}

function parseScheduleList(scheduleItems) {
  if (
    !scheduleItems ||
    scheduleItems === 'See specification summary' ||
    !String(scheduleItems).trim()
  ) {
    return [];
  }
  return String(scheduleItems)
    .split(/\s*\|\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getSmtpConfig(env = process.env) {
  const host = String(env.SMTP_HOST || DEFAULT_HOST).trim() || DEFAULT_HOST;
  const parsedPort = Number.parseInt(String(env.SMTP_PORT ?? DEFAULT_PORT).trim(), 10);
  const port = Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? parsedPort : DEFAULT_PORT;

  const rawSecure = env.SMTP_SECURE !== undefined ? String(env.SMTP_SECURE).trim().toLowerCase() : '';
  let secure;
  if (rawSecure === 'true' || rawSecure === '1') {
    secure = true;
  } else if (rawSecure === 'false' || rawSecure === '0') {
    secure = false;
  } else {
    secure = port === 465;
  }

  const user = String(env.SMTP_USER || env.GOOGLE_SMTP_USER || env.GMAIL_USER || '').trim();
  const rawPass = String(
    env.SMTP_PASS || env.GOOGLE_SMTP_PASS || env.GMAIL_APP_PASSWORD || env.GMAIL_PASS || '',
  );
  const isGoogleHost = /(^|\.)(gmail|googlemail|google)\.com$/i.test(host);
  const isGoogleAppPassword = /^\s*[a-z]{4}(\s+[a-z]{4}){3}\s*$/i.test(rawPass);
  const pass = isGoogleHost || isGoogleAppPassword ? rawPass.replace(/\s+/g, '') : rawPass.trim();

  const to = String(env.QUOTE_INBOX_EMAIL || user || DEFAULT_INBOX).trim() || DEFAULT_INBOX;
  const from = String(env.SMTP_FROM || (user ? `"FORTIMESH Rwanda" <${user}>` : '')).trim();

  return { host, port, secure, user, pass, to, from };
}

export function isSmtpConfigured(env = process.env) {
  const cfg = getSmtpConfig(env);
  return Boolean(cfg.host && cfg.port && cfg.user && cfg.pass);
}

export function normalizeQuotePayload(raw = {}) {
  const isFormData = raw && typeof raw.get === 'function' && typeof raw.getAll === 'function';

  const getSingle = (key) => {
    if (isFormData) {
      const value = raw.get(key);
      return value == null ? '' : String(value);
    }
    const value = raw?.[key];
    if (Array.isArray(value)) return value[0] == null ? '' : String(value[0]);
    return value == null ? '' : String(value);
  };

  const getList = (key) => {
    if (isFormData) {
      return raw.getAll(key).map((v) => String(v ?? ''));
    }
    const value = raw?.[key];
    if (Array.isArray(value)) return value.map((v) => String(v ?? ''));
    if (value !== undefined && value !== null) return [String(value)];
    return [];
  };

  const honeypot = getSingle('_website').trim();
  const isSpam = honeypot.length > 0;

  let productFamily = getSingle('product_family').trim();
  if (!productFamily) {
    productFamily = getList('product')
      .map((s) => s.trim())
      .filter(Boolean)
      .join(', ');
  }

  let scheduleItems = getSingle('schedule_items').trim();
  if (!scheduleItems) {
    const families = getList('item_family');
    const specs = getList('item_spec');
    const qtys = getList('item_qty');
    const rowCount = Math.max(families.length, specs.length, qtys.length);
    const lines = [];
    for (let i = 0; i < rowCount; i += 1) {
      const fam = (families[i] || '').trim();
      const spec = (specs[i] || '').trim();
      const qty = (qtys[i] || '').trim();
      if (spec || qty) {
        lines.push(`${fam || 'Item'}: ${qty || 'TBD'} — ${spec || 'standard spec'}`);
      }
    }
    scheduleItems = lines.join(' | ');
  }

  const clientEmail = cap(getSingle('client_email') || getSingle('email'), 254);
  const replyContactRaw = cap(getSingle('reply_contact') || getSingle('contact'), 300);
  const replyContact = replyContactRaw || clientEmail;

  const quote = {
    reference: cap(getSingle('reference'), 300) || generateReference(),
    product_family: cap(productFamily, 300),
    schedule_items: cap(scheduleItems || 'See specification summary', 4000),
    quantity: cap(getSingle('quantity'), 300),
    specifications: cap(getSingle('specifications') || getSingle('specification'), 3000),
    delivery_location: cap(getSingle('delivery_location') || getSingle('location'), 300),
    timeline: cap(getSingle('timeline'), 300) || 'To discuss',
    client_name: cap(getSingle('client_name') || getSingle('name'), 300),
    reply_contact: replyContact,
    client_email: clientEmail,
    submitted_at: cap(getSingle('submitted_at'), 300) || new Date().toISOString(),
  };

  return { quote, isSpam };
}

export function validateQuotePayload(quote = {}) {
  const missing = REQUIRED_FIELDS.filter((field) => !String(quote?.[field] ?? '').trim());
  return {
    valid: missing.length === 0,
    missing,
  };
}

function renderScheduleTableHtml(scheduleList) {
  if (!scheduleList.length) return '';
  const rows = scheduleList
    .map(
      (item, idx) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e3ece7;width:36px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;font-weight:700;color:#185a45;background:#f7faf8;vertical-align:top;">${String(idx + 1).padStart(2, '0')}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e3ece7;font-size:13.5px;line-height:1.5;color:#162620;vertical-align:top;">${escapeHtml(item)}</td>
      </tr>`,
    )
    .join('');

  return `
    <div style="margin-top:22px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#566861;margin-bottom:8px;">Itemised Material Schedule (BoQ)</div>
      <ol style="display:none;margin:0;padding:0;">${scheduleList.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ol>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #d6e0da;border-radius:6px;overflow:hidden;">
        ${rows}
      </table>
    </div>`;
}

function renderProductPillsHtml(productFamily) {
  const parts = String(productFamily || '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return escapeHtml(productFamily);
  return parts
    .map(
      (part) =>
        `<span style="display:inline-block;margin:2px 6px 2px 0;padding:4px 10px;background:#edf5f0;border:1px solid #c6dcd0;border-radius:999px;font-size:12.5px;font-weight:600;color:#124636;">${escapeHtml(part)}</span>`,
    )
    .join('');
}

function formatContactHtml(contact, clientEmail) {
  const parts = [];
  const phone = extractPhoneLinks(contact);
  const directEmail = extractEmail(contact);

  if (directEmail) {
    parts.push(
      `<a href="mailto:${escapeHtml(directEmail)}" style="color:#185a45;text-decoration:underline;font-weight:600;">${escapeHtml(directEmail)}</a>`,
    );
  } else if (phone) {
    parts.push(
      `<a href="tel:${escapeHtml(phone.tel)}" style="color:#185a45;text-decoration:underline;font-weight:600;">${escapeHtml(contact)}</a>`,
    );
  } else if (contact) {
    parts.push(escapeHtml(contact));
  }

  if (clientEmail && clientEmail.toLowerCase() !== String(directEmail || '').toLowerCase()) {
    parts.push(
      `<a href="mailto:${escapeHtml(clientEmail)}" style="color:#185a45;text-decoration:underline;font-weight:600;">${escapeHtml(clientEmail)}</a>`,
    );
  }

  return parts.join(' &nbsp;·&nbsp; ');
}

export function buildQuoteEmail(quote, env = process.env) {
  const cfg = getSmtpConfig(env);
  const origin = getSiteOrigin(env);
  const logoUrl = `${origin}/brand/logo-white.png`;
  const replyTo = resolveClientEmail(quote);
  const phone = extractPhoneLinks(quote.reply_contact);
  const formattedTime = formatKigaliTimestamp(quote.submitted_at);
  const from = sanitizeHeaderValue(cfg.from || (cfg.user ? `"FORTIMESH Rwanda" <${cfg.user}>` : DEFAULT_INBOX));
  const to = sanitizeHeaderValue(cfg.to);
  const subject = sanitizeHeaderValue(`Fortimesh Quote Request [${quote.reference}] — ${quote.product_family}`);

  const scheduleList = parseScheduleList(quote.schedule_items);
  const contactDisplay =
    quote.client_email && !String(quote.reply_contact || '').includes(quote.client_email)
      ? `${quote.reply_contact} | ${quote.client_email}`
      : quote.reply_contact;

  const textLines = [
    `${COMPANY_NAME} — MATERIAL QUOTE REQUEST`,
    `Reference: ${quote.reference}`,
    `Submitted: ${formattedTime} (${quote.submitted_at})`,
    '',
    `Client / Company: ${quote.client_name}`,
    `Reply Contact: ${contactDisplay}`,
    `Product Families: ${quote.product_family}`,
    `Total Quantity: ${quote.quantity}`,
    `Delivery / Collection: ${quote.delivery_location}`,
    `Target Timeline: ${quote.timeline}`,
    '',
    'Specifications & BoQ Notes:',
    quote.specifications,
  ];

  if (scheduleList.length > 0) {
    textLines.push('', 'Itemised Schedule:');
    scheduleList.forEach((item, idx) => {
      textLines.push(`  ${idx + 1}. ${item}`);
    });
  }

  const actionButtons = [];
  if (replyTo) {
    const mailSubj = encodeURIComponent(`Quotation ${quote.reference} — ${COMPANY_NAME}`);
    const mailBody = encodeURIComponent(
      `Dear ${quote.client_name},\n\nThank you for your material inquiry (${quote.reference}) with ${COMPANY_NAME}.\n\nPlease find our availability and quotation details below:\n\n`,
    );
    actionButtons.push(
      `<a href="mailto:${escapeHtml(replyTo)}?subject=${mailSubj}&amp;body=${mailBody}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;background:#185a45;color:#ffffff;text-decoration:none;border-radius:6px;font-size:13px;font-weight:700;">Reply by Email</a>`,
    );
  }
  if (phone) {
    const waText = encodeURIComponent(
      `Hello ${quote.client_name}, this is FORTIMESH AND STEELS RWANDA LTD regarding your quote request ${quote.reference} (${quote.quantity}).`,
    );
    actionButtons.push(
      `<a href="https://wa.me/${escapeHtml(phone.wa)}?text=${waText}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;background:#091713;color:#ffffff;text-decoration:none;border-radius:6px;font-size:13px;font-weight:700;">WhatsApp Client</a>`,
    );
    actionButtons.push(
      `<a href="tel:${escapeHtml(phone.tel)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;background:#ffffff;color:#091713;border:1px solid #cbd5e1;text-decoration:none;border-radius:6px;font-size:13px;font-weight:600;">Call ${escapeHtml(phone.display)}</a>`,
    );
  }

  const quickActionsHtml = actionButtons.length
    ? `<div style="padding:18px 28px;background:#f6f9f7;border-bottom:1px solid #dde7e1;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#566861;margin-bottom:10px;">Quick Sales Desk Actions</div>
        ${actionButtons.join('')}
      </div>`
    : '';

  const rowsHtml = [
    ['Client / Company', `<strong style="font-size:15px;color:#091713;">${escapeHtml(quote.client_name)}</strong>`],
    ['Reply Contact', formatContactHtml(quote.reply_contact, replyTo)],
    ['Product Families', renderProductPillsHtml(quote.product_family)],
    ['Total Quantity', `<strong style="color:#091713;">${escapeHtml(quote.quantity)}</strong>`],
    ['Delivery / Collection', escapeHtml(quote.delivery_location)],
    ['Target Timeline', escapeHtml(quote.timeline)],
    ['Submitted', escapeHtml(formattedTime)],
  ]
    .map(
      ([label, valueHtml]) => `
      <tr>
        <th style="text-align:left;vertical-align:top;padding:11px 14px;width:165px;background:#f8faf9;border-bottom:1px solid #e4ece7;color:#566861;font-size:12.5px;font-weight:600;">${escapeHtml(label)}</th>
        <td style="vertical-align:top;padding:11px 14px;border-bottom:1px solid #e4ece7;color:#162620;font-size:14px;line-height:1.5;">${valueHtml}</td>
      </tr>`,
    )
    .join('');

  const preheader = escapeHtml(
    `New quote request ${quote.reference} from ${quote.client_name} — ${quote.quantity} (${quote.product_family})`,
  );

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:24px 12px;background:#eef3f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#162620;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:660px;margin:0 auto;background:#ffffff;border:1px solid #d2ded8;border-radius:10px;overflow:hidden;box-shadow:0 4px 18px rgba(9,23,19,0.06);">
      <tr>
        <td style="height:4px;background:#185a45;font-size:0;line-height:0;">&nbsp;</td>
      </tr>
      <tr>
        <td style="background:#091713;padding:26px 28px;color:#ffffff;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align:middle;">
                <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(COMPANY_NAME)}" width="156" height="54" style="display:block;border:0;max-width:156px;height:auto;">
              </td>
              <td align="right" style="vertical-align:middle;">
                <span style="display:inline-block;padding:5px 11px;background:#123126;border:1px solid #2b6e55;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8fd183;">New Quote Lead</span>
              </td>
            </tr>
          </table>
          <h1 style="margin:20px 0 6px;font-size:22px;line-height:1.25;font-weight:700;color:#ffffff;">Material Quote Request</h1>
          <p style="margin:0 0 16px;font-size:13.5px;color:#b8ccc3;">Submitted via the online quote schedule builder · ${escapeHtml(
            replyTo ? `Client confirmation sent to ${replyTo}` : 'Phone/WhatsApp contact provided',
          )}</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#10251f;border:1px solid #214a3b;border-radius:8px;">
            <tr>
              <td style="padding:12px 16px;">
                <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8fd183;font-weight:700;">Quote Reference</div>
                <div style="margin-top:3px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:16px;font-weight:700;color:#ffffff;">${escapeHtml(quote.reference)}</div>
              </td>
              <td align="right" style="padding:12px 16px;">
                <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8fd183;font-weight:700;">Delivery / Pickup</div>
                <div style="margin-top:3px;font-size:13px;font-weight:600;color:#e2eee8;">${escapeHtml(quote.delivery_location)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>${quickActionsHtml}</td>
      </tr>
      <tr>
        <td style="padding:24px 28px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#566861;margin-bottom:10px;">Request Summary</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e4ece7;border-radius:6px;overflow:hidden;">
            ${rowsHtml}
          </table>

          ${renderScheduleTableHtml(scheduleList)}

          <div style="margin-top:22px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#566861;margin-bottom:8px;">Specifications, Grades &amp; BoQ Notes</div>
            <div style="padding:14px 16px;background:#f6f9f7;border:1px solid #dfe9e3;border-left:4px solid #185a45;border-radius:4px;font-size:14px;line-height:1.6;color:#162620;">${escapeHtml(
              quote.specifications,
            ).replace(/\r?\n/g, '<br>')}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;background:#f6f9f7;border-top:1px solid #dfe9e3;color:#566861;font-size:12px;line-height:1.5;">
          <strong>${escapeHtml(COMPANY_NAME)}</strong> · ${escapeHtml(COMPANY_ADDRESS)} · ${escapeHtml(COMPANY_PHONE)}
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    from,
    to,
    ...(replyTo ? { replyTo } : {}),
    subject,
    text: textLines.join('\n'),
    html,
  };
}

export function buildClientConfirmationEmail(quote, env = process.env) {
  const clientEmail = resolveClientEmail(quote);
  if (!clientEmail) return null;

  const cfg = getSmtpConfig(env);
  const origin = getSiteOrigin(env);
  const logoUrl = `${origin}/brand/logo-white.png`;
  const formattedTime = formatKigaliTimestamp(quote.submitted_at);
  const from = sanitizeHeaderValue(
    cfg.from || (cfg.user ? `"FORTIMESH AND STEELS RWANDA LTD" <${cfg.user}>` : DEFAULT_INBOX),
  );
  const replyTo = sanitizeHeaderValue(cfg.to || DEFAULT_INBOX);
  const subject = sanitizeHeaderValue(
    `We received your quote request [${quote.reference}] — FORTIMESH AND STEELS RWANDA LTD`,
  );

  const scheduleList = parseScheduleList(quote.schedule_items);
  const waFollowupText = encodeURIComponent(
    `Hello Fortimesh Rwanda, I just submitted online quote request ${quote.reference} (${quote.quantity}) and would like to confirm availability and pricing.`,
  );
  const waUrl = `https://wa.me/${COMPANY_WHATSAPP}?text=${waFollowupText}`;

  const textLines = [
    `Dear ${quote.client_name},`,
    '',
    `Thank you for requesting a material quotation from ${COMPANY_NAME}.`,
    `Our sales desk at ${COMPANY_ADDRESS} has received your request and is reviewing stock availability, technical grades, and unit pricing.`,
    '',
    `QUOTE REFERENCE: ${quote.reference}`,
    `SUBMITTED: ${formattedTime}`,
    '',
    'YOUR REQUEST SUMMARY',
    `- Product families: ${quote.product_family}`,
    `- Total quantity: ${quote.quantity}`,
    `- Delivery / collection: ${quote.delivery_location}`,
    `- Target timeline: ${quote.timeline}`,
    '',
    'Specifications & notes:',
    quote.specifications,
  ];

  if (scheduleList.length > 0) {
    textLines.push('', 'Itemised schedule:');
    scheduleList.forEach((item, idx) => {
      textLines.push(`  ${idx + 1}. ${item}`);
    });
  }

  textLines.push(
    '',
    'WHAT HAPPENS NEXT',
    '1. Stock & specification check: Our Gisozi team verifies dimensions, gauges, bar diameters, and batch availability.',
    '2. Itemised quotation / Proforma Invoice: We reply with unit pricing and delivery or yard pickup options.',
    '3. Dispatch or collection: Collect at KG 667 Street, Gisozi or schedule flatbed delivery to your site anywhere in Rwanda.',
    '',
    'HAVE DRAWINGS OR A PDF BOQ?',
    `Simply reply directly to this email and attach your PDF, Excel, or CAD schedule (quoting reference ${quote.reference}), or message us on WhatsApp: https://wa.me/${COMPANY_WHATSAPP}`,
    '',
    'Warm regards,',
    COMPANY_NAME,
    `"${COMPANY_TAGLINE}"`,
    COMPANY_ADDRESS,
    `Tel / WhatsApp: ${COMPANY_PHONE}`,
    `Email: ${replyTo}`,
    `Web: ${origin}`,
  );

  const summaryRowsHtml = [
    ['Product Families', renderProductPillsHtml(quote.product_family)],
    ['Total Quantity', `<strong style="color:#091713;">${escapeHtml(quote.quantity)}</strong>`],
    ['Delivery / Collection', escapeHtml(quote.delivery_location)],
    ['Target Timeline', escapeHtml(quote.timeline)],
    ['Prepared For', `<strong>${escapeHtml(quote.client_name)}</strong>`],
  ]
    .map(
      ([label, valueHtml]) => `
      <tr>
        <th style="text-align:left;vertical-align:top;padding:11px 14px;width:160px;background:#f8faf9;border-bottom:1px solid #e4ece7;color:#566861;font-size:12.5px;font-weight:600;">${escapeHtml(label)}</th>
        <td style="vertical-align:top;padding:11px 14px;border-bottom:1px solid #e4ece7;color:#162620;font-size:14px;line-height:1.5;">${valueHtml}</td>
      </tr>`,
    )
    .join('');

  const preheader = escapeHtml(
    `Quote reference ${quote.reference} received — our Gisozi, Kigali sales desk is preparing your itemised pricing.`,
  );

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:28px 12px;background:#eef3f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#162620;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:660px;margin:0 auto;background:#ffffff;border:1px solid #d2ded8;border-radius:12px;overflow:hidden;box-shadow:0 6px 24px rgba(9,23,19,0.07);">
      <tr>
        <td style="height:5px;background:#185a45;font-size:0;line-height:0;">&nbsp;</td>
      </tr>
      <tr>
        <td style="background:#091713;padding:30px 30px 28px;color:#ffffff;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align:middle;">
                <a href="${escapeHtml(origin)}" style="text-decoration:none;">
                  <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(COMPANY_NAME)}" width="164" height="57" style="display:block;border:0;max-width:164px;height:auto;">
                </a>
              </td>
              <td align="right" style="vertical-align:middle;">
                <span style="display:inline-block;padding:5px 12px;background:#123126;border:1px solid #2b6e55;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8fd183;">Request Received</span>
              </td>
            </tr>
          </table>

          <p style="margin:24px 0 6px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8fd183;font-weight:700;">Gisozi Stockyard · Kigali, Rwanda</p>
          <h1 style="margin:0 0 10px;font-size:24px;line-height:1.25;font-weight:700;color:#ffffff;">Thank you, ${escapeHtml(
            quote.client_name,
          )}.</h1>
          <p style="margin:0 0 22px;font-size:14.5px;line-height:1.6;color:#c7d8d0;">
            We have received your material quote request and logged it with our Kigali sales desk. Our team is verifying stock availability, section grades, and unit pricing for your schedule.
          </p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#10251f;border:1px solid #235040;border-radius:8px;">
            <tr>
              <td style="padding:14px 18px;">
                <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8fd183;font-weight:700;">Your Quote Reference</div>
                <div style="margin-top:4px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.03em;">${escapeHtml(
                  quote.reference,
                )}</div>
              </td>
              <td align="right" style="padding:14px 18px;">
                <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8fd183;font-weight:700;">Logged On</div>
                <div style="margin-top:4px;font-size:13px;font-weight:600;color:#e2eee8;">${escapeHtml(formattedTime)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="padding:28px 30px 24px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#185a45;margin-bottom:10px;">Your Submitted Material Summary</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e4ece7;border-radius:6px;overflow:hidden;">
            ${summaryRowsHtml}
          </table>

          ${renderScheduleTableHtml(scheduleList)}

          <div style="margin-top:20px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#566861;margin-bottom:8px;">Specifications &amp; Notes</div>
            <div style="padding:14px 16px;background:#f6f9f7;border:1px solid #dfe9e3;border-left:4px solid #185a45;border-radius:4px;font-size:13.5px;line-height:1.6;color:#162620;">${escapeHtml(
              quote.specifications,
            ).replace(/\r?\n/g, '<br>')}</div>
          </div>

          <div style="margin-top:28px;padding-top:24px;border-top:1px solid #e4ece7;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#185a45;margin-bottom:14px;">What Happens Next</div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="padding:0 0 12px;vertical-align:top;width:34px;">
                  <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:#edf5f0;border:1px solid #bdd6c8;font-size:11px;font-weight:700;color:#185a45;">01</span>
                </td>
                <td style="padding:0 0 12px;vertical-align:top;font-size:13.5px;line-height:1.55;color:#33473f;">
                  <strong style="color:#091713;">Stock &amp; grade verification</strong> — Our Gisozi team checks your section sizes, wall thicknesses, bar diameters, and batch availability.
                </td>
              </tr>
              <tr>
                <td style="padding:0 0 12px;vertical-align:top;width:34px;">
                  <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:#edf5f0;border:1px solid #bdd6c8;font-size:11px;font-weight:700;color:#185a45;">02</span>
                </td>
                <td style="padding:0 0 12px;vertical-align:top;font-size:13.5px;line-height:1.55;color:#33473f;">
                  <strong style="color:#091713;">Itemised quotation / Proforma Invoice</strong> — We respond with competitive unit pricing tailored to your project or tender requirements.
                </td>
              </tr>
              <tr>
                <td style="padding:0;vertical-align:top;width:34px;">
                  <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:#edf5f0;border:1px solid #bdd6c8;font-size:11px;font-weight:700;color:#185a45;">03</span>
                </td>
                <td style="padding:0;vertical-align:top;font-size:13.5px;line-height:1.55;color:#33473f;">
                  <strong style="color:#091713;">Yard collection or nationwide delivery</strong> — Pick up at KG 667 Street, Gisozi or coordinate direct truck dispatch anywhere in Rwanda.
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-top:26px;padding:20px 22px;background:#f6f9f7;border:1px solid #dce7e1;border-radius:8px;">
            <div style="font-size:14px;font-weight:700;color:#091713;margin-bottom:6px;">Need urgent pricing or want to attach a PDF / Excel BoQ?</div>
            <p style="margin:0 0 16px;font-size:13px;line-height:1.55;color:#4a5d55;">
              Simply <strong>reply directly to this email</strong> with your bar bending schedule, CAD drawings, or BoQ attached, or reach our sales desk immediately on WhatsApp:
            </p>
            <div>
              <a href="${escapeHtml(waUrl)}" style="display:inline-block;margin:0 10px 8px 0;padding:11px 18px;background:#185a45;color:#ffffff;text-decoration:none;border-radius:6px;font-size:13px;font-weight:700;">Chat on WhatsApp (${escapeHtml(
                COMPANY_PHONE,
              )})</a>
              <a href="tel:+250793086644" style="display:inline-block;margin:0 10px 8px 0;padding:11px 18px;background:#ffffff;color:#091713;border:1px solid #c6d4cd;text-decoration:none;border-radius:6px;font-size:13px;font-weight:600;">Call Sales Desk</a>
            </div>
          </div>
        </td>
      </tr>

      <tr>
        <td style="background:#091713;padding:22px 30px;color:#9eb5ab;font-size:12px;line-height:1.6;">
          <div style="font-weight:700;color:#ffffff;font-size:13px;">${escapeHtml(COMPANY_NAME)}</div>
          <div style="font-style:italic;color:#8fd183;margin-bottom:8px;">&ldquo;${escapeHtml(COMPANY_TAGLINE)}&rdquo;</div>
          <div>${escapeHtml(COMPANY_ADDRESS)} &nbsp;·&nbsp; <a href="${escapeHtml(
            COMPANY_MAPS_URL,
          )}" style="color:#c7d8d0;text-decoration:underline;">View on Google Maps</a></div>
          <div>Tel / WhatsApp: <a href="tel:+250793086644" style="color:#c7d8d0;text-decoration:none;">${escapeHtml(
            COMPANY_PHONE,
          )}</a> &nbsp;·&nbsp; Email: <a href="mailto:${escapeHtml(
            replyTo,
          )}" style="color:#c7d8d0;text-decoration:none;">${escapeHtml(replyTo)}</a></div>
          <div style="margin-top:6px;">
            <a href="${escapeHtml(origin)}/products/" style="color:#8fd183;text-decoration:underline;">Product Catalogue</a> &nbsp;·&nbsp;
            <a href="${escapeHtml(COMPANY_INSTAGRAM_URL)}" style="color:#8fd183;text-decoration:underline;">Instagram @fortimesh_rwanda</a>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    from,
    to: sanitizeHeaderValue(clientEmail),
    replyTo,
    subject,
    text: textLines.join('\n'),
    html,
  };
}

export function createTransporter(env = process.env) {
  const cfg = getSmtpConfig(env);
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

export async function sendQuoteEmail(quote, { env = process.env, transporter, sendClientConfirmation = true } = {}) {
  const cfg = getSmtpConfig(env);
  const activeTransporter = transporter || createTransporter(env);
  const mail = buildQuoteEmail(quote, env);
  const info = await activeTransporter.sendMail(mail);

  let confirmationSent = false;
  let confirmationMessageId = null;
  let confirmationTo = null;

  if (sendClientConfirmation && String(env.SMTP_SEND_CLIENT_CONFIRMATION ?? 'true').toLowerCase() !== 'false') {
    const clientMail = buildClientConfirmationEmail(quote, env);
    if (clientMail) {
      confirmationTo = clientMail.to;
      try {
        const confirmInfo = await activeTransporter.sendMail(clientMail);
        confirmationSent = true;
        confirmationMessageId = confirmInfo?.messageId || null;
      } catch (err) {
        console.error('[mailer] Client confirmation email failed:', {
          to: clientMail.to,
          code: err?.code || 'UNKNOWN',
          message: err?.message || 'Unknown error',
        });
      }
    }
  }

  return {
    messageId: info?.messageId || null,
    accepted: info?.accepted || [],
    rejected: info?.rejected || [],
    response: info?.response || '',
    to: cfg.to,
    confirmationSent,
    confirmationMessageId,
    confirmationTo,
  };
}

export async function verifySmtpConnection(env = process.env, { transporter } = {}) {
  const cfg = getSmtpConfig(env);
  if (!isSmtpConfigured(env)) {
    throw new Error('Google SMTP credentials are not configured (missing SMTP_USER or SMTP_PASS).');
  }
  const activeTransporter = transporter || createTransporter(env);
  await activeTransporter.verify();
  return {
    ok: true,
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    user: cfg.user,
    to: cfg.to,
  };
}
