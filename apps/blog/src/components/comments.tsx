"use client";

import { useTheme } from "next-themes";
import GiscusWidget from "@giscus/react";
import { giscusConfig } from "@/lib/config";

export function Comments() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <section aria-labelledby="comments-heading" className="mt-12 border-t border-border pt-8">
      <h2 id="comments-heading" className="mb-6 text-lg font-semibold text-foreground">
        Comments
      </h2>
      <GiscusWidget
        repo={giscusConfig.repo}
        repoId={giscusConfig.repoId}
        category={giscusConfig.category}
        categoryId={giscusConfig.categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme}
        lang="en"
        loading="lazy"
      />
    </section>
  );
}
