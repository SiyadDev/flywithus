// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL / BASE_PATH are set by the GitHub Pages workflow (site lives at /flywithus/).
// Cloudflare Pages provides CF_PAGES_URL automatically. Local dev falls back to GitHub Pages.
export default defineConfig({
  site: process.env.SITE_URL || process.env.CF_PAGES_URL || 'https://siyaddev.github.io',
  base: process.env.BASE_PATH || '/',
  integrations: [sitemap()],
  server: { port: 4321 },
});
