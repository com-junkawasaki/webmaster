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
    // Which locales to publish this post in. Defaults to both ['en', 'ja'].
    // Use e.g. ['en'] to publish English-only: the <Ja> source stays in the
    // repo, but no /ja/ route or /ja/ listing entry is generated for it.
    locales: z.array(z.enum(['en', 'ja'])).optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};

export default collections;
