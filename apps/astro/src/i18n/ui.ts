export const languages = {
  en: 'English',
  ja: '日本語',
} as const;

export type Locale = keyof typeof languages;

export const defaultLocale: Locale = 'en';

export const ui = {
  en: {
    'site.title': 'Jun Kawasaki',
    'site.tagline': 'Good Vibes For Children.',
    'nav.back': 'Jun Kawasaki.',
    'posts.latest': 'Latest',
    'posts.all': 'Posts',
    'footer.rights': 'All rights reserved by Jun Kawasaki. @CC BY-NC-SA',
    'lang.switch': '日本語',
  },
  ja: {
    'site.title': 'Jun Kawasaki',
    'site.tagline': 'Good Vibes For Children.',
    'nav.back': 'Jun Kawasaki.',
    'posts.latest': '最新',
    'posts.all': '記事一覧',
    'footer.rights': 'All rights reserved by Jun Kawasaki. @CC BY-NC-SA',
    'lang.switch': 'English',
  },
} as const;
