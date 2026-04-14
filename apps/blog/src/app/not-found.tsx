import Link from "next/link";
import { Button } from "@blog/ui/button";

export default function NotFound(): React.JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Button asChild variant="default">
        <Link href="/">Return home</Link>
      </Button>
    </main>
  );
}
