import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { readingTime } from "@blog/utils/reading-time";
import { PostFrontmatterSchema, type Post, type PostMeta } from "../types/post";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const SLUG_RE = /^[a-zA-Z0-9_-]+$/;

let postCache: PostMeta[] | null = null;

export function _clearPostCache(): void {
  postCache = null;
}

function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

function readPostFile(filename: string): { data: Record<string, unknown>; content: string } | null {
  try {
    const filePath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return { data, content };
  } catch {
    return null;
  }
}

function parsePostMeta(filename: string): PostMeta | null {
  try {
    const slug = filename.replace(/\.mdx?$/, "");
    const file = readPostFile(filename);
    if (!file) return null;
    const frontmatter = PostFrontmatterSchema.parse(file.data);
    return { slug, ...frontmatter, readingTime: readingTime(file.content) };
  } catch {
    return null;
  }
}

export function getAllPostMeta(): PostMeta[] {
  if (postCache) return postCache;
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f));
  postCache = files
    .map(parsePostMeta)
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return postCache;
}

export function getPostBySlug(slug: string): Post | null {
  if (!isValidSlug(slug)) return null;
  try {
    const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
    const mdPath = path.join(POSTS_DIR, `${slug}.md`);
    const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

    if (!filePath) return null;

    const filename = path.basename(filePath);
    const file = readPostFile(filename);
    if (!file) return null;
    const frontmatter = PostFrontmatterSchema.parse(file.data);
    return { slug, ...frontmatter, readingTime: readingTime(file.content), content: file.content };
  } catch {
    return null;
  }
}

export function getAllTags(): string[] {
  const posts = getAllPostMeta();
  const tagSet = new Set(posts.flatMap((p) => p.tags));
  return Array.from(tagSet).sort();
}

export interface PrevNextPosts {
  prev: PostMeta | null;
  next: PostMeta | null;
}

export function getPrevNextPosts(slug: string): PrevNextPosts {
  const posts = getAllPostMeta();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  // posts sorted descending (newest first)
  // prev = older (higher index), next = newer (lower index)
  return {
    prev: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ""));
}
