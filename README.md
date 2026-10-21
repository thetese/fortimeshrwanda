# FORTIMESH AND STEELS RWANDA LTD — Official Website

Static, responsive B2B catalogue and quote-request platform for **FORTIMESH AND STEELS RWANDA LTD**, located in Kimironko, Kigali, Rwanda.

## Quick start

```bash
npm run build   # Regenerate dist/ (14 pages + 404.html + sitemap.xml + robots.txt)
npm run check   # Validate HTML count, SEO/JSON-LD, contact channels, links & image assets
```

To build for a custom production domain, set `SITE_ORIGIN`:

```bash
SITE_ORIGIN=https://fortimesh.rw npm run build
```

## Company & contact details configured (`src/build.mjs`)

- **Company:** FORTIMESH AND STEELS RWANDA LTD
- **Address:** KG 667 Street, Kimironko, Kigali, Rwanda
- **Phone / WhatsApp:** `+250 793 086 644` (`https://wa.me/250793086644`)
- **Email:** `fortimeshrwanda@gmail.com`
- **Instagram:** [`@fortimesh_rwanda`](https://www.instagram.com/fortimesh_rwanda/)
- **Hours:** Mon – Sat: 8:00 AM – 6:00 PM CAT

## Lead & quote delivery (`/quote/`)

- Generates a timestamped quote reference (`FM-YYYYMMDD-XXXX`) with local draft autosave.
- **Send on WhatsApp:** Opens a pre-filled WhatsApp chat to `+250 793 086 644`.
- **Submit online:** Sends the structured quote table directly to `fortimeshrwanda@gmail.com` via FormSubmit AJAX (`https://formsubmit.co/ajax/fortimeshrwanda@gmail.com`), with progressive HTML form fallback when JavaScript is disabled.
- **Open in email app / Copy / Share:** Direct `mailto:`, clipboard copy, and Web Share API support.

## Asset pipeline

Source photography and the official logo reside in `src/photos/` and `src/logo.png`. If brand or photo assets change, regenerate responsive WebP renditions and `src/img/manifest.json` with:

```bash
python tools/prepare_assets.py
```
