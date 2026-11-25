import fs from 'node:fs';
import path from 'node:path';
import {
  getSmtpConfig,
  isSmtpConfigured,
  normalizeQuotePayload,
  sendQuoteEmail,
  verifySmtpConnection,
} from '../lib/mailer.mjs';

const root = path.resolve(import.meta.dirname, '..');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex <= 0) continue;
    const key = line.slice(0, eqIndex).trim().replace(/^export\s+/, '');
    if (!key || Object.prototype.hasOwnProperty.call(process.env, key)) continue;

    let value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    } else {
      const commentIdx = value.indexOf(' #');
      if (commentIdx !== -1) {
        value = value.slice(0, commentIdx).trim();
      }
    }
    process.env[key] = value;
  }
}

function parseArgs(argv) {
  let sendTest = false;
  let toOverride = '';

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--send-test') {
      sendTest = true;
    } else if (arg.startsWith('--to=')) {
      toOverride = arg.slice('--to='.length).trim();
    } else if (arg === '--to' && argv[i + 1]) {
      toOverride = argv[i + 1].trim();
      i += 1;
    }
  }

  return { sendTest, toOverride };
}

async function main() {
  loadEnvFile(path.join(root, '.env.local'));
  loadEnvFile(path.join(root, '.env'));

  const { sendTest, toOverride } = parseArgs(process.argv.slice(2));
  const env = toOverride ? { ...process.env, QUOTE_INBOX_EMAIL: toOverride } : process.env;

  if (!isSmtpConfigured(env)) {
    console.log('Google SMTP is not configured yet.');
    console.log('');
    console.log('Setup steps:');
    console.log('1. Copy .env.example to .env.local');
    console.log('2. Enable 2-Step Verification on your Google Account (e.g. fortimeshrwanda@gmail.com)');
    console.log('3. Create a 16-character App Password at https://myaccount.google.com/apppasswords');
    console.log('4. Set SMTP_USER and SMTP_PASS in .env.local, then re-run: npm run verify:smtp');
    process.exitCode = 1;
    return;
  }

  const cfg = getSmtpConfig(env);
  if (cfg.pass === 'your-16-char-google-app-password') {
    console.log('SMTP_PASS is still set to the placeholder value from .env.example.');
    console.log('Replace SMTP_PASS in .env.local with a real 16-character Google App Password and re-run.');
    process.exitCode = 1;
    return;
  }

  console.log(`Verifying Google SMTP connection to ${cfg.host}:${cfg.port} (secure=${cfg.secure}) as ${cfg.user}...`);
  const verified = await verifySmtpConnection(env);
  console.log(`SMTP connection verified OK. Target quote inbox: ${verified.to}`);

  if (sendTest) {
    const { quote } = normalizeQuotePayload({
      product_family: 'Gabion mesh, Reinforcement materials',
      schedule_items: 'Gabion mesh: 10 boxes — 2m x 1m x 1m | Reinforcement materials: 50 bars — D12 12m',
      quantity: '10 gabion boxes + 50 D12 bars',
      specifications: 'Automated Google SMTP verification test message from Fortimesh website.',
      delivery_location: 'KG 667 Street, Gisozi, Kigali (SMTP verification test)',
      timeline: 'Verification test only',
      client_name: 'Fortimesh SMTP Verification Script',
      reply_contact: cfg.user,
    });

    console.log(`Sending test quote email [${quote.reference}] to ${verified.to}...`);
    const result = await sendQuoteEmail(quote, { env });
    console.log(`Test quote email sent! messageId=${result.messageId || 'n/a'} accepted=${result.accepted.join(', ')}`);
  }
}

main().catch((err) => {
  console.error('Google SMTP verification failed:', err?.code || 'ERROR', err?.message || err);
  process.exitCode = 1;
});
