// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { SITE } from './src/config';  // Use a relative import to avoid errors
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  site: SITE.siteUrl,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap(), icon(), pagefind()],
  trailingSlash: 'always',
});
