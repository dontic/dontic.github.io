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
  site: SITE.siteUrl,
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
