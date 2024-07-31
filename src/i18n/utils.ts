import { ui, defaultLang } from "./ui";
import type { CollectionEntry } from "astro:content";

export { defaultLang };

export type Languages = keyof typeof ui;

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

// Utility function to strip locale prefix
export function stripLocalePrefix(slug: string): string {
  return slug.replace(/^[a-z]{2}\/(.+)$/, "$1");
}

export function getLocalePosts(
  posts: CollectionEntry<"blog">[],
  currentLocale: string
): any[] {
  const localePosts = posts.filter(post => {
    // Split the id
    let [locale] = post.id.split("/");

    // Return true if the post matches the current locale
    return locale === currentLocale;
  });

  return localePosts;
}

export function getBlogPostLangAndSlug(post: CollectionEntry<"blog">) {
  // Slug must be in the format /en/slug

  // Try to get the land and slug from the slug
  // Note that if the slug was declared in the file without a locale
  // it will return undefined
  let [lang, slug] = post.slug.split("/");

  // If slug is undefined it means that there is a custom slug in the markdown file
  // We need to get the locale from the id instead
  if (!slug) {
    const [locale] = post.id.split("/");
    lang = locale;
    slug = post.slug;
  }

  return { lang, slug };
}

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}
