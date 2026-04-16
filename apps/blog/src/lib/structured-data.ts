import type { Post, PostMeta } from "@/types/post";
import { siteUrl, siteName, siteDescription, siteLocale } from "./config";

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
  inLanguage: string;
  keywords: string[];
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
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
    name: siteName,
    url: siteUrl,
    description: siteDescription,
  };
}

export function buildBlogSchema(): BlogSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
  };
}

export function buildBlogPostingSchema(post: Post | PostMeta): BlogPostingSchema {
  const postUrl = `${siteUrl}/posts/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: postUrl,
    inLanguage: siteLocale,
    keywords: post.tags,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    author: {
      "@type": "Person",
      name: siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  };
}
