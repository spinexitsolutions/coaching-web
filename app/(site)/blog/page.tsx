import type { Metadata } from "next";
import { getSite } from "@/lib/data";
import { PageHero } from "@/components/site/page-bits";
import { PostCard, Updates } from "@/components/site/home/sections-b";
import { Reveal } from "@/components/site/motion";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  const site = await getSite();
  return (
    <>
      <PageHero eyebrow="Journal" title="Insights from" accent="the classroom." subtitle="Strategy guides, exam updates and wellbeing advice from our faculty and mentors." />
      <section className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {site.posts.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </div>
      </section>
      <Updates notices={site.notices} posts={[]} />
    </>
  );
}
