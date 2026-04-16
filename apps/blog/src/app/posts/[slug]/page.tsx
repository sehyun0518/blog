import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@blog/ui/badge";
import { formatDate } from "@blog/utils/date";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to all posts
      </Link>
      <article>
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">{post.title}</h1>
          <time dateTime={post.date} className="text-sm text-muted-foreground">
            {formatDate(post.date)}
          </time>
          <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
        </header>
        <div className="mt-8 space-y-4 leading-7 text-foreground [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </main>
  );
}
