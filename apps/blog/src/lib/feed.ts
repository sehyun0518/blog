import { getAllPostMeta } from "./posts";
import { siteUrl, siteName, siteDescription, RSS_FEED_LIMIT } from "./config";

function escapeXml(text: string): string {
  // Strip XML 1.0 control characters (invalid in XML 1.0 except \t \n \r)
  const sanitized = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildFeed(): string {
  const posts = getAllPostMeta().slice(0, RSS_FEED_LIMIT);
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
    `    <title>${escapeXml(siteName)}</title>`,
    `    <link>${siteUrl}</link>`,
    `    <description>${escapeXml(siteDescription)}</description>`,
    "    <language>en</language>",
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");
}
