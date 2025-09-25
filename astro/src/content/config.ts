import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.object({
      name: z.string(),
      picture: z.string(),
    }),
    excerpt: z.string(),
    coverImage: z.string(),
    ogImage: z.object({
      url: z.string(),
    }),
  }),
});

export const collections = {
  posts: postsCollection,
};
