import { defineCollection, z } from 'astro:content';

const eventsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    imageUrl: z.string().optional(),
    inscriptionUrl: z.string().optional(),
    moreInfoUrl: z.string().optional(),
  }),
});

export const collections = {
  events: eventsCollection,
};
