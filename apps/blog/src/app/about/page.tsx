import type { Metadata } from "next";
import { Github } from "lucide-react";
import { Badge } from "@blog/ui/badge";
import { siteName, githubUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteName}`,
};

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "TailwindCSS",
  "PostgreSQL",
  "Docker",
  "Git",
];

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">About</h1>

      <section aria-labelledby="bio-heading" className="mb-12">
        <h2 id="bio-heading" className="mb-4 text-2xl font-semibold">
          Hi, I&apos;m a developer
        </h2>
        <p className="text-lg leading-relaxed text-muted-foreground">
          I build things for the web. This blog is where I share what I learn — mostly about
          frontend development, system design, and the tools I use day to day.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          I care about clean code, good developer experience, and shipping things that actually work.
        </p>
      </section>

      <section aria-labelledby="skills-heading" className="mb-12">
        <h2 id="skills-heading" className="mb-4 text-2xl font-semibold">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="mb-4 text-2xl font-semibold">
          Contact
        </h2>
        <div className="flex flex-col gap-3">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
