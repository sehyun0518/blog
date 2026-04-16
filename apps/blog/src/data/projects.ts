export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export const projects: Project[] = [
  {
    id: "blog",
    title: "Blog",
    description:
      "Personal blog built with Next.js 15, MDX, and Tailwind CSS in a pnpm monorepo. Features dark mode, full-text search, TOC, series, and giscus comments.",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "MDX", "pnpm"],
    githubUrl: "https://github.com",
  },
];
