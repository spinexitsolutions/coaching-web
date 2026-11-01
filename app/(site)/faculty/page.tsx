import type { Metadata } from "next";
import { getSite } from "@/lib/data";
import { PageHero } from "@/components/site/page-bits";
import { FacultyCard } from "@/components/site/home/sections-b";

export const metadata: Metadata = { title: "Faculty" };

export default async function FacultyPage() {
  const site = await getSite();
  return (
    <>
      <PageHero eyebrow="Faculty" title="Mentors who" accent="care." subtitle="IITians, AIIMS doctors and career educators with decades of combined experience — and the patience to explain it one more time." />
      <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {site.faculty.map((f, i) => (
            <FacultyCard key={f.id} f={f} delay={(i % 4) * 0.06} />
          ))}
        </div>
      </section>
    </>
  );
}
