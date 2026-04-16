import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OGImageProps {
  params: { slug: string };
}

export default function OGImage({ params }: OGImageProps) {
  const post = getPostBySlug(params.slug);
  const title = post?.title ?? "Post not found";
  const description = post?.description ?? "";
  const tags = post?.tags ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#09090b",
          fontFamily: "sans-serif",
        }}
      >
        <p
          style={{
            fontSize: 20,
            color: "#71717a",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          blog
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 14,
                    color: "#a1a1aa",
                    backgroundColor: "#27272a",
                    padding: "4px 12px",
                    borderRadius: 9999,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#fafafa",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: 24,
                color: "#a1a1aa",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
