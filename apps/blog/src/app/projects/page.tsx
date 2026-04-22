import type { Metadata } from "next";
import { siteName } from "@/lib/config";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: "Projects",
  description: `Projects by ${siteName}`,
};

export default function ProjectsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Projects</h1>
      <p className="mb-10 text-muted-foreground">
        Things I&apos;ve built or am building.
      </p>
      {projects.length > 0 ? (
        <ul className="flex flex-col gap-6">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No projects yet.</p>
      )}
    </main>
  );
}
