import { defineCollection, z } from 'astro:content';

const localizedString = z.union([
  z.string(),
  z.object({ en: z.string(), ja: z.string() }),
]);

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: localizedString,
    date: z.string(),
    author: z.object({
      name: z.string(),
      picture: z.string(),
    }),
    excerpt: localizedString,
    coverImage: z.string(),
    ogImage: z.object({
      url: z.string(),
    }),
  }),
});

export const collections = {
  posts: postsCollection,
};

export default collections;
