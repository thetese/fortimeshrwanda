import { NextResponse } from 'next/server';
import {
  escapeHtml,
  isSmtpConfigured,
  normalizeQuotePayload,
  resolveClientEmail,
  sendQuoteEmail,
  validateQuotePayload,
} from '../../../lib/mailer.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_IP = 8;
const MAX_CONFIRMATIONS_PER_EMAIL = 4;
const ipHits = new Map();
const recipientHits = new Map();

function countRecentHits(store, key, maxHits, now = Date.now()) {
  if (!key) return { allowed: true };
  if (store.size > 500) {
    for (const [k, timestamps] of store.entries()) {
      const fresh = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
      if (fresh.length) store.set(k, fresh);
      else store.delete(k);
    }
  }
  const recent = (store.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= maxHits) {
    store.set(key, recent);
    return { allowed: false };
  }
  recent.push(now);
  store.set(key, recent);
  return { allowed: true };
}

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function htmlResponse({ title, heading, message, reference, status = 200 }) {
  const refBadge = reference
    ? `<p style="font-family:monospace;background:#f1f5f9;display:inline-block;padding:6px 12px;border-radius:4px;border:1px solid #cbd5e1;color:#0f172a;">Reference: <strong>${escapeHtml(reference)}</strong></p>`
    : '';

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(title)} | Fortimesh Rwanda</title>
  </head>
  <body style="margin:0;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#091713;color:#f3f6f4;">
    <main style="max-width:560px;margin:40px auto;background:#ffffff;color:#162620;padding:32px;border-radius:10px;border-top:4px solid #185a45;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#185a45;font-weight:700;">FORTIMESH AND STEELS RWANDA LTD</p>
      <h1 style="margin:0 0 12px;font-size:24px;">${escapeHtml(heading)}</h1>
      ${refBadge}
      <p style="line-height:1.6;color:#334155;">${escapeHtml(message)}</p>
      <p style="margin-top:24px;">
        <a href="/quote/" style="display:inline-block;padding:10px 18px;background:#185a45;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">Return to Quote Page</a>
        <a href="https://wa.me/250793086644" style="display:inline-block;margin-left:10px;padding:10px 18px;border:1px solid #cbd5e1;color:#0f172a;text-decoration:none;border-radius:6px;font-weight:600;">WhatsApp Sales Desk</a>
      </p>
    </main>
  </body>
</html>`;

  return new NextResponse(html, {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      provider: 'google-smtp',
      configured: isSmtpConfigured(),
      clientConfirmation: true,
    },
    { status: 200, headers: corsHeaders },
  );
}

export async function POST(request) {
  let wantsHtml = false;

  try {
    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    const accept = (request.headers.get('accept') || '').toLowerCase();
    const isFormSubmit =
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data');
    wantsHtml = isFormSubmit && !accept.includes('application/json');

    const rawBody = isFormSubmit
      ? await request.formData()
      : await request.json().catch(() => ({}));

    const { quote, isSpam } = normalizeQuotePayload(rawBody);

    if (isSpam) {
      if (wantsHtml) {
        return htmlResponse({
          title: 'Quote Request Received',
          heading: 'Quote request received',
          message: 'Thank you. Your inquiry has been recorded.',
          reference: quote.reference,
          status: 200,
        });
      }
      return NextResponse.json(
        {
          ok: true,
          provider: 'google-smtp',
          reference: quote.reference,
          receivedAt: quote.submitted_at,
          note: 'Quote request recorded.',
        },
        { status: 200, headers: corsHeaders },
      );
    }

    const { valid, missing } = validateQuotePayload(quote);
    if (!valid) {
      if (wantsHtml) {
        return htmlResponse({
          title: 'Missing Required Fields',
          heading: 'Please complete all required fields',
          message: `Missing required quote information: ${missing.join(', ')}. Please go back and complete the form, or contact us directly on WhatsApp (+250 793 086 644).`,
          status: 400,
        });
      }
      return NextResponse.json(
        { ok: false, error: 'Missing required quote fields.', missing },
        { status: 400, headers: corsHeaders },
      );
    }

    const clientIp = getClientIp(request);
    if (clientIp !== 'unknown' && !countRecentHits(ipHits, clientIp, MAX_REQUESTS_PER_IP).allowed) {
      const rateMsg =
        'Too many quote submissions in a short period. Please wait a few minutes or message us on WhatsApp (+250 793 086 644).';
      if (wantsHtml) {
        return htmlResponse({
          title: 'Too Many Requests',
          heading: 'Please wait a moment before submitting again',
          message: rateMsg,
          reference: quote.reference,
          status: 429,
        });
      }
      return NextResponse.json(
        { ok: false, error: rateMsg },
        { status: 429, headers: corsHeaders },
      );
    }

    if (process.env.QUOTE_WEBHOOK_URL) {
      await fetch(process.env.QUOTE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quote,
          _subject: `Fortimesh Quote Request [${quote.reference}] — ${quote.product_family}`,
        }),
      }).catch(() => null);
    }

    if (!isSmtpConfigured()) {
      console.error('[api/quote] Google SMTP is not configured (missing SMTP_USER or SMTP_PASS).');
      const errorMsg =
        'Google SMTP is not configured on this server. Please send your request via WhatsApp or email app.';
      if (wantsHtml) {
        return htmlResponse({
          title: 'Email Delivery Unavailable',
          heading: 'Direct email delivery is not configured',
          message: errorMsg,
          reference: quote.reference,
          status: 503,
        });
      }
      return NextResponse.json(
        { ok: false, error: errorMsg },
        { status: 503, headers: corsHeaders },
      );
    }

    const clientEmail = resolveClientEmail(quote)?.toLowerCase() || '';
    const allowClientConfirmation = clientEmail
      ? countRecentHits(recipientHits, clientEmail, MAX_CONFIRMATIONS_PER_EMAIL).allowed
      : false;

    let info;
    try {
      info = await sendQuoteEmail(quote, { sendClientConfirmation: allowClientConfirmation });
    } catch (err) {
      console.error('[api/quote] Google SMTP send failed:', {
        code: err?.code || 'UNKNOWN',
        message: err?.message || 'Unknown SMTP error',
      });
      const errorMsg =
        'Unable to send quote email right now. Please send via WhatsApp or open in your email app.';
      if (wantsHtml) {
        return htmlResponse({
          title: 'Email Delivery Failed',
          heading: 'Unable to send quote email right now',
          message: errorMsg,
          reference: quote.reference,
          status: 502,
        });
      }
      return NextResponse.json(
        { ok: false, error: errorMsg },
        { status: 502, headers: corsHeaders },
      );
    }

    if (wantsHtml) {
      const confirmNote =
        info.confirmationSent && info.confirmationTo
          ? ` We also sent a confirmation copy to ${info.confirmationTo}.`
          : '';
      return htmlResponse({
        title: 'Quote Request Sent',
        heading: 'Quote request sent to Fortimesh sales desk',
        message: `Your material request has been delivered by email to our Gisozi, Kigali sales desk.${confirmNote} For immediate dispatch confirmation, message us on WhatsApp.`,
        reference: quote.reference,
        status: 200,
      });
    }

    return NextResponse.json(
      {
        ok: true,
        provider: 'google-smtp',
        reference: quote.reference,
        messageId: info.messageId,
        confirmationSent: info.confirmationSent,
        confirmationTo: info.confirmationTo,
        confirmationMessageId: info.confirmationMessageId,
        receivedAt: quote.submitted_at,
        note: info.confirmationSent
          ? `Quote request sent to sales desk and confirmation sent to ${info.confirmationTo}.`
          : 'Quote request sent via Google SMTP.',
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (err) {
    console.error('[api/quote] Unexpected quote request error:', {
      code: err?.code || 'INTERNAL',
      message: err?.message || 'Unexpected error',
    });
    if (wantsHtml) {
      return htmlResponse({
        title: 'Quote Request Error',
        heading: 'Unable to process quote request',
        message:
          'Something went wrong while processing your request. Please return to the quote page or contact us on WhatsApp (+250 793 086 644).',
        status: 500,
      });
    }
    return NextResponse.json(
      { ok: false, error: 'Unable to process quote request.' },
      { status: 500, headers: corsHeaders },
    );
  }
}
