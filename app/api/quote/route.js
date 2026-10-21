import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

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
