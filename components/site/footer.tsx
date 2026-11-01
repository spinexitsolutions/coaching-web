"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUp, ArrowUpRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Settings } from "@/lib/types";
import { Magnetic } from "./motion";

export function Footer({ settings, courses }: { settings: Settings; courses: { title: string; slug: string }[] }) {
  const { brand, nav } = settings;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const letters = brand.shortName.split("");

  return (
    <footer ref={ref} className="grain relative overflow-hidden bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-5 pt-24 md:px-10 md:pt-32">
        <div className="flex flex-col items-start justify-between gap-10 border-b border-white/10 pb-16 md:flex-row md:items-end">
          <h2 className="display max-w-3xl text-[clamp(2.6rem,7vw,5.5rem)]">
            Your rank <span className="serif text-accent2">starts</span> with one conversation.
          </h2>
          <Magnetic>
            <Link href="/admissions" className="group grid size-36 place-items-center rounded-full bg-accent2 text-center text-sm font-semibold text-ink transition-transform duration-500 hover:scale-105 md:size-44">
              <span className="flex flex-col items-center gap-1">
                <ArrowUpRight className="size-6 transition-transform duration-500 group-hover:rotate-45" />
                Start your
                <br />
                admission
              </span>
            </Link>
          </Magnetic>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <p className="text-xl font-semibold tracking-tight">{brand.name}</p>
            <p className="mt-1 text-lg text-white/60">{brand.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {(["instagram", "youtube", "facebook", "linkedin"] as const)
                .filter((k) => brand[k])
                .map((k) => (
                  <a key={k} href={brand[k]} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-sm capitalize text-white/70 transition hover:border-white hover:bg-white hover:text-ink">
                    {k}
                  </a>
                ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-5 text-white/40">Explore</p>
            <ul className="space-y-3 text-[15px]">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-white/40">Programs</p>
            <ul className="space-y-3 text-[15px]">
              {courses.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/courses/${c.slug}`} className="text-white/70 transition hover:text-white">
                    {c.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/gallery" className="text-white/70 transition hover:text-white">Campus gallery</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-white/40">Visit us</p>
            <ul className="space-y-4 text-[15px] text-white/70">
              <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-accent2" />{brand.address}</li>
              <li><a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="flex gap-3 hover:text-white"><Phone className="mt-0.5 size-4 shrink-0 text-accent2" />{brand.phone}</a></li>
              <li><a href={`mailto:${brand.email}`} className="flex gap-3 hover:text-white"><Mail className="mt-0.5 size-4 shrink-0 text-accent2" />{brand.email}</a></li>
              <li className="flex gap-3"><Clock className="mt-0.5 size-4 shrink-0 text-accent2" />{brand.hours}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative select-none overflow-hidden" aria-hidden>
        <motion.div style={{ y }} className="flex justify-center whitespace-nowrap px-2 text-[clamp(4rem,21vw,20rem)] wide font-[800] leading-[0.8] tracking-[-0.06em] text-white">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              initial={{ y: "60%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
              className={i === letters.length - 1 ? "text-accent2" : ""}
            >
              {l}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 border-t border-white/10 px-5 py-6 text-[13px] text-white/45 md:flex-row md:px-10">
        <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link href="/contact" className="hover:text-white">Privacy</Link>
          <Link href="/contact" className="hover:text-white">Terms</Link>
          <button onClick={() => (window.__lenis ? window.__lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0, behavior: "smooth" }))} className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-white/70 transition hover:bg-white hover:text-ink">
            Back to top <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
