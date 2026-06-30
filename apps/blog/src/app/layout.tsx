import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { siteUrl, siteName, siteDescription } from "@/lib/config";
import { ThemeProvider, Header, Footer, ReadingProgress, BackToTop } from "@/components/layout";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName,
    locale: "ko_KR",
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
    <html lang="ko" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReadingProgress />
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
