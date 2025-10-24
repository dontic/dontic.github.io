// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Define your collection(s)
const blog = defineCollection({
  // `loader` can accept an array of multiple patterns as well as string patterns
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    category: z.enum(['tech', 'entrepreneurship', 'other']),
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string(),
    metaDescription: z.string().optional(),
    author: z.string(),
    pubDatetime: z.coerce.date(),
    modDatetime: z.coerce.date().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()),
    slug: z.string().optional(),
    canonicalUrl: z.string().optional(),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog };
