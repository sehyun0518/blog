"use client";

import { useRef } from "react";
import { CopyButton } from "./copy-button";

type PreProps = React.HTMLAttributes<HTMLPreElement>;

export function CodeBlock({ children, ...props }: PreProps) {
  const ref = useRef<HTMLPreElement>(null);

  return (
    <div className="group relative">
      <pre ref={ref} {...props}>
        {children}
      </pre>
      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton preRef={ref} />
      </div>
    </div>
  );
}
