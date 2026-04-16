import { getAllPostMeta } from "./posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildFeed(): string {
  const posts = getAllPostMeta();
  const lastBuildDate = posts[0]
    ? new Date(posts[0].date).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const postUrl = `${siteUrl}/posts/${post.slug}`;
      const categories = post.tags
        .map((tag) => `    <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return [
        "  <item>",
        `    <title>${escapeXml(post.title)}</title>`,
        `    <link>${postUrl}</link>`,
        `    <guid isPermaLink="true">${postUrl}</guid>`,
        `    <description>${escapeXml(post.description)}</description>`,
        `    <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        categories,
        "  </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Blog</title>",
    `    <link>${siteUrl}</link>`,
    "    <description>A personal blog built with Next.js 15 and shadcn/ui.</description>",
    "    <language>en</language>",
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");
}
