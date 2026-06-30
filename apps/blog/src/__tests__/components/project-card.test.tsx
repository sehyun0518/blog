// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Project } from "@/data/projects";

vi.mock("@blog/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

vi.mock("@blog/ui/badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

import { ProjectCard } from "@/components/project";

const mockProject: Project = {
  id: "test",
  title: "Test Project",
  description: "A test project description.",
  tags: ["React", "TypeScript"],
  githubUrl: "https://github.com/test/repo",
  demoUrl: "https://example.com",
};

describe("ProjectCard", () => {
  it("renders project title", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("renders project description", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("A test project description.")).toBeInTheDocument();
  });

  it("renders all tags", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders GitHub link when provided", () => {
    render(<ProjectCard project={mockProject} />);
    expect(
      screen.getByRole("link", { name: "Test Project GitHub repository" })
    ).toHaveAttribute("href", "https://github.com/test/repo");
  });

  it("renders demo link when provided", () => {
    render(<ProjectCard project={mockProject} />);
    expect(
      screen.getByRole("link", { name: "Test Project live demo" })
    ).toHaveAttribute("href", "https://example.com");
  });

  it("does not render GitHub link when not provided", () => {
    const { githubUrl: _, ...rest } = mockProject;
    render(<ProjectCard project={rest} />);
    expect(screen.queryByRole("link", { name: /github repository/i })).toBeNull();
  });

  it("does not render demo link when not provided", () => {
    const { demoUrl: _, ...rest } = mockProject;
    render(<ProjectCard project={rest} />);
    expect(screen.queryByRole("link", { name: /live demo/i })).toBeNull();
  });
});
