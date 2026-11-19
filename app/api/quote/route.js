import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

const escHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function buildQuoteEmailHtml(payload) {
  const items = String(payload.schedule_items || '')
    .split('|')
    .map((x) => x.trim())
    .filter(Boolean);

  const itemsHtml = items.length
    ? `<ul style="margin:8px 0 0;padding-left:18px;color:#162620">${items
        .map((item) => `<li style="margin-bottom:4px">${escHtml(item)}</li>`)
        .join('')}</ul>`
    : `<p style="margin:4px 0 0;color:#566861">${escHtml(payload.schedule_items)}</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${escHtml(payload._subject)}</title></head>
<body style="margin:0;padding:24px;background:#f3f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#162620">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d6e0da">
    <div style="background:#091713;border-bottom:4px solid #185a45;padding:24px 28px;color:#ffffff">
      <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#6fa866;font-weight:700">FORTIMESH AND STEELS RWANDA LTD</p>
      <h1 style="margin:8px 0 4px;font-size:22px;font-weight:700;color:#ffffff">New Material Quote Request</h1>
      <p style="margin:0;font-size:13px;color:#d6e0da">Reference: <strong>${escHtml(payload.reference)}</strong> · Submitted ${escHtml(payload.submitted_at)}</p>
    </div>
    <div style="padding:26px 28px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#566861;width:170px;vertical-align:top"><strong>Client / Company</strong></td>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#162620"><strong>${escHtml(payload.client_name)}</strong></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#566861;vertical-align:top"><strong>Reply Contact</strong></td>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#185a45;font-weight:600">${escHtml(payload.reply_contact)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#566861;vertical-align:top"><strong>Product Families</strong></td>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#162620">${escHtml(payload.product_family)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#566861;vertical-align:top"><strong>Total Quantity</strong></td>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#162620"><strong>${escHtml(payload.quantity)}</strong></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#566861;vertical-align:top"><strong>Itemised Schedule</strong></td>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#162620">${itemsHtml}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#566861;vertical-align:top"><strong>Specifications &amp; Notes</strong></td>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#162620;white-space:pre-wrap">${escHtml(payload.specifications)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#566861;vertical-align:top"><strong>Delivery / Collection</strong></td>
          <td style="padding:10px 0;border-bottom:1px solid #e6ede9;color:#162620">${escHtml(payload.delivery_location)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#566861;vertical-align:top"><strong>Target Timeline</strong></td>
          <td style="padding:10px 0;color:#162620">${escHtml(payload.timeline)}</td>
        </tr>
      </table>
    </div>
    <div style="background:#f3f6f4;border-top:1px solid #d6e0da;padding:16px 28px;font-size:12px;color:#566861">
      FORTIMESH AND STEELS RWANDA LTD · KG 667 Street, Gisozi, Kigali, Rwanda · +250 793 086 644
    </div>
  </div>
</body>
</html>`;
}

function buildQuoteEmailText(payload) {
  return [
    `FORTIMESH MATERIAL QUOTE REQUEST (${payload.reference})`,
    `Submitted: ${payload.submitted_at}`,
    '',
    `Client / Company: ${payload.client_name}`,
    `Reply Contact: ${payload.reply_contact}`,
    '',
    `Product Families: ${payload.product_family}`,
    `Total Quantity: ${payload.quantity}`,
    `Itemised Schedule: ${payload.schedule_items}`,
    `Specifications & Notes: ${payload.specifications}`,
    '',
    `Delivery / Collection: ${payload.delivery_location}`,
    `Target Timeline: ${payload.timeline}`,
  ].join('\n');
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      reference = `FM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
      product_family = '',
      schedule_items = 'See specification summary',
      quantity = '',
      specifications = '',
      delivery_location = '',
      timeline = 'To discuss',
      client_name = '',
      reply_contact = '',
    } = body;

    if (
      !product_family ||
      !quantity ||
      !specifications ||
      !delivery_location ||
      !client_name ||
      !reply_contact
    ) {
      return NextResponse.json(
        { ok: false, error: 'Missing required quote fields.' },
        { status: 400, headers: corsHeaders },
      );
    }

    const payload = {
      _subject: `Fortimesh Quote Request [${reference}] — ${product_family}`,
      _template: 'table',
      _captcha: 'false',
      reference,
      product_family,
      schedule_items,
      quantity,
      specifications,
      delivery_location,
      timeline,
      client_name,
      reply_contact,
      submitted_at: new Date().toISOString(),
    };

    if (process.env.QUOTE_WEBHOOK_URL) {
      await fetch(process.env.QUOTE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);
    }

    const targetEmail = process.env.QUOTE_INBOX_EMAIL || 'fortimeshrwanda@gmail.com';
    const resendApiKey = (process.env.RESEND_API_KEY || '').trim();

    /* ---------- 1. Primary Delivery via Resend API ---------- */
    if (resendApiKey && !resendApiKey.startsWith('re_YOUR_')) {
      const fromAddress =
        process.env.RESEND_FROM_EMAIL || 'Fortimesh Quotes <onboarding@resend.dev>';
      const emailMatch = String(reply_contact).match(/[^\s,;<>]+@[^\s,;<>]+\.[^\s,;<>]+/);

      const resendBody = {
        from: fromAddress,
        to: [targetEmail],
        subject: payload._subject,
        html: buildQuoteEmailHtml(payload),
        text: buildQuoteEmailText(payload),
      };
      if (emailMatch) {
        resendBody.reply_to = emailMatch[0];
      }

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resendBody),
      });

      const resendJson = await resendRes.json().catch(() => ({}));

      if (!resendRes.ok) {
        return NextResponse.json(
          {
            ok: false,
            provider: 'resend',
            status: resendRes.status,
            error: resendJson?.message || 'Resend API rejected the email request.',
          },
          { status: resendRes.status, headers: corsHeaders },
        );
      }

      return NextResponse.json(
        {
          ok: true,
          provider: 'resend',
          emailId: resendJson?.id || null,
          reference,
          receivedAt: payload.submitted_at,
          note: 'Quote request sent via Resend.',
        },
        { status: 200, headers: corsHeaders },
      );
    }

    /* ---------- 2. Fallback Delivery via FormSubmit ---------- */
    const upstream = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'https://fortimeshrwanda.vercel.app',
        Referer: 'https://fortimeshrwanda.vercel.app/quote/',
      },
      body: JSON.stringify(payload),
    }).catch(() => null);

    const upstreamJson = upstream ? await upstream.json().catch(() => ({})) : {};

    return NextResponse.json(
      {
        ok: true,
        provider: 'formsubmit',
        reference,
        receivedAt: payload.submitted_at,
        upstreamStatus: upstream?.status ?? null,
        note: upstreamJson?.message || 'Quote request recorded.',
      },
      { status: 200, headers: corsHeaders },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to process quote request.' },
      { status: 500, headers: corsHeaders },
    );
  }
}
