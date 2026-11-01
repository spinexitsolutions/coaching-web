import type { Metadata } from "next";
import Image from "next/image";
import { getSite } from "@/lib/data";
import { PageHero } from "@/components/site/page-bits";
import { Reveal, Parallax } from "@/components/site/motion";
import { Manifesto, StatsBento } from "@/components/site/home/sections-a";
import { FacultySection, Gallery } from "@/components/site/home/sections-b";

export const metadata: Metadata = { title: "About" };

const timeline = [
  ["2012", "Started with 18 students in a two-room classroom."],
  ["2015", "First AIR under 100 in JEE Advanced."],
  ["2018", "Launched NEET and Foundation divisions."],
  ["2021", "Hybrid learning platform & parent app."],
  ["2024", "New 40,000 sq ft campus in Sector 18."],
  ["2026", "AIR 7 in JEE Advanced, AIR 23 in NEET."],
];

const values = [
  ["Clarity over cramming", "Concepts first. Shortcuts only once you understand why they work."],
  ["Every student, by name", "Small batches and personal mentors — no one gets lost in the crowd."],
  ["Honest feedback", "Weekly reports for students and parents. No sugar-coating, no fear."],
  ["Wellbeing matters", "Counsellors, breaks and sleep are part of the plan, not an afterthought."],
];

export default async function AboutPage() {
  const site = await getSite();
  return (
    <>
      <PageHero eyebrow="About us" title="Fourteen years of" accent="lighting minds." subtitle={site.settings.brand.tagline} />
      <section className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Parallax className="aspect-[16/9] rounded-[32px] md:aspect-[21/9]" offset={50}>
          <div className="relative h-full w-full">
            <Image src={site.settings.hero.images[0]} alt="" fill sizes="100vw" className="object-cover" />
          </div>
        </Parallax>
      </section>
      <Manifesto settings={site.settings} />
      <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <Reveal>
          <h2 className="display text-[clamp(2.2rem,5vw,4.5rem)]">Our <span className="serif text-accent">journey</span></h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] bg-line md:grid-cols-3">
          {timeline.map(([y, t], i) => (
            <Reveal key={y} delay={(i % 3) * 0.08} className="bg-paper p-7">
              <p className="text-5xl font-semibold tracking-[-0.05em] text-accent">{y}</p>
              <p className="mt-3 text-lg">{t}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-5 pb-12 md:px-10">
        <Reveal>
          <h2 className="display text-[clamp(2.2rem,5vw,4.5rem)]">What we <span className="serif text-accent">believe</span></h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {values.map(([t, d], i) => (
            <Reveal key={t} delay={(i % 2) * 0.08} className="rounded-[26px] bg-white p-7">
              <p className="text-2xl font-semibold tracking-tight">{t}</p>
              <p className="mt-2 text-muted">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <StatsBento settings={site.settings} image={site.gallery[0]?.image} />
      {site.faculty.length > 0 && <FacultySection faculty={site.faculty} />}
      {site.gallery.length > 0 && <Gallery items={site.gallery} />}
    </>
  );
}
