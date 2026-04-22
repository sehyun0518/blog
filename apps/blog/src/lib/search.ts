import "server-only";
import Fuse, { type IFuseOptions } from "fuse.js";
import type { PostMeta } from "@/types/post";

const FUSE_OPTIONS: IFuseOptions<PostMeta> = {
  keys: [
    { name: "title", weight: 0.6 },
    { name: "description", weight: 0.25 },
    { name: "tags", weight: 0.15 },
  ],
  threshold: 0.35,
  minMatchCharLength: 2,
  ignoreLocation: true,
};

export function searchPosts(posts: PostMeta[], query: string): PostMeta[] {
  if (!query || query.length < 2) return posts;
  const fuse = new Fuse(posts, FUSE_OPTIONS);
  return fuse.search(query).map(({ item }) => item);
}
