import Link from "next/link";
import { siteName } from "@/lib/config";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-semibold text-foreground transition-colors hover:text-foreground/80"
        >
          {siteName}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
