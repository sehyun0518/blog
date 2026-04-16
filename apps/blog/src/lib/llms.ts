import { getAllPostMeta } from "./posts";
import { siteUrl, siteName, siteDescription } from "./config";

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
    `# ${siteName}`,
    "",
    `> ${siteDescription}`,
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
