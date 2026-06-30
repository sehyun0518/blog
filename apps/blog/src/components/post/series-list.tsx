import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { PostMeta } from "@/types/post";

interface SeriesListProps {
  posts: PostMeta[];
  currentSlug: string;
}

export function SeriesList({ posts, currentSlug }: SeriesListProps) {
  if (posts.length <= 1) return null;

  const seriesName = posts[0]?.series;

  return (
    <aside aria-label={`시리즈: ${seriesName}`} className="my-6 rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-semibold text-foreground">시리즈: {seriesName}</p>
      </div>
      <ol className="space-y-1.5">
        {posts.map((post, index) => (
          <li key={post.slug} className="flex items-baseline gap-2 text-sm">
            <span className="shrink-0 text-muted-foreground">{index + 1}.</span>
            {post.slug === currentSlug ? (
              <span className="font-medium text-foreground">{post.title}</span>
            ) : (
              <Link
                href={`/posts/${post.slug}`}
                className="text-muted-foreground transition-colors hover:text-foreground hover:underline"
              >
                {post.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}
