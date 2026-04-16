import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader } from "@blog/ui/card";
import { Badge } from "@blog/ui/badge";
import { formatDate } from "@blog/utils/date";
import type { PostMeta } from "../types/post";

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="block transition-opacity hover:opacity-80"
    >
      <Card>
        <CardHeader>
          <time
            dateTime={post.date}
            className="text-sm text-muted-foreground"
          >
            {formatDate(post.date)}
          </time>
          <h2 className="text-xl font-semibold leading-none tracking-tight">{post.title}</h2>
          <CardDescription>{post.description}</CardDescription>
        </CardHeader>
        {post.tags.length > 0 && (
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
