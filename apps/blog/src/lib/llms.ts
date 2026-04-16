import { getAllPostMeta } from "./posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function buildLlmsTxt(): string {
  const posts = getAllPostMeta();

  const postLines = posts
    .map((post) => {
      const url = `${siteUrl}/posts/${post.slug}`;
      const tags = post.tags.length > 0 ? ` [${post.tags.join(", ")}]` : "";
      return `- [${post.title}](${url}): ${post.description}${tags} (${post.date})`;
    })
    .join("\n");

  return [
    "# Blog",
    "",
    "> A personal blog built with Next.js 15 and shadcn/ui.",
    "",
    `URL: ${siteUrl}`,
    `Feed: ${siteUrl}/feed.xml`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
    "## Posts",
    "",
    postLines,
  ].join("\n");
}
