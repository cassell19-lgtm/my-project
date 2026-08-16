import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// 本文は src/ の外の content/ に置く。CMS からも同じ場所を編集する。
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content" }),
  schema: z.object({
    title: z.string(),
    atwiki_id: z.number().optional(),
  }),
});

export const collections = { pages };
