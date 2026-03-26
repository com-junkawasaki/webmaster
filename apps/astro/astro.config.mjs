// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://junkawasaki.com',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [mdx(), react()],
  markdown: {
    shikiConfig: {
      // ライトモードとダークモードの両方のテーマを設定
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      }
    }
  },
  vite: {
    plugins: [tailwindcss()],
    css: {
      postcss: {
        plugins: []
      }
    }
  }
});