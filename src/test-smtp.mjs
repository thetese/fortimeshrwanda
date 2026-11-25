import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildQuoteEmail,
  extractEmail,
  getSmtpConfig,
  isSmtpConfigured,
  normalizeQuotePayload,
  sendQuoteEmail,
  validateQuotePayload,
  verifySmtpConnection,
} from '../lib/mailer.mjs';

describe('getSmtpConfig & isSmtpConfigured', () => {
  it('uses Google SMTP defaults (smtp.gmail.com:465, secure=true)', () => {
    const cfg = getSmtpConfig({});
    assert.equal(cfg.host, 'smtp.gmail.com');
    assert.equal(cfg.port, 465);
    assert.equal(cfg.secure, true);
    assert.equal(cfg.user, '');
    assert.equal(cfg.pass, '');
    assert.equal(cfg.to, 'fortimeshrwanda@gmail.com');
    assert.equal(isSmtpConfigured({}), false);
  });

  it('defaults secure=false on port 587 and respects explicit SMTP_SECURE overrides', () => {
    const port587 = getSmtpConfig({ SMTP_PORT: '587', SMTP_USER: 'a@gmail.com', SMTP_PASS: 'secret' });
    assert.equal(port587.port, 587);
    assert.equal(port587.secure, false);

    const forcedTrue = getSmtpConfig({ SMTP_PORT: '587', SMTP_SECURE: 'true' });
    assert.equal(forcedTrue.secure, true);

    const forcedFalse = getSmtpConfig({ SMTP_PORT: '465', SMTP_SECURE: '0' });
    assert.equal(forcedFalse.secure, false);
  });

  it('strips spaces in Google App Passwords while keeping non-Google passwords trimmed only', () => {
    const gmailCfg = getSmtpConfig({
      SMTP_USER: 'fortimeshrwanda@gmail.com',
      SMTP_PASS: 'abcd efgh ijkl mnop',
    });
    assert.equal(gmailCfg.pass, 'abcdefghijklmnop');
    assert.equal(isSmtpConfigured({
      SMTP_USER: 'fortimeshrwanda@gmail.com',
      SMTP_PASS: 'abcd efgh ijkl mnop',
    }), true);

    const customCfg = getSmtpConfig({
      SMTP_HOST: 'mail.example.com',
      SMTP_USER: 'sales@example.com',
      SMTP_PASS: '  pass word 123  ',
    });
    assert.equal(customCfg.pass, 'pass word 123');
  });

  it('supports fallback Gmail env var names and custom inbox/from', () => {
    const cfg = getSmtpConfig({
      GMAIL_USER: 'fallback@gmail.com',
      GMAIL_APP_PASSWORD: 'qwer tyui opas dfgh',
      QUOTE_INBOX_EMAIL: 'desk@fortimesh.rw',
      SMTP_FROM: '"Sales Bot" <fallback@gmail.com>',
    });
    assert.equal(cfg.user, 'fallback@gmail.com');
    assert.equal(cfg.pass, 'qwertyuiopasdfgh');
    assert.equal(cfg.to, 'desk@fortimesh.rw');
    assert.equal(cfg.from, '"Sales Bot" <fallback@gmail.com>');
  });
});

describe('normalizeQuotePayload & validateQuotePayload', () => {
  it('normalizes JSON payload and validates required fields', () => {
    const { quote, isSpam } = normalizeQuotePayload({
      reference: 'FM-20261125-1234',
      product_family: 'Gabion mesh, Steel wire products',
      schedule_items: 'Gabion mesh: 20 boxes — 2x1x1m',
      quantity: '20 boxes',
      specifications: '2m x 1m x 1m PVC coated',
      delivery_location: 'Kigali',
      timeline: 'This week',
      client_name: 'Kigali Builders',
      reply_contact: 'buyer@kigalibuilders.rw',
    });

    assert.equal(isSpam, false);
    assert.equal(quote.reference, 'FM-20261125-1234');
    assert.equal(quote.product_family, 'Gabion mesh, Steel wire products');
    assert.equal(validateQuotePayload(quote).valid, true);
  });

  it('normalizes HTML form fields and FormData instances', () => {
    const fd = new FormData();
    fd.append('product', 'gabion-mesh');
    fd.append('product', 'reinforcement-steel');
    fd.append('item_family', 'Gabion mesh');
    fd.append('item_spec', '2x1x1m');
    fd.append('item_qty', '15 boxes');
    fd.append('item_family', 'Reinforcement materials');
    fd.append('item_spec', '');
    fd.append('item_qty', '');
    fd.set('quantity', '15 boxes');
    fd.set('specification', 'Galvanised baskets');
    fd.set('location', 'Musanze');
    fd.set('name', 'Civil Co');
    fd.set('contact', '+250 788 000 111');

    const { quote, isSpam } = normalizeQuotePayload(fd);
    assert.equal(isSpam, false);
    assert.match(quote.reference, /^FM-\d{8}-\d{4}$/);
    assert.equal(quote.product_family, 'gabion-mesh, reinforcement-steel');
    assert.equal(quote.schedule_items, 'Gabion mesh: 15 boxes — 2x1x1m');
    assert.equal(quote.specifications, 'Galvanised baskets');
    assert.equal(quote.delivery_location, 'Musanze');
    assert.equal(quote.timeline, 'To discuss');
    assert.equal(quote.client_name, 'Civil Co');
    assert.equal(quote.reply_contact, '+250 788 000 111');
    assert.equal(validateQuotePayload(quote).valid, true);
  });

  it('flags honeypot submissions as spam and reports missing required fields', () => {
    const spamResult = normalizeQuotePayload({ _website: 'https://spam.example' });
    assert.equal(spamResult.isSpam, true);

    const validation = validateQuotePayload({ product_family: 'Gabion mesh' });
    assert.equal(validation.valid, false);
    assert.deepEqual(validation.missing, [
      'quantity',
      'specifications',
      'delivery_location',
      'client_name',
      'reply_contact',
    ]);
  });
});

describe('buildQuoteEmail, extractEmail, sendQuoteEmail & verifySmtpConnection', () => {
  it('validates clean reply email addresses and rejects header injection', () => {
    assert.equal(extractEmail('  client@company.rw '), 'client@company.rw');
    assert.equal(extractEmail('+250 793 086 644'), undefined);
    assert.equal(extractEmail('evil@example.com\r\nBcc: victim@example.com'), undefined);
  });

  it('escapes HTML, sanitizes headers, sets conditional replyTo, and renders itemised schedule', () => {
    const env = {
      SMTP_USER: 'fortimeshrwanda@gmail.com',
      SMTP_PASS: 'abcdefghijklmnop',
      QUOTE_INBOX_EMAIL: 'inbox@fortimesh.rw',
    };

    const emailWithAddress = buildQuoteEmail(
      {
        reference: 'FM-20261125-9999',
        product_family: 'Reinforcement\r\nBcc: bad@evil.com',
        schedule_items: 'Rebar: 100 bars — D12 12m | Wire: 2 coils — 1.6mm',
        quantity: '100 bars',
        specifications: '<script>alert("xss")</script>\nLine 2',
        delivery_location: 'Kimironko',
        timeline: 'Immediate',
        client_name: 'Acme & Co <Builders>',
        reply_contact: 'procurement@acme.rw',
        submitted_at: '2026-11-25T16:00:00.000Z',
      },
      env,
    );

    assert.equal(emailWithAddress.to, 'inbox@fortimesh.rw');
    assert.equal(emailWithAddress.replyTo, 'procurement@acme.rw');
    assert.equal(/[\r\n]/.test(emailWithAddress.subject), false);
    assert.ok(!emailWithAddress.html.includes('<script>'));
    assert.ok(emailWithAddress.html.includes('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'));
    assert.ok(emailWithAddress.html.includes('Acme &amp; Co &lt;Builders&gt;'));
    assert.ok(emailWithAddress.html.includes('<ol'));
    assert.ok(emailWithAddress.html.includes('Rebar: 100 bars — D12 12m'));
    assert.ok(emailWithAddress.text.includes('1. Rebar: 100 bars — D12 12m'));
    assert.ok(emailWithAddress.text.includes('2. Wire: 2 coils — 1.6mm'));

    const phoneOnlyEmail = buildQuoteEmail(
      {
        reference: 'FM-20261125-0001',
        product_family: 'Gabion mesh',
        schedule_items: 'See specification summary',
        quantity: '10 boxes',
        specifications: '2x1x1m',
        delivery_location: 'Huye',
        timeline: 'Next week',
        client_name: 'Site Manager',
        reply_contact: '+250 788 123 456',
        submitted_at: '2026-11-25T16:00:00.000Z',
      },
      env,
    );

    assert.equal('replyTo' in phoneOnlyEmail, false);
    assert.ok(phoneOnlyEmail.html.includes('href="tel:+250788123456"'));
  });

  it('sends email via transporter and verifies SMTP connection', async () => {
    const sentPayloads = [];
    let verifyCalled = false;

    const mockTransporter = {
      async sendMail(mail) {
        sentPayloads.push(mail);
        return {
          messageId: '<mock-msg-id@smtp.gmail.com>',
          accepted: [mail.to],
          rejected: [],
          response: '250 2.0.0 OK',
        };
      },
      async verify() {
        verifyCalled = true;
        return true;
      },
    };

    const env = {
      SMTP_USER: 'fortimeshrwanda@gmail.com',
      SMTP_PASS: 'abcdefghijklmnop',
    };

    const verified = await verifySmtpConnection(env, { transporter: mockTransporter });
    assert.equal(verifyCalled, true);
    assert.equal(verified.ok, true);
    assert.equal(verified.host, 'smtp.gmail.com');

    const { quote } = normalizeQuotePayload({
      reference: 'FM-20261125-7777',
      product_family: 'Structural steel',
      quantity: '20 lengths',
      specifications: 'SHS 50x50x3mm',
      delivery_location: 'Kigali',
      client_name: 'Steel Frame Ltd',
      reply_contact: 'buyer@steelframe.rw',
    });

    const res = await sendQuoteEmail(quote, { env, transporter: mockTransporter });
    assert.equal(sentPayloads.length, 1);
    assert.equal(sentPayloads[0].to, 'fortimeshrwanda@gmail.com');
    assert.equal(sentPayloads[0].replyTo, 'buyer@steelframe.rw');
    assert.equal(res.messageId, '<mock-msg-id@smtp.gmail.com>');
    assert.deepEqual(res.accepted, ['fortimeshrwanda@gmail.com']);

    await assert.rejects(() => verifySmtpConnection({}, { transporter: mockTransporter }), /not configured/i);
  });
});
