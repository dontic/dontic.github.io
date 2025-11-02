// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { SITE } from './src/config'; // Use a relative import to avoid errors
import pagefind from 'astro-pagefind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
  server: {
    // host: true,  // or 0.0.0.0
    // port: 4321,  // Different port from the default 4321
  },
  site: SITE.siteUrl,
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'en',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
    icon(),
    pagefind(),
    mdx({
      rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: [] }]],
    }),
    react(),
  ],
  trailingSlash: 'always',
});
