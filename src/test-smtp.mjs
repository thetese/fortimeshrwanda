import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildClientConfirmationEmail,
  buildQuoteEmail,
  extractAttachments,
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

describe('normalizeQuotePayload, optional products & PDF/photo attachments', () => {
  it('allows submissions with NO mandatory product selection when materials are typed', () => {
    const { quote, isSpam } = normalizeQuotePayload({
      quantity: '50 bars D12 + 10 bags Sika',
      delivery_location: 'Gisozi, Kigali',
      client_name: 'Kigali Builders',
      client_email: 'buyer@kigalibuilders.rw',
      reply_contact: '+250 788 123 456',
    });

    assert.equal(isSpam, false);
    assert.equal(quote.product_family, 'General Material Inquiry');
    assert.equal(validateQuotePayload(quote).valid, true);
  });

  it('allows PDF/photo quotation upload alone without mandatory products, quantity, or specs', async () => {
    const fd = new FormData();
    const pdfBytes = Buffer.from('%PDF-1.4 sample quotation schedule');
    const photoBytes = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
    fd.append('attachments', new File([pdfBytes], 'client-boq.pdf', { type: 'application/pdf' }));
    fd.append('attachments', new File([photoBytes], 'handwritten-list.jpg', { type: 'image/jpeg' }));
    fd.set('location', 'Nyarutarama site');
    fd.set('name', 'Site Engineer');
    fd.set('email', 'eng@project.rw');
    fd.set('contact', '+250 788 222 333');

    const { attachments, attachmentError } = await extractAttachments(fd);
    assert.equal(attachmentError, null);
    assert.equal(attachments.length, 2);
    assert.equal(attachments[0].filename, 'client-boq.pdf');
    assert.equal(attachments[1].filename, 'handwritten-list.jpg');

    const { quote, isSpam } = normalizeQuotePayload(fd, attachments);
    assert.equal(isSpam, false);
    assert.equal(quote.product_family, 'Uploaded Quotation / BoQ');
    assert.equal(quote.quantity, 'See attached (2 files)');
    assert.match(quote.specifications, /client-boq\.pdf/);
    assert.equal(quote.attachments_meta.length, 2);
    assert.equal(validateQuotePayload(quote).valid, true);
  });

  it('rejects unsupported executable files and empty submissions with neither materials nor files', async () => {
    const badFd = new FormData();
    badFd.append('attachments', new File([Buffer.from('MZ')], 'malware.exe', { type: 'application/octet-stream' }));
    const badResult = await extractAttachments(badFd);
    assert.ok(badResult.attachmentError);
    assert.match(badResult.attachmentError, /Unsupported file type/i);

    const { quote: emptyQuote } = normalizeQuotePayload({});
    const validation = validateQuotePayload(emptyQuote);
    assert.equal(validation.valid, false);
    assert.deepEqual(validation.missing, [
      'materials_or_attachment',
      'delivery_location',
      'client_name',
      'reply_contact',
    ]);
  });

  it('flags honeypot submissions as spam', () => {
    const spamResult = normalizeQuotePayload({ _website: 'https://spam.example' });
    assert.equal(spamResult.isSpam, true);
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

  it('attaches PDF/photo files to sales email and confirms received filenames in client email', async () => {
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

    const sampleAttachments = [
      {
        filename: 'tender-boq.pdf',
        contentType: 'application/pdf',
        size: 1024,
        content: Buffer.from('%PDF-1.4 mock'),
      },
      {
        filename: 'site-sketch.jpg',
        contentType: 'image/jpeg',
        size: 2048,
        content: Buffer.from([0xff, 0xd8, 0xff]),
      },
    ];

    const { quote } = normalizeQuotePayload(
      {
        reference: 'FM-20261125-7777',
        delivery_location: 'Gisozi, Kigali',
        client_name: 'Steel Frame Ltd <Test>',
        client_email: 'buyer@steelframe.rw',
        reply_contact: '0788 555 666',
      },
      sampleAttachments,
    );

    const res = await sendQuoteEmail(quote, {
      env,
      transporter: mockTransporter,
      attachments: sampleAttachments,
    });

    assert.equal(sentPayloads.length, 2);
    assert.equal(sentPayloads[0].to, 'fortimeshrwanda@gmail.com');
    assert.equal(sentPayloads[0].replyTo, 'buyer@steelframe.rw');
    assert.equal(sentPayloads[0].attachments.length, 2);
    assert.equal(sentPayloads[0].attachments[0].filename, 'tender-boq.pdf');
    assert.ok(sentPayloads[0].subject.includes('[2 files]'));
    assert.ok(sentPayloads[0].html.includes('Attached Quotation / BoQ Files'));
    assert.ok(sentPayloads[0].html.includes('tender-boq.pdf'));

    assert.equal(sentPayloads[1].to, 'buyer@steelframe.rw');
    assert.equal(sentPayloads[1].replyTo, 'fortimeshrwanda@gmail.com');
    assert.equal('attachments' in sentPayloads[1], false);
    assert.ok(sentPayloads[1].html.includes('Attached Files Received'));
    assert.ok(sentPayloads[1].html.includes('tender-boq.pdf'));
    assert.ok(sentPayloads[1].html.includes('site-sketch.jpg'));

    assert.equal(res.attachmentsCount, 2);
    assert.equal(res.confirmationSent, true);
    assert.equal(res.confirmationTo, 'buyer@steelframe.rw');
  });
});
