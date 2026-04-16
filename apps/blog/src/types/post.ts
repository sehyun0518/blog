import { z } from "zod";

const dateField = z.union([z.string().datetime({ offset: true }), z.string().date()]);

export const PostFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: dateField,
  description: z.string().min(1),
  tags: z
    .array(z.string().transform((t) => t.toLowerCase().trim()))
    .default([]),
  draft: z.boolean().default(false),
  updatedAt: dateField.optional(),
  series: z.string().optional(),
  seriesPart: z.number().int().positive().optional(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}
