// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import remarkToc from 'remark-toc';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [[remarkToc, { heading: 'toc', maxDepth: 3 }]],
  },
  integrations: [sitemap(), icon()],
});
