// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages serves the site from /flywithus/, so its deploy workflow sets
// SITE_URL and BASE_PATH. Local dev and Cloudflare use the defaults (root path).
export default defineConfig({
  site: process.env.SITE_URL || 'https://flywithusnow.com',
  base: process.env.BASE_PATH || '/',
  server: { port: 4321 },
});
