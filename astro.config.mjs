import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ssolares.vercel.app',
  integrations: [
    sitemap(),
  ],
  adapter: vercel(),
});
