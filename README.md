# Fly With Us — website

Single-page Astro site for **Fly With Us Tours & Travels**, Mannarkkad.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Edit content

Everything editable (phones, WhatsApp number, services, destinations, document checklists, FAQ, reviews) is in
`src/data/site.ts`.

- **Reviews:** paste real Google reviews into the `reviews` array; the scrolling reviews strip appears automatically.
- **Document checklists:** these are drafts. Have the team check them before launch.
- **WhatsApp number** for every button and the booking form: `business.whatsapp`.

## Deploy

`dist/` is plain static HTML/CSS/JS. Upload it to Netlify, Vercel, Cloudflare Pages or any web host, then point the
domain at it.

## Photos

Business photos come from the old WordPress site and the office. Destination and sky photos are from Wikimedia
Commons under the licences listed in the footer's "Photo credits".
