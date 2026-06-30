import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PostMeta } from "@/types/post";

interface PostNavigationProps {
  prev: PostMeta | null;
  next: PostMeta | null;
}

export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Post navigation"
      className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-8"
    >
      <div>
        {prev && (
          <Link
            href={`/posts/${prev.slug}`}
            className="group flex flex-col gap-1 text-sm"
          >
            <span className="flex items-center gap-1 text-muted-foreground transition-colors group-hover:text-foreground">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              이전 글
            </span>
            <span className="font-medium text-foreground line-clamp-2 group-hover:underline">
              {prev.title}
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link
            href={`/posts/${next.slug}`}
            className="group flex flex-col gap-1 text-sm items-end"
          >
            <span className="flex items-center gap-1 text-muted-foreground transition-colors group-hover:text-foreground">
              다음 글
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-medium text-foreground line-clamp-2 group-hover:underline">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
