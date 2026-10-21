export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const {
      reference = `FM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
      product_family = '',
      quantity = '',
      specifications = '',
      delivery_location = '',
      timeline = 'To discuss',
      client_name = '',
      reply_contact = '',
    } = body;

    if (!product_family || !quantity || !specifications || !delivery_location || !client_name || !reply_contact) {
      return res.status(400).json({ ok: false, error: 'Missing required quote fields.' });
    }

    const payload = {
      _subject: `Fortimesh Quote Request [${reference}] — ${product_family}`,
      _template: 'table',
      _captcha: 'false',
      reference,
      product_family,
      quantity,
      specifications,
      delivery_location,
      timeline,
      client_name,
      reply_contact,
      submitted_at: new Date().toISOString(),
    };

    // Optional custom webhook (e.g. Slack, Make, Zapier, Resend) if configured in Vercel env vars
    if (process.env.QUOTE_WEBHOOK_URL) {
      await fetch(process.env.QUOTE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);
    }

    // Forward to FormSubmit sales inbox
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

    return res.status(200).json({
      ok: true,
      reference,
      receivedAt: payload.submitted_at,
      upstreamStatus: upstream?.status ?? null,
      note: upstreamJson?.message || 'Quote request recorded.',
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Unable to process quote request.' });
  }
}
