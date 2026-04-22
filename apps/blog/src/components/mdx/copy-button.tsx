"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  preRef: React.RefObject<HTMLPreElement | null>;
}

export function CopyButton({ preRef }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const code = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // clipboard unavailable in non-secure contexts
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "복사됨" : "코드 복사"}
      className="rounded-md border border-border bg-background/80 p-1.5 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </button>
  );
}
