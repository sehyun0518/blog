import * as React from "react";
import { Badge } from "./badge";
import { cn } from "@blog/utils/cn";

export interface TagBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tag: string;
  active?: boolean;
}

const TagBadge = React.forwardRef<HTMLButtonElement, TagBadgeProps>(
  ({ tag, active = false, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn("cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    >
      <Badge variant={active ? "default" : "secondary"}>
        {tag}
      </Badge>
    </button>
  )
);
TagBadge.displayName = "TagBadge";

export { TagBadge };
