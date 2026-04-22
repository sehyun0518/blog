"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Heart } from "lucide-react";
import { cn } from "@blog/utils/cn";

interface LikeButtonProps {
  slug: string;
}

// Module-level CSRF cache — shared across all LikeButton instances.
// The CSRF cookie has a 1-hour TTL; we cache for 50 minutes to stay safe.
const CSRF_TTL_MS = 50 * 60 * 1000;
let csrfCache: { token: string; expiresAt: number } | null = null;

async function getCsrfToken(): Promise<string | null> {
  if (csrfCache && Date.now() < csrfCache.expiresAt) {
    return csrfCache.token;
  }
  try {
    const res = await fetch("/api/csrf");
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { token?: string } };
    const token = json.data?.token ?? null;
    if (token) csrfCache = { token, expiresAt: Date.now() + CSRF_TTL_MS };
    return token;
  } catch {
    return null;
  }
}

async function fetchLikeData(
  slug: string
): Promise<{ count: number; liked: boolean } | null> {
  try {
    const res = await fetch(`/api/likes/${slug}`);
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { count?: number; liked?: boolean };
    };
    if (json.data?.count === undefined) return null;
    return { count: json.data.count, liked: json.data.liked ?? false };
  } catch {
    return null;
  }
}

async function postToggle(
  slug: string
): Promise<{ count: number; liked: boolean } | null> {
  const csrfToken = await getCsrfToken();
  if (!csrfToken) return null;
  try {
    const res = await fetch(`/api/likes/${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { count?: number; liked?: boolean };
    };
    if (json.data?.count === undefined) return null;
    return { count: json.data.count, liked: json.data.liked ?? false };
  } catch {
    return null;
  }
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  // Ref-based guard: prevents concurrent requests without affecting visual state.
  const inFlight = useRef(false);

  useEffect(() => {
    setMounted(true);
    fetchLikeData(slug).then((data) => {
      if (data) {
        setCount(data.count);
        setLiked(data.liked);
      }
    });
  }, [slug]);

  const toggle = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;

    // Optimistic update — applied immediately, before any network call.
    const prevLiked = liked;
    const prevCount = count;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));

    const result = await postToggle(slug);
    if (result) {
      setCount(result.count);
      setLiked(result.liked);
    } else {
      // Revert to pre-click state on failure.
      setLiked(prevLiked);
      setCount(prevCount);
    }

    inFlight.current = false;
  }, [liked, count, slug]);

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label={liked ? "Unlike this post" : "Like this post"}
      aria-pressed={liked}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        liked && "border-red-500/50 text-red-500 hover:text-red-500"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-transform",
          liked && "fill-current scale-110"
        )}
        aria-hidden="true"
      />
      <span>{liked ? "Liked" : "Like"}</span>
      {count > 0 && (
        <span className="text-xs tabular-nums opacity-70">{count}</span>
      )}
    </button>
  );
}
