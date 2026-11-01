import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { readDb } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await readDb();
  return {
    title: { default: settings.seo.title, template: `%s · ${settings.brand.name}` },
    description: settings.seo.description,
    openGraph: { title: settings.seo.title, description: settings.seo.description, images: settings.hero.images[0] ? [settings.hero.images[0]] : [] },
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f5f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-paper text-ink">{children}</body>
    </html>
  );
}
