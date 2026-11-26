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
    'notes.title': 'Learning Notes',
    'notes.description': 'A working notebook for comparisons, experiments, and diagrams worth revisiting.',
    'notes.navigation': 'Learning note navigation',
    'footer.rights': 'All rights reserved by Jun Kawasaki. @CC BY-NC-SA',
    'lang.switch': '日本語',
  },
  ja: {
    'site.title': 'Jun Kawasaki',
    'site.tagline': 'Good Vibes For Children.',
    'nav.back': 'Jun Kawasaki.',
    'posts.latest': '最新',
    'posts.all': '記事一覧',
    'notes.title': '学習ノート',
    'notes.description': '調べたこと、試したこと、あとで見返したい図や比較を残すノート。',
    'notes.navigation': '学習ノートの案内',
    'footer.rights': 'All rights reserved by Jun Kawasaki. @CC BY-NC-SA',
    'lang.switch': 'English',
  },
} as const;
