# FORTIMESH AND STEELS RWANDA LTD website

Static, responsive site built from the company's publicly listed product categories. Run `npm run build` to regenerate `dist/`; serve that directory with any static host.

## Source notes

- The company description and product families came from the [Consnect company listing](https://www.consnect.rw/) as indexed in October 2026. Its live site was suspended when checked.
- A [PinkBazaar listing](https://pinkbazaar.in/service/fortimesh-and-steels-rwanda-ltd-113232/) lists KG 667 Street, Kigali, but it does not provide a direct business phone or email. The site therefore shows Kigali only until the address is confirmed by the company.
- No official SKU data, prices, product photographs, project gallery, phone number, email address, or WhatsApp number were available. The site uses representative construction photography from Pexels and Unsplash, with individual links at `/image-credits/`. These images do not imply that the depicted materials, people, sites, or projects belong to Fortimesh. The supplied Fortimesh logo is in `src/logo.png`. Copy describes product families, not current inventory or technical specifications.
- The quote composer copies a structured request and uses Web Share where supported. Direct business submission and a numbered WhatsApp link require a confirmed destination.

## Launch checklist

Confirm phone/WhatsApp, email, location, opening hours, stock and specifications, and authentic company product/project photography. Then update the content in `src/build.mjs` and rebuild. Add an actual form delivery endpoint before claiming online submissions.
