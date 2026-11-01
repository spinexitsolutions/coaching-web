import { getSite } from "@/lib/data";
import { Hero } from "@/components/site/home/hero";
import { ExamMarquee, Features, Manifesto, Programs, StatsBento } from "@/components/site/home/sections-a";
import { Batches, Enquiry, FacultySection, FaqSection, Gallery, Results, Scholarship, Testimonials, Updates } from "@/components/site/home/sections-b";
import type { SectionId } from "@/lib/types";

export default async function Home() {
  const site = await getSite();
  const { settings } = site;
  const courseTitles = site.courses.map((c) => c.title);

  const render: Record<SectionId, () => React.ReactNode> = {
    hero: () => <Hero settings={settings} toppers={site.results} />,
    marquee: () => <ExamMarquee />,
    manifesto: () => <Manifesto settings={settings} />,
    stats: () => <StatsBento settings={settings} image={site.gallery[0]?.image} />,
    programs: () => (site.courses.length ? <Programs courses={site.courses} /> : null),
    features: () => <Features />,
    results: () => <Results results={site.results} />,
    faculty: () => (site.faculty.length ? <FacultySection faculty={site.faculty} /> : null),
    batches: () => (site.batches.length ? <Batches batches={site.batches} /> : null),
    testimonials: () => (site.testimonials.length ? <Testimonials testimonials={site.testimonials} /> : null),
    scholarship: () => <Scholarship settings={settings} />,
    updates: () => <Updates notices={site.notices} posts={site.posts} />,
    gallery: () => (site.gallery.length ? <Gallery items={site.gallery} /> : null),
    faq: () => (site.faqs.length ? <FaqSection faqs={site.faqs} settings={settings} /> : null),
    enquiry: () => <Enquiry settings={settings} courses={courseTitles} />,
  };

  return (
    <>
      {settings.sections
        .filter((s) => s.enabled && render[s.id])
        .map((s) => (
          <div key={s.id}>{render[s.id]()}</div>
        ))}
    </>
  );
}
