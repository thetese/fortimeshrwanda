import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildClientConfirmationEmail,
  buildQuoteEmail,
  extractEmail,
  getSmtpConfig,
  isSmtpConfigured,
  normalizeQuotePayload,
  resolveClientEmail,
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
    assert.equal(
      isSmtpConfigured({
        SMTP_USER: 'fortimeshrwanda@gmail.com',
        SMTP_PASS: 'abcd efgh ijkl mnop',
      }),
      true,
    );

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
  it('normalizes JSON payload with dedicated client_email and validates required fields', () => {
    const { quote, isSpam } = normalizeQuotePayload({
      reference: 'FM-20261125-1234',
      product_family: 'Hollow sections, Structural steel',
      schedule_items: 'Hollow sections: 20 bars — SHS 50x50x3mm',
      quantity: '20 bars',
      specifications: 'SHS 50x50x3mm 6m lengths',
      delivery_location: 'Gisozi, Kigali',
      timeline: 'This week',
      client_name: 'Kigali Builders',
      client_email: 'buyer@kigalibuilders.rw',
      reply_contact: '+250 788 123 456',
    });

    assert.equal(isSpam, false);
    assert.equal(quote.reference, 'FM-20261125-1234');
    assert.equal(quote.client_email, 'buyer@kigalibuilders.rw');
    assert.equal(quote.reply_contact, '+250 788 123 456');
    assert.equal(resolveClientEmail(quote), 'buyer@kigalibuilders.rw');
    assert.equal(validateQuotePayload(quote).valid, true);
  });

  it('normalizes HTML form fields and FormData instances', () => {
    const fd = new FormData();
    fd.append('product', 'hollow-sections');
    fd.append('product', 'reinforcement-steel');
    fd.append('item_family', 'Hollow sections');
    fd.append('item_spec', 'SHS 50x50x3mm');
    fd.append('item_qty', '15 bars');
    fd.append('item_family', 'Reinforcement materials');
    fd.append('item_spec', '');
    fd.append('item_qty', '');
    fd.set('quantity', '15 bars');
    fd.set('specification', 'Standard 6m lengths');
    fd.set('location', 'Musanze');
    fd.set('name', 'Civil Co');
    fd.set('email', 'eng@civil.rw');
    fd.set('contact', '+250 788 000 111');

    const { quote, isSpam } = normalizeQuotePayload(fd);
    assert.equal(isSpam, false);
    assert.match(quote.reference, /^FM-\d{8}-\d{4}$/);
    assert.equal(quote.product_family, 'hollow-sections, reinforcement-steel');
    assert.equal(quote.schedule_items, 'Hollow sections: 15 bars — SHS 50x50x3mm');
    assert.equal(quote.specifications, 'Standard 6m lengths');
    assert.equal(quote.delivery_location, 'Musanze');
    assert.equal(quote.timeline, 'To discuss');
    assert.equal(quote.client_name, 'Civil Co');
    assert.equal(quote.client_email, 'eng@civil.rw');
    assert.equal(quote.reply_contact, '+250 788 000 111');
    assert.equal(validateQuotePayload(quote).valid, true);
  });

  it('flags honeypot submissions as spam and reports missing required fields', () => {
    const spamResult = normalizeQuotePayload({ _website: 'https://spam.example' });
    assert.equal(spamResult.isSpam, true);

    const validation = validateQuotePayload({ product_family: 'Structural steel' });
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

describe('buildQuoteEmail, buildClientConfirmationEmail, sendQuoteEmail & verifySmtpConnection', () => {
  it('validates clean reply email addresses and extracts embedded client email safely', () => {
    assert.equal(extractEmail('  client@company.rw '), 'client@company.rw');
    assert.equal(extractEmail('+250 793 086 644'), undefined);
    assert.equal(extractEmail('evil@example.com\r\nBcc: victim@example.com'), undefined);
    assert.equal(
      resolveClientEmail({ reply_contact: '+250 788 123 456 / procurement@acme.rw' }),
      'procurement@acme.rw',
    );
  });

  it('builds sales desk & client confirmation emails with XSS escaping and branded templates', () => {
    const env = {
      SMTP_USER: 'fortimeshrwanda@gmail.com',
      SMTP_PASS: 'abcdefghijklmnop',
      QUOTE_INBOX_EMAIL: 'inbox@fortimesh.rw',
    };

    const quote = {
      reference: 'FM-20261125-9999',
      product_family: 'Reinforcement\r\nBcc: bad@evil.com',
      schedule_items: 'Rebar: 100 bars — D12 12m | Wire: 2 coils — 1.6mm',
      quantity: '100 bars',
      specifications: '<script>alert("xss")</script>\nLine 2',
      delivery_location: 'Gisozi',
      timeline: 'Immediate',
      client_name: 'Acme & Co <Builders>',
      client_email: 'procurement@acme.rw',
      reply_contact: '0788 123 456',
      submitted_at: '2026-11-25T16:00:00.000Z',
    };

    const salesMail = buildQuoteEmail(quote, env);
    assert.equal(salesMail.to, 'inbox@fortimesh.rw');
    assert.equal(salesMail.replyTo, 'procurement@acme.rw');
    assert.equal(/[\r\n]/.test(salesMail.subject), false);
    assert.ok(!salesMail.html.includes('<script>'));
    assert.ok(salesMail.html.includes('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'));
    assert.ok(salesMail.html.includes('Acme &amp; Co &lt;Builders&gt;'));
    assert.ok(salesMail.html.includes('https://wa.me/250788123456'));
    assert.ok(salesMail.html.includes('logo-white.png'));
    assert.ok(salesMail.text.includes('1. Rebar: 100 bars — D12 12m'));

    const clientMail = buildClientConfirmationEmail(quote, env);
    assert.ok(clientMail);
    assert.equal(clientMail.to, 'procurement@acme.rw');
    assert.equal(clientMail.replyTo, 'inbox@fortimesh.rw');
    assert.equal(/[\r\n]/.test(clientMail.subject), false);
    assert.ok(!clientMail.html.includes('<script>'));
    assert.ok(clientMail.html.includes('Request Received'));
    assert.ok(clientMail.html.includes('What Happens Next'));
    assert.ok(clientMail.html.includes('FM-20261125-9999'));
    assert.ok(clientMail.html.includes('logo-white.png'));

    const phoneOnlyQuote = {
      ...quote,
      client_email: '',
      reply_contact: '+250 788 123 456',
    };
    assert.equal(buildClientConfirmationEmail(phoneOnlyQuote, env), null);
  });

  it('sends both sales notification and client confirmation emails via transporter', async () => {
    const sentPayloads = [];
    let verifyCalled = false;

    const mockTransporter = {
      async sendMail(mail) {
        sentPayloads.push(mail);
        return {
          messageId: `<mock-${sentPayloads.length}@smtp.gmail.com>`,
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

    const { quote } = normalizeQuotePayload({
      reference: 'FM-20261125-7777',
      product_family: 'Structural steel',
      quantity: '20 lengths',
      specifications: 'SHS 50x50x3mm',
      delivery_location: 'Gisozi, Kigali',
      client_name: 'Steel Frame Ltd',
      client_email: 'buyer@steelframe.rw',
      reply_contact: '+250 788 555 666',
    });

    const res = await sendQuoteEmail(quote, { env, transporter: mockTransporter });
    assert.equal(sentPayloads.length, 2);
    assert.equal(sentPayloads[0].to, 'fortimeshrwanda@gmail.com');
    assert.equal(sentPayloads[0].replyTo, 'buyer@steelframe.rw');
    assert.equal(sentPayloads[1].to, 'buyer@steelframe.rw');
    assert.equal(sentPayloads[1].replyTo, 'fortimeshrwanda@gmail.com');
    assert.equal(res.confirmationSent, true);
    assert.equal(res.confirmationTo, 'buyer@steelframe.rw');
    assert.equal(res.confirmationMessageId, '<mock-2@smtp.gmail.com>');
  });
});
