import { cn } from "@blog/utils/cn";
import { extractHeadings } from "@/lib/headings";

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const headings = extractHeadings(content);

  if (headings.length === 0) return null;

  return (
    <nav aria-labelledby="toc-heading" className={cn("rounded-lg border border-border p-4", className)}>
      <p id="toc-heading" className="mb-2 text-sm font-semibold text-foreground">목차</p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={`${heading.id}-${heading.level}`} className={heading.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${heading.id}`}
              className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
