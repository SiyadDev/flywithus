// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The site lives at https://flywithustravels.com (GitHub Pages, custom domain via public/CNAME).
// SITE_URL / BASE_PATH can override this, e.g. for a preview build under a sub-path.
export default defineConfig({
  site: process.env.SITE_URL || 'https://flywithustravels.com',
  base: process.env.BASE_PATH || '/',
  integrations: [sitemap()],
  server: { port: 4321 },
});
