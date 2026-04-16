import { ImageResponse } from "next/og";
import { siteName } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          backgroundColor: "#09090b",
          fontFamily: "sans-serif",
        }}
      >
        <p
          style={{
            fontSize: 20,
            color: "#71717a",
            marginBottom: 16,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {siteName.toLowerCase()}
        </p>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#fafafa",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          A personal blog built with Next.js
        </h1>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
