"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@blog/utils/cn";

interface LikeButtonProps {
  slug: string;
}

function storageKey(slug: string) {
  return `liked-${slug}`;
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLiked(localStorage.getItem(storageKey(slug)) === "true");
  }, [slug]);

  function toggle() {
    const next = !liked;
    setLiked(next);
    if (next) {
      localStorage.setItem(storageKey(slug), "true");
    } else {
      localStorage.removeItem(storageKey(slug));
    }
  }

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
        className={cn("h-4 w-4 transition-transform", liked && "fill-current scale-110")}
        aria-hidden="true"
      />
      {liked ? "Liked" : "Like"}
    </button>
  );
}
