// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { SITE } from './src/config'; // Use a relative import to avoid errors
import pagefind from 'astro-pagefind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { satteri } from '@astrojs/markdown-satteri';
import { externalLinks } from './src/plugins/external-links';

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
  markdown: {
    // Astro's native Markdown pipeline; MDX inherits these plugins
    processor: satteri({
      hastPlugins: [externalLinks],
    }),
  },
  integrations: [sitemap(), icon(), pagefind(), mdx(), react()],
  trailingSlash: 'always',
  redirects: {
    // The about page now lives on the landing page
    '/about': '/#my-story',
    '/es/about': '/es/#my-story',
  },
});
