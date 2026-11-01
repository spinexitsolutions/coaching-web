import type { Metadata } from "next";
import { getSite } from "@/lib/data";
import { CourseExplorer, PageHero } from "@/components/site/page-bits";
import { Batches, Enquiry } from "@/components/site/home/sections-b";

export const metadata: Metadata = { title: "Programs" };

export default async function CoursesPage() {
  const site = await getSite();
  return (
    <>
      <PageHero eyebrow="Programs" title="Find the program that" accent="fits you." subtitle="From Class 6 foundations to JEE Advanced and NEET — every program combines small batches, top faculty and relentless practice." />
      <CourseExplorer courses={site.courses} />
      {site.batches.length > 0 && <Batches batches={site.batches} />}
      <Enquiry settings={site.settings} courses={site.courses.map((c) => c.title)} />
    </>
  );
}
