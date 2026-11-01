import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSite } from "@/lib/data";
import { PageHero } from "@/components/site/page-bits";
import { Reveal } from "@/components/site/motion";
import { LeadForm } from "@/components/site/lead-form";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const site = await getSite();
  const b = site.settings.brand;
  const cards = [
    [Phone, "Call", b.phone, `tel:${b.phone.replace(/\s/g, "")}`],
    [Mail, "Email", b.email, `mailto:${b.email}`],
    [MapPin, "Visit", b.address, `https://maps.google.com/?q=${encodeURIComponent(b.address)}`],
    [Clock, "Hours", b.hours, ""],
  ] as const;
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk about your" accent="goals." subtitle="Drop by the campus, call us, or leave a message — we usually reply within a few hours." />
      <section className="mx-auto grid max-w-[1400px] gap-4 px-5 md:grid-cols-4 md:px-10">
        {cards.map(([Icon, l, v, href], i) => (
          <Reveal key={l} delay={i * 0.06}>
            <a href={href || undefined} target={l === "Visit" ? "_blank" : undefined} rel="noreferrer" className="block h-full rounded-[24px] bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)]">
              <Icon className="size-5 text-accent" />
              <p className="mt-4 text-xs uppercase tracking-wider text-muted">{l}</p>
              <p className="mt-1 font-semibold leading-snug">{v}</p>
            </a>
          </Reveal>
        ))}
      </section>
      <section className="mx-auto grid max-w-[1400px] gap-4 px-5 py-16 md:px-10 lg:grid-cols-2">
        <Reveal className="rounded-[28px] bg-white p-5 md:p-8">
          <h2 className="mb-6 text-3xl font-semibold tracking-tight">Send us a message</h2>
          <LeadForm courses={site.courses.map((c) => c.title)} source="Contact page" submitLabel="Send message" />
        </Reveal>
        <Reveal delay={0.1} className="min-h-[420px] overflow-hidden rounded-[28px] bg-white">
          {b.mapEmbed ? <iframe src={b.mapEmbed} title="Map" className="h-full min-h-[420px] w-full grayscale" loading="lazy" /> : null}
        </Reveal>
      </section>
    </>
  );
}
