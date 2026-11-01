import type { Metadata, Viewport } from "next";
import "@fontsource-variable/mona-sans/wdth.css";
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
  themeColor: "#f2f2ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-paper text-ink">{children}</body>
    </html>
  );
}
