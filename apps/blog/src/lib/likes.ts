import "server-only";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export interface LikeData {
  readonly count: number;
  readonly liked: boolean;
}

function isConfigured(): boolean {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}

function likeKey(slug: string): string {
  return `liked:${slug}`;
}

async function redisCommand<T>(command: unknown[]): Promise<T | null> {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result: T };
    return json.result;
  } catch {
    return null;
  }
}

async function redisPipeline<T>(commands: unknown[][]): Promise<T[] | null> {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result: T }[];
    return json.map((item) => item.result);
  } catch {
    return null;
  }
}

/**
 * Returns the like count and whether the visitor has liked the post.
 * Falls back to { count: 0, liked: false } when Redis is not configured.
 */
export async function getLikeData(
  slug: string,
  visitorId: string
): Promise<LikeData> {
  const results = await redisPipeline<number>([
    ["SISMEMBER", likeKey(slug), visitorId],
    ["SCARD", likeKey(slug)],
  ]);
  if (!results) return { count: 0, liked: false };
  return { liked: results[0] === 1, count: results[1] ?? 0 };
}

/**
 * Toggles the visitor's like for a post.
 * Adds the visitor to the set if absent; removes if already present.
 * Returns the updated count and liked state.
 */
export async function toggleLike(
  slug: string,
  visitorId: string
): Promise<LikeData> {
  const isMember = await redisCommand<number>([
    "SISMEMBER",
    likeKey(slug),
    visitorId,
  ]);

  if (isMember === 1) {
    const results = await redisPipeline<number>([
      ["SREM", likeKey(slug), visitorId],
      ["SCARD", likeKey(slug)],
    ]);
    return { liked: false, count: results?.[1] ?? 0 };
  }

  const results = await redisPipeline<number>([
    ["SADD", likeKey(slug), visitorId],
    ["SCARD", likeKey(slug)],
  ]);
  return { liked: true, count: results?.[1] ?? 1 };
}
