"use client";

import { useState } from "react";
import { Check, Link2, Twitter, Linkedin } from "lucide-react";
import { cn } from "@blog/utils/cn";

interface ShareButtonsProps {
  title: string;
  url: string;
}

interface ShareLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function ShareLink({ href, label, children }: ShareLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </a>
  );
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard unavailable
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Share</span>
      <button
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          copied && "border-green-500/50 text-green-500"
        )}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>
      <ShareLink
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        label="Share on Twitter"
      >
        <Twitter className="h-3.5 w-3.5" aria-hidden="true" />
      </ShareLink>
      <ShareLink
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        label="Share on LinkedIn"
      >
        <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
      </ShareLink>
    </div>
  );
}
