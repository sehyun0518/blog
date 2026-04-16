"use client";

import { useRouter } from "next/navigation";
import { TagBadge } from "@blog/ui/tag-badge";

interface TagFilterProps {
  tags: string[];
  activeTag?: string | undefined;
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  const router = useRouter();

  if (tags.length === 0) return null;

  function handleClick(tag: string) {
    if (activeTag === tag) {
      router.push("/");
    } else {
      router.push(`/?tag=${encodeURIComponent(tag)}`);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagBadge
          key={tag}
          tag={tag}
          active={activeTag === tag}
          onClick={() => handleClick(tag)}
        />
      ))}
    </div>
  );
}
