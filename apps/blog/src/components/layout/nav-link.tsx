"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@blog/utils/cn";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-sm transition-colors hover:text-foreground",
        isActive ? "font-medium text-foreground" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
}
