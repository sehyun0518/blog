import { buildLlmsTxt } from "@/lib/llms";

export async function GET(): Promise<Response> {
  const content = buildLlmsTxt();
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
