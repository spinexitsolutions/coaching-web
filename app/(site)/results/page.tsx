import type { Metadata } from "next";
import { getSite } from "@/lib/data";
import { PageHero, ResultsExplorer } from "@/components/site/page-bits";
import { StatsBento } from "@/components/site/home/sections-a";
import { Testimonials } from "@/components/site/home/sections-b";

export const metadata: Metadata = { title: "Results" };

export default async function ResultsPage() {
  const site = await getSite();
  return (
    <>
      <PageHero eyebrow="Hall of fame" title="Every rank is a" accent="story." subtitle="Meet the students who trusted the process — and topped India's toughest exams." />
      <ResultsExplorer results={site.results} />
      <StatsBento settings={site.settings} image={site.gallery[3]?.image} />
      {site.testimonials.length > 0 && <Testimonials testimonials={site.testimonials} />}
    </>
  );
}
