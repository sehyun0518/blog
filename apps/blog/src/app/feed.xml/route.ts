import { buildFeed } from "@/lib/feed";

export async function GET(): Promise<Response> {
  const feed = buildFeed();
  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
