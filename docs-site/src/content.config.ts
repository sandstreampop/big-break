import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Starlight on Astro's Content Layer API needs the docs collection declared
// here so the loader picks up src/content/docs/**.
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
