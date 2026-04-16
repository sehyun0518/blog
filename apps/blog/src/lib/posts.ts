import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostFrontmatterSchema, type Post, type PostMeta } from "../types/post";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function readPostFile(filename: string): { data: Record<string, unknown>; content: string } {
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data, content };
}

function parsePostMeta(filename: string): PostMeta {
  const slug = filename.replace(/\.mdx?$/, "");
  const { data } = readPostFile(filename);
  const frontmatter = PostFrontmatterSchema.parse(data);
  return { slug, ...frontmatter };
}

export function getAllPostMeta(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f));
  return files
    .map(parsePostMeta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const filename = path.basename(filePath);
  const { data, content } = readPostFile(filename);
  const frontmatter = PostFrontmatterSchema.parse(data);
  return { slug, ...frontmatter, content };
}

export function getAllTags(): string[] {
  const posts = getAllPostMeta();
  const tagSet = new Set(posts.flatMap((p) => p.tags));
  return Array.from(tagSet).sort();
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ""));
}
