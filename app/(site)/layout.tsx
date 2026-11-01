import { getSite } from "@/lib/data";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { IntroProvider, IntroScript } from "@/components/site/intro";
import { AdmissionPopup, FloatingActions } from "@/components/site/floating";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  const { settings } = site;
  const featured = site.courses.find((c) => c.featured) || site.courses[0];
  const theme = `:root{--accent:${settings.theme.accent};--accent-2:${settings.theme.accent2};--ink:${settings.theme.ink};--paper:${settings.theme.paper};}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: theme }} />
      <IntroScript oncePerSession={settings.intro.oncePerSession} />
      <SmoothScroll />
      <IntroProvider intro={settings.intro} brand={settings.brand.name}>
        <Navbar settings={settings} featured={featured} />
        <main className="relative">{children}</main>
        <Footer settings={settings} courses={site.courses} />
        <FloatingActions settings={settings} />
        <AdmissionPopup settings={settings} courses={site.courses.map((c) => c.title)} />
      </IntroProvider>
    </>
  );
}
