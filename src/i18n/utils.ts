import { ui, defaultLang } from "./ui";

export { defaultLang };

export type Languages = keyof typeof ui;

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
