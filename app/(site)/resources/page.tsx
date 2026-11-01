import type { Metadata } from "next";
import { getSite } from "@/lib/data";
import { DownloadList, PageHero } from "@/components/site/page-bits";

export const metadata: Metadata = { title: "Resources" };

export default async function ResourcesPage() {
  const site = await getSite();
  return (
    <>
      <PageHero eyebrow="Free resources" title="Study smarter," accent="for free." subtitle="Previous year papers, formula handbooks and brochures — download instantly." />
      <DownloadList items={site.downloads} />
    </>
  );
}
