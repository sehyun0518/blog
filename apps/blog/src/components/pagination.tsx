import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@blog/utils/cn";
import { buttonVariants } from "@blog/ui/button";

export interface PaginationProps {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
  className?: string;
}

export function Pagination({ page, totalPages, buildHref, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-3", className)}>
      {hasPrev ? (
        <Link
          href={buildHref(page - 1)}
          aria-label="이전 페이지"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "pointer-events-none opacity-40")}
        >
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      <span className="text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={buildHref(page + 1)}
          aria-label="다음 페이지"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "pointer-events-none opacity-40")}
        >
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
