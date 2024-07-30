import { ui, defaultLang } from "./ui";

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
