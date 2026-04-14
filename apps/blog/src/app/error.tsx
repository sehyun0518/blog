"use client";

import { useEffect } from "react";
import { Button } from "@blog/ui/button";

interface ErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps): React.JSX.Element {
  useEffect(() => {
    console.error("[app] Unhandled error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-2xl font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="text-muted-foreground">
        {error.message ?? "An unexpected error occurred."}
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </main>
  );
}
