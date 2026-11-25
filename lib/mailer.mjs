import nodemailer from 'nodemailer';

const DEFAULT_INBOX = 'fortimeshrwanda@gmail.com';
const DEFAULT_HOST = 'smtp.gmail.com';
const DEFAULT_PORT = 465;

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
  const from = String(env.SMTP_FROM || (user ? `"FORTIMESH Website" <${user}>` : '')).trim();

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

  const quote = {
    reference: cap(getSingle('reference'), 300) || generateReference(),
    product_family: cap(productFamily, 300),
    schedule_items: cap(scheduleItems || 'See specification summary', 4000),
    quantity: cap(getSingle('quantity'), 300),
    specifications: cap(getSingle('specifications') || getSingle('specification'), 3000),
    delivery_location: cap(getSingle('delivery_location') || getSingle('location'), 300),
    timeline: cap(getSingle('timeline'), 300) || 'To discuss',
    client_name: cap(getSingle('client_name') || getSingle('name'), 300),
    reply_contact: cap(getSingle('reply_contact') || getSingle('contact'), 300),
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

function formatContactHtml(contact) {
  const email = extractEmail(contact);
  const safeText = escapeHtml(contact);
  if (email) {
    return `<a href="mailto:${escapeHtml(email)}" style="color:#185a45;text-decoration:underline;font-weight:600;">${safeText}</a>`;
  }
  const phoneChars = String(contact || '').trim();
  if (/^[+\d][\d\s()-]{6,}$/.test(phoneChars)) {
    const telHref = phoneChars.replace(/[^\d+]/g, '');
    return `<a href="tel:${escapeHtml(telHref)}" style="color:#185a45;text-decoration:underline;font-weight:600;">${safeText}</a>`;
  }
  return safeText;
}

export function buildQuoteEmail(quote, env = process.env) {
  const cfg = getSmtpConfig(env);
  const replyTo = extractEmail(quote.reply_contact);
  const from = sanitizeHeaderValue(cfg.from || (cfg.user ? `"FORTIMESH Website" <${cfg.user}>` : DEFAULT_INBOX));
  const to = sanitizeHeaderValue(cfg.to);
  const subject = sanitizeHeaderValue(`Fortimesh Quote Request [${quote.reference}] — ${quote.product_family}`);

  const hasSchedule =
    quote.schedule_items &&
    quote.schedule_items !== 'See specification summary' &&
    quote.schedule_items.trim().length > 0;
  const scheduleList = hasSchedule
    ? quote.schedule_items
        .split(/\s*\|\s*/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const textLines = [
    'FORTIMESH AND STEELS RWANDA LTD — MATERIAL QUOTE REQUEST',
    `Reference: ${quote.reference}`,
    `Submitted: ${quote.submitted_at}`,
    '',
    `Client / Company: ${quote.client_name}`,
    `Reply Contact: ${quote.reply_contact}`,
    `Product Families: ${quote.product_family}`,
    `Total Quantity: ${quote.quantity}`,
    `Delivery / Collection: ${quote.delivery_location}`,
    `Timeline: ${quote.timeline}`,
    '',
    'Specifications:',
    quote.specifications,
  ];

  if (scheduleList.length > 0) {
    textLines.push('', 'Itemised Schedule:');
    scheduleList.forEach((item, idx) => {
      textLines.push(`  ${idx + 1}. ${item}`);
    });
  }

  const rowsHtml = [
    ['Reference', `<strong>${escapeHtml(quote.reference)}</strong>`],
    ['Client / Company', escapeHtml(quote.client_name)],
    ['Reply Contact', formatContactHtml(quote.reply_contact)],
    ['Product Families', escapeHtml(quote.product_family)],
    ['Total Quantity', escapeHtml(quote.quantity)],
    ['Delivery / Collection', escapeHtml(quote.delivery_location)],
    ['Timeline', escapeHtml(quote.timeline)],
    [
      'Specifications',
      `<div style="white-space:normal;line-height:1.55;">${escapeHtml(quote.specifications).replace(/\r?\n/g, '<br>')}</div>`,
    ],
  ];

  if (scheduleList.length > 0) {
    const itemsHtml = scheduleList
      .map((item) => `<li style="margin:4px 0;">${escapeHtml(item)}</li>`)
      .join('');
    rowsHtml.push(['Itemised Schedule', `<ol style="margin:0;padding-left:20px;">${itemsHtml}</ol>`]);
  }

  rowsHtml.push(['Submitted At', escapeHtml(quote.submitted_at)]);

  const tableRowsHtml = rowsHtml
    .map(
      ([label, valueHtml]) => `
        <tr>
          <th style="text-align:left;vertical-align:top;padding:12px 16px;width:190px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#334155;font-size:13px;font-weight:600;">${escapeHtml(label)}</th>
          <td style="vertical-align:top;padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;line-height:1.5;">${valueHtml}</td>
        </tr>`,
    )
    .join('');

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f3f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#162620;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #d6e0da;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="background:#091713;border-bottom:4px solid #185a45;padding:20px 24px;color:#ffffff;">
          <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#6fa866;font-weight:700;margin-bottom:6px;">FORTIMESH AND STEELS RWANDA LTD</div>
          <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">New Material Quote Request</h1>
          <div style="margin-top:10px;display:inline-block;background:#10251f;border:1px solid #185a45;color:#d6e0da;font-family:monospace;font-size:13px;padding:4px 10px;border-radius:4px;">Ref: ${escapeHtml(quote.reference)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            ${tableRowsHtml}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 24px;background:#f3f6f4;color:#566861;font-size:12px;">
          Sent via the Fortimesh Rwanda website quote request form (KG 667 Street, Gisozi, Kigali, Rwanda · +250 793 086 644).
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

export async function sendQuoteEmail(quote, { env = process.env, transporter } = {}) {
  const cfg = getSmtpConfig(env);
  const activeTransporter = transporter || createTransporter(env);
  const mail = buildQuoteEmail(quote, env);
  const info = await activeTransporter.sendMail(mail);
  return {
    messageId: info?.messageId || null,
    accepted: info?.accepted || [],
    rejected: info?.rejected || [],
    response: info?.response || '',
    to: cfg.to,
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
