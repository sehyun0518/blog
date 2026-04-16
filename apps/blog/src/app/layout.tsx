import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Blog", template: "%s | Blog" },
  description: "A personal blog built with Next.js 15 and shadcn/ui.",
  openGraph: {
    type: "website",
    siteName: "Blog",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
