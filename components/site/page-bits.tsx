"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Download, FileText, Plus } from "lucide-react";
import type { Course, Download as DL, GalleryItem, Result } from "@/lib/types";
import { cn, inr } from "@/lib/utils";
import { Reveal, SplitWords, EASE } from "./motion";

export function PageHero({ eyebrow, title, accent, subtitle, children }: { eyebrow: string; title: string; accent?: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden px-5 pb-14 pt-32 md:px-10 md:pb-20 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_65%)]"
      />
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="eyebrow mb-6 flex items-center gap-2 text-muted">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            {eyebrow}
          </p>
        </Reveal>
        <h1 className="display max-w-5xl text-[clamp(2.8rem,9vw,8rem)]">
          <SplitWords text={title} />
          {accent && (
            <>
              {" "}
              <SplitWords text={accent} delay={0.15} wordClassName="serif pr-[0.05em] text-accent" />
            </>
          )}
        </h1>
        {subtitle && (
          <Reveal delay={0.3}>
            <p className="mt-7 max-w-2xl text-lg text-muted">{subtitle}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

function Chips({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
      {items.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={cn("relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors", value === c ? "text-white" : "bg-white text-ink/70 hover:text-ink")}
        >
          {value === c && <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
          <span className="relative">{c}</span>
        </button>
      ))}
    </div>
  );
}

export function CourseExplorer({ courses }: { courses: Course[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(courses.map((c) => c.category)))], [courses]);
  const [cat, setCat] = useState("All");
  const list = courses.filter((c) => cat === "All" || c.category === cat);
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
      <Chips items={cats} value={cat} onChange={setCat} />
      <motion.div layout className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Link href={`/courses/${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={c.image} alt={c.title} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-apple)] group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-25 mix-blend-multiply" style={{ background: c.color }} />
                  <span className="eyebrow absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-ink">{c.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl font-semibold tracking-tight">{c.title}</h3>
                  <p className="serif text-lg text-muted">{c.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {[c.classLevel, c.duration, c.mode].filter(Boolean).map((t) => (
                      <span key={t} className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink/70">{t}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-6">
                    <div>
                      {c.discountedFee > 0 && c.discountedFee < c.fee && <p className="text-sm text-muted line-through">{inr(c.fee)}</p>}
                      <p className="text-xl font-semibold">{inr(c.discountedFee || c.fee)}</p>
                    </div>
                    <span className="grid size-11 place-items-center rounded-full text-white transition-transform duration-500 group-hover:rotate-45" style={{ background: c.color }}>
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

export function ResultsExplorer({ results }: { results: Result[] }) {
  const years = useMemo(() => ["All", ...Array.from(new Set(results.map((r) => r.year))).sort().reverse()], [results]);
  const exams = useMemo(() => ["All exams", ...Array.from(new Set(results.map((r) => r.exam)))], [results]);
  const [year, setYear] = useState("All");
  const [exam, setExam] = useState("All exams");
  const list = results.filter((r) => (year === "All" || r.year === year) && (exam === "All exams" || r.exam === exam));
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between">
        <Chips items={exams} value={exam} onChange={setExam} />
        <div className="flex gap-2">
          {years.map((y) => (
            <button key={y} onClick={() => setYear(y)} className={cn("rounded-full border px-4 py-2 text-sm transition", year === y ? "border-accent bg-accent text-white" : "border-line bg-white text-ink/70")}>
              {y}
            </button>
          ))}
        </div>
      </div>
      <motion.div layout className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((r) => (
            <motion.div key={r.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, ease: EASE }} className="group overflow-hidden rounded-[26px] bg-white">
              <div className="relative aspect-square overflow-hidden">
                <Image src={r.image} alt={r.name} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute bottom-3 left-3 rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-white">{r.rank}</span>
              </div>
              <div className="p-4 md:p-5">
                <p className="font-semibold tracking-tight">{r.name}</p>
                <p className="text-sm text-muted">{r.exam} · {r.year}{r.score ? ` · ${r.score}` : ""}</p>
                {r.quote && <p className="serif mt-3 hidden text-lg leading-snug text-ink/70 md:block">&ldquo;{r.quote}&rdquo;</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {!list.length && <p className="py-20 text-center text-muted">No results for this filter yet.</p>}
    </section>
  );
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((g) => g.category)))], [items]);
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const list = items.filter((g) => cat === "All" || g.category === cat);
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
      <Chips items={cats} value={cat} onChange={setCat} />
      <div className="mt-8 columns-2 gap-3 md:columns-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4">
        {list.map((g, i) => (
          <motion.button
            key={g.id}
            layoutId={`g-${g.id}`}
            onClick={() => setActive(g)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
            className={cn("group relative block w-full overflow-hidden rounded-[22px]", i % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/3]")}
          >
            <Image src={g.image} alt={g.title} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium opacity-0 transition group-hover:opacity-100">{g.title}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {active && (
          <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.div layoutId={`g-${active.id}`} className="relative aspect-[4/3] w-full max-w-5xl overflow-hidden rounded-[28px]">
              <Image src={active.image} alt={active.title} fill sizes="90vw" className="object-cover" />
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-xl font-semibold text-white">{active.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function Syllabus({ items }: { items: string[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[24px] bg-white">
      {items.map((s, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-4 px-6 py-5 text-left">
            <span className="eyebrow text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1 text-lg font-medium tracking-tight">{s}</span>
            <motion.span animate={{ rotate: open === i ? 45 : 0 }}>
              <Plus className="size-4" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden px-6 text-[15px] text-muted">
                <span className="block pb-5 pl-9">Concept lectures, solved examples, DPPs (daily practice problems), a chapter test and a dedicated doubt-clearing session for {s}.</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function DownloadList({ items }: { items: DL[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((d) => d.category)))], [items]);
  const [cat, setCat] = useState("All");
  const list = items.filter((d) => cat === "All" || d.category === cat);
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
      <Chips items={cats} value={cat} onChange={setCat} />
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {list.map((d, i) => (
          <Reveal key={d.id} delay={i * 0.05}>
            <a href={d.fileUrl || "#"} target={d.fileUrl && d.fileUrl !== "#" ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-[22px] bg-white p-4 pr-5 transition hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)]">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-paper text-accent">
                <FileText className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold tracking-tight">{d.title}</p>
                <p className="text-sm text-muted">{d.category}{d.size ? ` · ${d.size}` : ""}</p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-white transition group-hover:bg-accent">
                <Download className="size-4" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
