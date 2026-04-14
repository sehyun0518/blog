import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Blog", template: "%s | Blog" },
  description: "A personal blog built with Next.js 15 and shadcn/ui.",
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
