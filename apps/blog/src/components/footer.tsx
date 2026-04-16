import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <p className="text-sm text-muted-foreground">&copy; {year} Blog</p>
        <nav aria-label="Footer navigation">
          <Link
            href="/feed.xml"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            RSS
          </Link>
        </nav>
      </div>
    </footer>
  );
}
