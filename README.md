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

## Google rating & review count (weekly)

The rating, total count, star breakdown and review quotes live in `src/data/reviews.json`.

1. **Every Monday at 9 am (IST)** GitHub opens a **"Weekly review check"** issue and emails everyone watching the repo.
2. The issue shows the numbers currently on the site, with a link to the Google reviews.
3. If Google shows different numbers, use the issue's **Update reviews** link: press **Run workflow**, type the
   rating, total and the count for each star, and press the green **Run workflow**.
4. The form checks the numbers add up, saves them, and closes the issue. Cloudflare rebuilds the site within minutes.

Nothing changed? Just close the issue. To get reminders, the owner needs a GitHub account added as a collaborator
(repo **Settings → Collaborators**) and must be watching the repo.

Review **quotes** are picked by hand; ask the developer to refresh them now and then.

## Deploy (Cloudflare)

In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** → pick `SiyadDev/flywithus`.

- Framework preset: **Astro** · Build command: `npm run build` · Output directory: `dist`
- Node version is pinned by `.node-version` (22).

Every push to `main` (including the weekly review updates) redeploys automatically.

## Photos

Business photos come from the old WordPress site and the office. Destination and sky photos are from Wikimedia
Commons under the licences listed in the footer's "Photo credits".
