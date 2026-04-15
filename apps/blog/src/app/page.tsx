import { Button } from "@blog/ui/button";
import { Card, CardContent, CardHeader } from "@blog/ui/card";
import { Badge } from "@blog/ui/badge";
import { formatDate } from "@blog/utils/date";

export default function HomePage(): React.JSX.Element {
  const today = formatDate(new Date());

  return (
    <main className="container mx-auto px-4 py-16">
      <section className="flex flex-col items-start gap-6">
        <Badge variant="secondary">Now live</Badge>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome to the Blog
        </h1>
        <p className="text-lg text-muted-foreground">
          Published on{" "}
          <time dateTime={new Date().toISOString()}>{today}</time>
        </p>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Getting Started
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is your new Next.js 15 blog. Start writing posts.
            </p>
            <Button className="mt-4" variant="default">
              Read more
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
