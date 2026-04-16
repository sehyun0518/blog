import type { PostMeta } from "@/types/post";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
}

export interface BlogSchema {
  "@context": "https://schema.org";
  "@type": "Blog";
  name: string;
  url: string;
  description: string;
}

export interface BlogPostingSchema {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  datePublished: string;
  url: string;
  keywords: string[];
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    url: string;
  };
}

export function buildWebSiteSchema(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Blog",
    url: siteUrl,
    description: "A personal blog built with Next.js 15 and shadcn/ui.",
  };
}

export function buildBlogSchema(): BlogSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog",
    url: siteUrl,
    description: "A personal blog built with Next.js 15 and shadcn/ui.",
  };
}

export function buildBlogPostingSchema(post: PostMeta): BlogPostingSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${siteUrl}/posts/${post.slug}`,
    keywords: post.tags,
    author: {
      "@type": "Person",
      name: "Blog Author",
    },
    publisher: {
      "@type": "Organization",
      name: "Blog",
      url: siteUrl,
    },
  };
}
