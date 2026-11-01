import type { Metadata } from "next";
import { getSite } from "@/lib/data";
import { inr } from "@/lib/utils";
import { PageHero } from "@/components/site/page-bits";
import { Reveal } from "@/components/site/motion";
import { LeadForm } from "@/components/site/lead-form";
import { FaqSection, Scholarship } from "@/components/site/home/sections-b";

export const metadata: Metadata = { title: "Admissions" };

const steps = [
  ["Enquire", "Fill the form or call us. A counsellor reaches out within 24 hours."],
  ["Attend a demo", "Sit in a real class with our faculty — completely free."],
  ["Take the LST", "Write the Lumina Scholarship Test to unlock up to 100% fee waiver."],
  ["Enrol", "Choose your batch, pay in easy instalments and start learning."],
];

export default async function AdmissionsPage() {
  const site = await getSite();
  const titles = site.courses.map((c) => c.title);
  return (
    <>
      <PageHero eyebrow="Admissions 2027" title="Four steps to your" accent="seat." subtitle="A transparent, counsellor-led admission process. No pressure, no hidden fees." />

      <section className="mx-auto max-w-[1400px] px-5 pb-20 md:px-10">
        <div className="grid gap-3 md:grid-cols-4 md:gap-4">
          {steps.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08} className="relative overflow-hidden rounded-[26px] bg-white p-6">
              <span className="text-7xl font-semibold leading-none tracking-[-0.06em] text-ink/[0.07]">0{i + 1}</span>
              <p className="mt-4 text-xl font-semibold tracking-tight">{t}</p>
              <p className="mt-2 text-[15px] text-muted">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-20 md:px-10">
        <Reveal>
          <h2 className="display text-[clamp(2.2rem,5vw,4rem)]">Fee <span className="serif text-accent">structure</span></h2>
        </Reveal>
        <Reveal className="mt-8 overflow-x-auto rounded-[26px] bg-white">
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Program</th>
                <th className="px-6 py-4 font-medium">Class</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Fee</th>
                <th className="px-6 py-4 font-medium">After discount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {site.courses.map((c) => (
                <tr key={c.id} className="transition hover:bg-paper/60">
                  <td className="px-6 py-4 font-semibold">
                    <span className="mr-2 inline-block size-2 rounded-full" style={{ background: c.color }} />
                    {c.title}
                  </td>
                  <td className="px-6 py-4 text-ink/70">{c.classLevel}</td>
                  <td className="px-6 py-4 text-ink/70">{c.duration}</td>
                  <td className="px-6 py-4 text-muted line-through">{inr(c.fee)}</td>
                  <td className="px-6 py-4 font-semibold">{inr(c.discountedFee || c.fee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <p className="mt-3 text-sm text-muted">Fees are inclusive of study material. Payable in 2–4 instalments; zero-cost EMI available.</p>
      </section>

      <Scholarship settings={site.settings} />

      <section id="scholarship-form" className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 md:px-10 lg:grid-cols-2">
        <Reveal>
          <h2 className="display text-[clamp(2.2rem,5vw,4rem)]">Register for the <span className="serif text-accent">scholarship test</span></h2>
          <p className="mt-5 max-w-md text-lg text-muted">Free registration. Choose online or offline mode after registering — our team will share your admit card on WhatsApp.</p>
        </Reveal>
        <Reveal delay={0.1} className="rounded-[28px] bg-white p-5 md:p-7">
          <LeadForm courses={titles} source="Scholarship test" submitLabel="Register for free" />
        </Reveal>
      </section>

      {site.faqs.length > 0 && <FaqSection faqs={site.faqs} settings={site.settings} />}
    </>
  );
}
