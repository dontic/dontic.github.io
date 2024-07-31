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
    let [locale, postId] = post.id.split("/");

    // Return true if the post matches the current locale
    return locale === currentLocale;
  });

  return localePosts;
}
