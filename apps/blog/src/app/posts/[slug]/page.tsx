import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { Badge } from "@blog/ui/badge";
import { formatDate } from "@blog/utils/date";
import { getAllSlugs, getPostBySlug, getSeriesPosts, getRelatedPosts } from "@/lib/posts";
import { buildBlogPostingSchema } from "@/lib/structured-data";
import { TableOfContents } from "@/components/toc";
import { SeriesList } from "@/components/series-list";
import { RelatedPosts } from "@/components/related-posts";

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark",
  keepBackground: true,
};

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
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const structuredData = buildBlogPostingSchema(post);
  const seriesPosts = post.series ? getSeriesPosts(post.series) : [];
  const relatedPosts = getRelatedPosts(slug);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.updatedAt && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>
                  Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                </span>
              </>
            )}
            <span aria-hidden="true">&middot;</span>
            <span>{post.readingTime}</span>
          </div>
          <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
        </header>
        {seriesPosts.length > 1 && (
          <SeriesList posts={seriesPosts} currentSlug={slug} />
        )}
        <TableOfContents content={post.content} className="mb-8" />
        <div className="mt-8 space-y-4 leading-7 text-foreground [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline [&_:not(pre)_code]:rounded [&_:not(pre)_code]:bg-muted [&_:not(pre)_code]:px-1.5 [&_:not(pre)_code]:py-0.5 [&_:not(pre)_code]:text-sm [&_figure[data-rehype-pretty-code-figure]]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-sm">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
              },
            }}
          />
        </div>
      </article>
      <RelatedPosts posts={relatedPosts} />
    </main>
  );
}
