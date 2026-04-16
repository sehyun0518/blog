import { z } from "zod";

export const PostFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export interface PostMeta extends PostFrontmatter {
  slug: string;
}

export interface Post extends PostMeta {
  content: string;
}
