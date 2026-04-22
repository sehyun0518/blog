export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const siteName = "Blog";
export const siteDescription = "A personal blog built with Next.js 15 and shadcn/ui.";
export const siteLocale = "ko-KR";
export const RSS_FEED_LIMIT = 50;
export const POSTS_PER_PAGE = 10;

export const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com";

export const giscusConfig = {
  repo: (process.env.NEXT_PUBLIC_GISCUS_REPO ?? "") as `${string}/${string}`,
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "",
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "",
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
} as const;

export function isGiscusEnabled(): boolean {
  const { repo, repoId, category, categoryId } = giscusConfig;
  return Boolean(repo && repoId && category && categoryId);
}
