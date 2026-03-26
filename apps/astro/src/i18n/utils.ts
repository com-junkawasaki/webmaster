import { ui, defaultLocale, type Locale } from './ui';

export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split('/');
  if (locale in ui) return locale as Locale;
  return defaultLocale;
}

export function useTranslations(locale: Locale) {
  return function t(key: keyof typeof ui[typeof defaultLocale]): string {
    return ui[locale][key] || ui[defaultLocale][key];
  };
}

export function getLocalizedPath(path: string, locale: Locale): string {
  return `/${locale}${path}`;
}

export function getSwitchLocalePath(url: URL): string {
  const locale = getLocaleFromUrl(url);
  const otherLocale: Locale = locale === 'en' ? 'ja' : 'en';
  const pathWithoutLocale = url.pathname.replace(/^\/(en|ja)/, '');
  return `/${otherLocale}${pathWithoutLocale || '/'}`;
}

export function getPostTitle(data: { title: string | { en: string; ja: string } }, locale: Locale): string {
  if (typeof data.title === 'string') return data.title;
  return data.title[locale] || data.title[defaultLocale];
}

export function getPostExcerpt(data: { excerpt: string | { en: string; ja: string } }, locale: Locale): string {
  if (typeof data.excerpt === 'string') return data.excerpt;
  return data.excerpt[locale] || data.excerpt[defaultLocale];
}
