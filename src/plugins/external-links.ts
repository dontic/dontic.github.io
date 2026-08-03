import type { HastPluginDefinition } from 'satteri';

// Sätteri hast plugin: open external links in a new tab.
//
// Replaces the `rehype-external-links` plugin used before the move to Astro's
// native Markdown pipeline, which takes visitor-style plugins rather than
// unified/rehype ones. Behaviour matches the old `{ target: '_blank', rel: [] }`
// config: `target` is set, no `rel` is added.

/** Scheme prefix of an absolute URL, per RFC 3986 § 3.1. */
const ABSOLUTE_URL = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const EXTERNAL_PROTOCOLS = new Set(['http', 'https']);

function isExternalHref(href: string): boolean {
  // Protocol-relative URLs (`//example.com`) are external too.
  if (!ABSOLUTE_URL.test(href)) return href.startsWith('//');

  return EXTERNAL_PROTOCOLS.has(href.slice(0, href.indexOf(':')).toLowerCase());
}

export const externalLinks: HastPluginDefinition = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      // Don't override a target the author set explicitly.
      if (node.properties?.target) return;

      const href = node.properties?.href;
      if (typeof href === 'string' && isExternalHref(href)) {
        ctx.setProperty(node, 'target', '_blank');
      }
    },
  },
};
