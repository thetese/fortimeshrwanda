# FORTIMESH AND STEELS RWANDA LTD — Official Website

Next.js B2B catalogue and quote-request platform for **FORTIMESH AND STEELS RWANDA LTD**, located in Gisozi, Kigali, Rwanda.

## Quick start

```bash
npm run dev         # Start local Next.js development server
npm run build       # Build Next.js production bundle & static HTML pages
npm run check       # Validate HTML count, SEO/JSON-LD, contact channels, /api/quote & assets
npm run test:smtp   # Run Google SMTP unit tests
npm run verify:smtp # Verify Google SMTP TLS/authentication using .env.local
```

To build for a custom production domain, set `SITE_ORIGIN`:

```bash
SITE_ORIGIN=https://fortimesh.rw npm run build
```

## Company & contact details (`lib/site-data.js`)

- **Company:** FORTIMESH AND STEELS RWANDA LTD
- **Address:** KG 667 Street, Gisozi, Kigali, Rwanda
- **Phone / WhatsApp:** `+250 793 086 644` (`https://wa.me/250793086644`)
- **Email:** `fortimeshrwanda@gmail.com`
- **Instagram:** [`@fortimesh_rwanda`](https://www.instagram.com/fortimesh_rwanda/)

## Lead & quote delivery (`/quote/` & `/api/quote`)

- Generates a timestamped quote reference (`FM-YYYYMMDD-XXXX`) with local draft autosave.
- **Send on WhatsApp:** Opens a pre-filled WhatsApp chat to `+250 793 086 644`.
- **Submit online:** Sends the structured quote request to `/api/quote`, which dispatches a branded HTML + plain-text lead notification to `QUOTE_INBOX_EMAIL` (default `fortimeshrwanda@gmail.com`) **and** an instant branded confirmation receipt to the client's email via Google SMTP (`nodemailer` in `lib/mailer.mjs`), with progressive HTML form fallback when JavaScript is disabled.
- **Open in email app / Copy / Share:** Direct `mailto:`, clipboard copy, and Web Share API support.

## Google SMTP configuration

Quote submissions on `/api/quote` are delivered via Google SMTP (`smtp.gmail.com`).

1. Enable **2-Step Verification** on the sender Google account (e.g. `fortimeshrwanda@gmail.com`).
2. Generate a 16-character **App Password** at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Copy `.env.example` to `.env.local` for local development and fill in your credentials:

```bash
cp .env.example .env.local
```

Required and optional environment variables:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465` (`465` uses implicit TLS with `SMTP_SECURE=true`; `587` uses STARTTLS with `SMTP_SECURE=false`)
- `SMTP_SECURE=true`
- `SMTP_USER=fortimeshrwanda@gmail.com`
- `SMTP_PASS=your-16-char-google-app-password`
- `SMTP_FROM="FORTIMESH Website <fortimeshrwanda@gmail.com>"`
- `QUOTE_INBOX_EMAIL=fortimeshrwanda@gmail.com`
- `QUOTE_WEBHOOK_URL=` (optional JSON webhook notified alongside SMTP delivery)

### Verify SMTP locally

```bash
npm run verify:smtp
npm run verify:smtp -- --send-test
```

### Vercel deployment

Add the same `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `QUOTE_INBOX_EMAIL` variables under **Vercel Project Settings -> Environment Variables** before deploying.

## Asset pipeline

Source photography and the official logo reside in `src/photos/` and `src/logo.png`. If brand or photo assets change, regenerate responsive WebP renditions and `public/img/manifest.json` with:

```bash
python tools/prepare_assets.py
```
