import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Clock, GraduationCap, MonitorPlay } from "lucide-react";
import { getSite } from "@/lib/data";
import { inr } from "@/lib/utils";
import { PageHero, Syllabus } from "@/components/site/page-bits";
import { LeadForm } from "@/components/site/lead-form";
import { Reveal } from "@/components/site/motion";
import { FacultyCard } from "@/components/site/home/sections-b";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite();
  const c = site.courses.find((x) => x.slug === slug);
  return c ? { title: c.title, description: c.description } : {};
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const site = await getSite();
  const c = site.courses.find((x) => x.slug === slug);
  if (!c) notFound();
  const batches = site.batches.filter((b) => b.course === c.title);
  const off = c.fee > c.discountedFee && c.discountedFee > 0 ? Math.round(((c.fee - c.discountedFee) / c.fee) * 100) : 0;

  return (
    <>
      <PageHero eyebrow={`${c.category} · ${c.classLevel}`} title={c.title} subtitle={c.tagline} />
      <section className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="relative aspect-[16/9] overflow-hidden rounded-[32px] md:aspect-[21/9]">
          <Image src={c.image} alt={c.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ background: c.color }} />
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-14">
          <Reveal>
            <div className="grid grid-cols-3 gap-3">
              {[
                [Clock, "Duration", c.duration],
                [MonitorPlay, "Mode", c.mode],
                [GraduationCap, "For", c.classLevel],
              ].map(([I, l, v]) => {
                const Icon = I as typeof Clock;
                return (
                  <div key={l as string} className="rounded-[22px] bg-white p-4 md:p-5">
                    <Icon className="size-5 text-accent" />
                    <p className="mt-3 text-xs text-muted">{l as string}</p>
                    <p className="font-semibold tracking-tight">{v as string}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight">Overview</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">{c.description}</p>
          </Reveal>
          {c.highlights.length > 0 && (
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight">What you get</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {c.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full text-white" style={{ background: c.color }}>
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {c.syllabus.length > 0 && (
            <Reveal>
              <h2 className="mb-6 text-3xl font-semibold tracking-tight">Syllabus</h2>
              <Syllabus items={c.syllabus} />
            </Reveal>
          )}
          {batches.length > 0 && (
            <Reveal>
              <h2 className="mb-6 text-3xl font-semibold tracking-tight">Upcoming batches</h2>
              <div className="space-y-3">
                {batches.map((b) => (
                  <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5">
                    <div>
                      <p className="font-semibold">{b.name}</p>
                      <p className="text-sm text-muted">{b.timing} · {b.mode}</p>
                    </div>
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">{Math.max(0, b.seats - b.filled)} seats left</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[30px] bg-ink p-6 text-white md:p-8">
            <p className="eyebrow text-white/50">Total program fee</p>
            <div className="mt-3 flex items-end gap-3">
              <p className="text-5xl font-semibold tracking-[-0.04em]">{inr(c.discountedFee || c.fee)}</p>
              {off > 0 && <span className="mb-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold">{off}% off</span>}
            </div>
            {off > 0 && <p className="mt-1 text-white/40 line-through">{inr(c.fee)}</p>}
            <p className="mt-2 text-sm text-white/60">Easy instalments · Scholarships up to 100%</p>
            <div className="mt-6">
              <LeadForm dark compact courses={site.courses.map((x) => x.title)} defaultCourse={c.title} source="Course page" submitLabel="Enquire now" />
            </div>
          </div>
        </aside>
      </section>

      {site.faculty.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">Your mentors</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {site.faculty.slice(0, 4).map((f, i) => (
              <FacultyCard key={f.id} f={f} delay={i * 0.06} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
