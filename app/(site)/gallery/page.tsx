import type { Metadata } from "next";
import { getSite } from "@/lib/data";
import { GalleryGrid, PageHero } from "@/components/site/page-bits";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const site = await getSite();
  return (
    <>
      <PageHero eyebrow="Gallery" title="Life at" accent={site.settings.brand.shortName + "."} subtitle="Classrooms, labs, celebrations and everything in between." />
      <GalleryGrid items={site.gallery} />
    </>
  );
}
