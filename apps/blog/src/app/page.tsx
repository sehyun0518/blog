import { getAllPostMeta, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { TagFilter } from "@/components/tag-filter";

interface HomePageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { tag } = await searchParams;
  const normalizedTag = tag?.toLowerCase().trim();
  const allPosts = getAllPostMeta();
  const tags = getAllTags();

  const posts =
    normalizedTag !== undefined
      ? allPosts.filter((p) => p.tags.includes(normalizedTag))
      : allPosts;

  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Blog</h1>
      <p className="mb-8 text-muted-foreground">
        {posts.length} {posts.length === 1 ? "post" : "posts"}
        {normalizedTag !== undefined ? ` tagged "${normalizedTag}"` : ""}
      </p>
      <TagFilter tags={tags} activeTag={normalizedTag} />
      {posts.length > 0 ? (
        <ul className="mt-8 flex flex-col gap-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-muted-foreground">No posts found.</p>
      )}
    </main>
  );
}
