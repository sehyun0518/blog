import Link from "next/link";
import { formatDate } from "@blog/utils/date";
import type { PostMeta } from "@/types/post";

interface RelatedPostsProps {
  posts: PostMeta[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading" className="mt-12 border-t border-border pt-8">
      <h2 id="related-posts-heading" className="mb-4 text-lg font-semibold text-foreground">
        Related Posts
      </h2>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`} className="group flex flex-col gap-0.5">
              <span className="font-medium text-foreground group-hover:underline">
                {post.title}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDate(post.date)} &middot; {post.readingTime}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
