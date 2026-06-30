import { Suspense } from "react";
import { getAllPostMeta, getAllTags } from "@/lib/posts";
import { searchPosts } from "@/lib/search";
import { buildBlogSchema, buildWebSiteSchema } from "@/lib/structured-data";
import { POSTS_PER_PAGE } from "@/lib/config";
import { PostCard, TagFilter, SearchInput, Pagination } from "@/components/post-list";

interface HomePageProps {
  searchParams: Promise<{ tag?: string; q?: string; page?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { tag, q, page: pageParam } = await searchParams;
  const normalizedTag = tag?.toLowerCase().trim();
  const query = q?.toLowerCase().trim();
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  const allPosts = getAllPostMeta();
  const tags = getAllTags();

  let filteredPosts = allPosts;
  if (normalizedTag !== undefined) {
    filteredPosts = filteredPosts.filter((p) => p.tags.includes(normalizedTag));
  }
  if (query) {
    filteredPosts = searchPosts(filteredPosts, query);
  }

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  function buildHref(p: number): string {
    const params = new URLSearchParams();
    if (normalizedTag) params.set("tag", normalizedTag);
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  const websiteSchema = buildWebSiteSchema();
  const blogSchema = buildBlogSchema();

  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Blog</h1>
      <p className="mb-8 text-muted-foreground">
        {filteredPosts.length}개의 포스트
        {normalizedTag !== undefined ? ` — "${normalizedTag}" 태그` : ""}
        {query ? ` — "${query}" 검색 결과` : ""}
      </p>
      <div className="flex flex-col gap-4">
        <Suspense>
          <SearchInput />
        </Suspense>
        <TagFilter tags={tags} activeTag={normalizedTag} />
      </div>
      {paginatedPosts.length > 0 ? (
        <>
          <ul className="mt-8 flex flex-col gap-6">
            {paginatedPosts.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Pagination page={safePage} totalPages={totalPages} buildHref={buildHref} />
          </div>
        </>
      ) : (
        <p className="mt-8 text-muted-foreground">포스트를 찾을 수 없습니다.</p>
      )}
    </main>
  );
}
