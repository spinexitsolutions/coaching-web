"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock, MapPin, Plus, Quote, Star, Mail, Phone, Check } from "lucide-react";
import type { Batch, Faculty, Faq, GalleryItem, Notice, Post, Result, Settings, Testimonial } from "@/lib/types";
import { cn, fmtDate } from "@/lib/utils";
import { Reveal, SectionHeading, EASE, Magnetic } from "../motion";
import { LeadForm } from "../lead-form";

/* ───────────────────────── Results ───────────────────────── */

export function Results({ results }: { results: Result[] }) {
  const [top, ...rest] = results;
  if (!top) return null;
  const list = rest.length ? rest : [top];
  return (
    <section id="results" className="grain relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading dark eyebrow="Results 2026" title="Results that speak" accent="louder." />
          <Reveal>
            <Link href="/results" className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold transition hover:bg-white hover:text-ink">
              All results <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
            </Link>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <div className="grid overflow-hidden rounded-[32px] bg-white/[0.04] ring-1 ring-white/10 md:grid-cols-[1fr_1.2fr]">
            <div className="relative aspect-[4/5] md:aspect-auto">
              <Image src={top.image} alt={top.name} fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-ink/40" />
            </div>
            <div className="flex flex-col justify-between gap-10 p-7 md:p-12">
              <div>
                <span className="eyebrow rounded-full bg-accent px-3 py-1.5">{top.exam} · {top.year}</span>
                <p className="mt-8 text-[clamp(5rem,13vw,11rem)] font-semibold leading-[0.85] tracking-[-0.06em]">
                  {top.rank.split(" ")[0]}
                  <span className="serif ml-3 font-normal text-accent">{top.rank.split(" ").slice(1).join(" ")}</span>
                </p>
              </div>
              <div>
                <Quote className="size-8 text-accent" />
                <p className="mt-3 text-2xl font-medium leading-snug tracking-tight md:text-3xl">&ldquo;{top.quote}&rdquo;</p>
                <p className="mt-5 text-white/60">
                  {top.name} · Score {top.score}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="marquee-pause mask-fade-x mt-6 flex overflow-hidden md:mt-8">
        <div className="animate-marquee flex shrink-0 gap-4 pr-4" style={{ ["--marquee-duration" as string]: `${Math.max(30, list.length * 7)}s` }}>
          {[...list, ...list, ...list, ...list].map((r, i) => (
            <div key={i} className="group flex w-[280px] shrink-0 items-center gap-4 rounded-3xl bg-white/[0.05] p-3 pr-5 ring-1 ring-white/10 transition hover:bg-white/10">
              <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
                <Image src={r.image} alt={r.name} fill sizes="64px" className="object-cover grayscale transition duration-500 group-hover:grayscale-0" />
              </span>
              <div className="min-w-0">
                <p className="text-2xl font-semibold leading-none tracking-tight text-accent">{r.rank}</p>
                <p className="mt-1.5 truncate text-sm font-medium">{r.name}</p>
                <p className="text-xs text-white/50">
                  {r.exam} {r.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Faculty ───────────────────────── */

export function FacultySection({ faculty }: { faculty: Faculty[] }) {
  return (
    <section id="faculty" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading eyebrow="Faculty" title="Taught by people who" accent="cracked it" after="themselves." />
        <Reveal>
          <Link href="/faculty" className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold transition hover:border-ink">
            Meet everyone <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </Link>
        </Reveal>
      </div>
      <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {faculty.slice(0, 4).map((f, i) => (
          <FacultyCard key={f.id} f={f} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}

export function FacultyCard({ f, delay = 0 }: { f: Faculty; delay?: number }) {
  return (
    <Reveal delay={delay} className="group relative aspect-[3/4] overflow-hidden rounded-[26px] bg-ink">
      <Image src={f.image} alt={f.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-all duration-[1.2s] ease-[var(--ease-apple)] group-hover:scale-105 md:grayscale md:group-hover:grayscale-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <span className="eyebrow absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] text-ink backdrop-blur md:left-4 md:top-4">{f.subject}</span>
      <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-5">
        <p className="text-lg font-semibold leading-tight tracking-tight md:text-xl">{f.name}</p>
        <p className="text-xs text-white/70 md:text-sm">{f.qualification}</p>
        <div className="grid grid-rows-[0fr] transition-all duration-500 ease-[var(--ease-apple)] md:group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="pt-3 text-sm text-white/75">{f.bio}</p>
          </div>
        </div>
        <span className="mt-3 inline-block rounded-full bg-white/15 px-2.5 py-1 text-[11px] backdrop-blur">{f.experience} experience</span>
      </div>
    </Reveal>
  );
}

/* ───────────────────────── Batches ───────────────────────── */

export function Batches({ batches }: { batches: Batch[] }) {
  return (
    <section id="batches" className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10 md:pb-32">
      <SectionHeading eyebrow="Upcoming batches" title="Seats are" accent="filling fast." />
      <div className="mt-12 divide-y divide-line overflow-hidden rounded-[28px] border border-line bg-white">
        {batches.map((b, i) => {
          const pct = Math.min(100, Math.round((b.filled / Math.max(1, b.seats)) * 100));
          const left = Math.max(0, b.seats - b.filled);
          return (
            <Reveal key={b.id} delay={i * 0.06} className="group grid items-center gap-4 p-5 transition-colors hover:bg-paper/60 md:grid-cols-[1.4fr_1fr_1fr_1.2fr_auto] md:gap-6 md:p-7">
              <div>
                <p className="eyebrow text-muted">{b.course}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">{b.name}</p>
              </div>
              <p className="flex items-center gap-2 text-[15px] text-ink/80">
                <CalendarDays className="size-4 text-accent" /> Starts {fmtDate(b.startDate, { day: "numeric", month: "short" })}
              </p>
              <div className="space-y-1 text-[14px] text-ink/70">
                <p className="flex items-center gap-2"><Clock className="size-4 text-muted" />{b.timing}</p>
                <p className="flex items-center gap-2"><MapPin className="size-4 text-muted" />{b.mode}</p>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className={cn("font-semibold", left <= 10 ? "text-accent" : "text-ink/70")}>{left <= 10 ? `Only ${left} seats left` : `${left} seats left`}</span>
                  <span className="text-muted">{pct}% full</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-paper">
                  <motion.div className={cn("h-full rounded-full", pct > 75 ? "bg-accent" : "bg-ink")} initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 }} />
                </div>
              </div>
              <a href="#enquiry" className="flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition group-hover:bg-accent">
                Reserve <ArrowRight className="size-4" />
              </a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────────────────── Testimonials (sticky stack) ───────────────────────── */

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section id="testimonials" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <SectionHeading align="center" eyebrow="Testimonials" title="Don't take" accent="our word" after="for it." />
      <div ref={ref} className="relative mx-auto mt-16 max-w-4xl">
        {testimonials.map((t, i) => (
          <StackCard key={t.id} t={t} i={i} total={testimonials.length} />
        ))}
      </div>
    </section>
  );
}

function StackCard({ t, i, total }: { t: Testimonial; i: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, i === total - 1 ? 1 : 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, i === total - 1 ? 1 : 0.4]);
  const colors = ["bg-white", "bg-ink text-white", "bg-accent text-white", "bg-[#E9E7FF]"];
  const isDark = i % 4 === 1 || i % 4 === 2;
  return (
    <div ref={ref} className="sticky mb-6 h-[min(70vh,520px)]" style={{ top: `calc(110px + ${i * 22}px)` }}>
      <motion.div style={{ scale, opacity }} className={cn("flex h-full origin-top flex-col justify-between rounded-[32px] p-7 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] md:p-12", colors[i % 4])}>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: t.rating || 5 }).map((_, k) => (
              <Star key={k} className={cn("size-4 fill-current", isDark ? "text-white" : "text-accent")} />
            ))}
          </div>
          <span className={cn("eyebrow", isDark ? "text-white/50" : "text-muted")}>
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <p className="text-[clamp(1.4rem,3.4vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.03em]">&ldquo;{t.quote}&rdquo;</p>
        <div className="flex items-center gap-4">
          {t.image && (
            <span className="relative size-14 overflow-hidden rounded-full">
              <Image src={t.image} alt={t.name} fill sizes="56px" className="object-cover" />
            </span>
          )}
          <div>
            <p className="font-semibold">{t.name}</p>
            <p className={cn("serif text-lg", isDark ? "text-white/70" : "text-muted")}>{t.role}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ───────────────────────── Scholarship countdown ───────────────────────── */

export function Scholarship({ settings }: { settings: Settings }) {
  const s = settings.scholarship;
  const target = new Date(s.date).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - (now ?? target));
  const parts = [
    ["Days", Math.floor(diff / 864e5)],
    ["Hours", Math.floor((diff / 36e5) % 24)],
    ["Mins", Math.floor((diff / 6e4) % 60)],
    ["Secs", Math.floor((diff / 1e3) % 60)],
  ] as const;

  return (
    <section id="scholarship" className="px-3 py-12 md:px-6">
      <Reveal className="grain relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-ink px-6 py-16 text-white md:px-16 md:py-24">
        <motion.div
          aria-hidden
          className="absolute -right-40 -top-40 size-[600px] rounded-full opacity-60 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--accent), transparent 60%)" }}
          animate={{ scale: [1, 1.2, 1], x: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -left-20 size-[500px] rounded-full opacity-40 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--accent-2), transparent 60%)" }}
          animate={{ scale: [1.1, 1, 1.1], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative grid items-end gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="eyebrow rounded-full bg-white/10 px-3 py-1.5 text-white/80">Up to {s.maxScholarship} scholarship</span>
            <h2 className="display mt-6 text-[clamp(2.6rem,7vw,6rem)]">
              {s.title.split(" ").slice(0, -1).join(" ")} <span className="serif text-accent">{s.title.split(" ").slice(-1)}</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg text-white/70">{s.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/admissions#scholarship" className="group flex h-14 items-center gap-2 rounded-full bg-white px-7 font-semibold text-ink transition hover:bg-accent hover:text-white">
                  Register free <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                </Link>
              </Magnetic>
              <span className="flex h-14 items-center gap-2 rounded-full border border-white/20 px-6 text-sm text-white/80">
                <CalendarDays className="size-4" /> {fmtDate(s.date, { weekday: "short", day: "numeric", month: "long" })}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {parts.map(([label, v]) => (
              <div key={label} className="rounded-2xl bg-white/[0.07] p-3 text-center ring-1 ring-white/10 backdrop-blur md:rounded-3xl md:p-5">
                <div className="relative h-[1.1em] overflow-hidden text-[clamp(2rem,6vw,4rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={v} className="block" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.5, ease: EASE }}>
                      {now === null ? "--" : String(v).padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="eyebrow mt-2 text-[10px] text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────────────────── Notices + blog ───────────────────────── */

export function Updates({ notices, posts }: { notices: Notice[]; posts: Post[] }) {
  return (
    <section id="updates" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <SectionHeading eyebrow="What's new" title="Notices &" accent="insights." />
      <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        <Reveal className="rounded-[28px] bg-white p-6 md:p-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-semibold tracking-tight">Notice board</p>
            <span className="flex items-center gap-2 text-xs text-muted">
              <span className="pulse-dot size-2 rounded-full bg-accent text-accent" /> Live
            </span>
          </div>
          <ul className="divide-y divide-line">
            {notices.slice(0, 5).map((n) => (
              <li key={n.id}>
                <Link href={n.href || "#"} className="group flex items-start gap-4 py-4">
                  <div className="w-12 shrink-0 text-center">
                    <p className="text-xl font-semibold leading-none tracking-tight">{fmtDate(n.date, { day: "2-digit" })}</p>
                    <p className="eyebrow mt-1 text-[10px] text-muted">{fmtDate(n.date, { month: "short" })}</p>
                  </div>
                  <div className="flex-1">
                    <span className={cn("eyebrow rounded-full px-2 py-0.5 text-[10px]", n.important ? "bg-accent text-white" : "bg-paper text-muted")}>{n.tag}</span>
                    <p className="mt-1.5 text-[15px] font-medium leading-snug transition-colors group-hover:text-accent">{n.title}</p>
                  </div>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted transition-all group-hover:rotate-45 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {posts.slice(0, 2).map((p, i) => (
            <Reveal key={p.id} delay={0.1 + i * 0.1}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PostCard({ post: p }: { post: Post }) {
  return (
    <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white">
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image src={p.image} alt={p.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-apple)] group-hover:scale-105" />
        <span className="eyebrow absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] text-ink backdrop-blur">{p.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs text-muted">
          {fmtDate(p.date)} · {p.readTime} read
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent">{p.title}</h3>
        <p className="mt-2 line-clamp-2 text-[15px] text-muted">{p.excerpt}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold">
          Read article <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/* ───────────────────────── Gallery (parallax columns) ───────────────────────── */

export function Gallery({ items }: { items: GalleryItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 140]);
  const y3 = useTransform(scrollYProgress, [0, 1], [40, -240]);
  const cols = [0, 1, 2].map((c) => items.filter((_, i) => i % 3 === c));
  const ys = [y1, y2, y3];
  return (
    <section id="gallery" className="overflow-hidden py-24 md:py-32">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 px-5 md:flex-row md:items-end md:px-10">
        <SectionHeading eyebrow="Campus life" title="A place you'll" accent="want" after="to be." />
        <Reveal>
          <Link href="/gallery" className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold transition hover:border-ink">
            Full gallery <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </Link>
        </Reveal>
      </div>
      <div ref={ref} className="mx-auto mt-14 grid h-[80vh] max-w-[1600px] grid-cols-2 gap-3 overflow-hidden px-3 md:h-[110vh] md:grid-cols-3 md:gap-4 md:px-6">
        {cols.map((col, c) => (
          <motion.div key={c} style={{ y: ys[c] }} className={cn("flex flex-col gap-3 md:gap-4", c === 2 && "hidden md:flex")}>
            {[...col, ...col].map((g, i) => (
              <div key={i} className={cn("group relative shrink-0 overflow-hidden rounded-[24px]", (i + c) % 2 ? "aspect-[4/5]" : "aspect-[4/3]")}>
                <Image src={g.image} alt={g.title} fill sizes="33vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-apple)] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <p className="absolute bottom-4 left-4 translate-y-3 text-sm font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">{g.title}</p>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

export function FaqSection({ faqs, settings }: { faqs: Faq[]; settings: Settings }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  return (
    <section id="faq" className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_1.5fr]">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <SectionHeading eyebrow="FAQ" title="Questions?" accent="Answered." />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-sm text-muted">Can&apos;t find what you&apos;re looking for? Our counsellors are one call away.</p>
          <a href={`tel:${settings.brand.phone.replace(/\s/g, "")}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent">
            <Phone className="size-4" /> {settings.brand.phone}
          </a>
        </Reveal>
      </div>
      <div className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === f.id;
          return (
            <Reveal key={f.id} delay={i * 0.05}>
              <div className={cn("overflow-hidden rounded-[22px] transition-colors duration-500", isOpen ? "bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)]" : "bg-white/50 hover:bg-white")}>
                <button onClick={() => setOpen(isOpen ? null : f.id)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={isOpen}>
                  <span className="text-lg font-semibold tracking-tight">{f.question}</span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className={cn("grid size-9 shrink-0 place-items-center rounded-full transition-colors", isOpen ? "bg-accent text-white" : "bg-paper")}>
                    <Plus className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                      <p className="px-6 pb-6 text-[15px] leading-relaxed text-muted">{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────────────────── Enquiry ───────────────────────── */

export function Enquiry({ settings, courses }: { settings: Settings; courses: string[] }) {
  const perks = ["Attend a real class with real faculty", "Free academic counselling for parents", "Personalised study-plan PDF", "Zero obligation — decide later"];
  return (
    <section id="enquiry" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-10 overflow-hidden rounded-[36px] bg-white p-6 md:p-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <SectionHeading eyebrow="Free demo class" title="Experience a class" accent="before" after="you decide." />
            <ul className="mt-8 space-y-3">
              {perks.map((p, i) => (
                <Reveal key={p} delay={0.1 + i * 0.06}>
                  <li className="flex items-center gap-3 text-[16px]">
                    <span className="grid size-6 place-items-center rounded-full bg-accent/10 text-accent">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href={`tel:${settings.brand.phone.replace(/\s/g, "")}`} className="rounded-2xl bg-paper p-4 transition hover:bg-ink hover:text-white">
              <Phone className="size-5 text-accent" />
              <p className="mt-3 text-xs opacity-60">Call us</p>
              <p className="font-semibold">{settings.brand.phone}</p>
            </a>
            <a href={`mailto:${settings.brand.email}`} className="rounded-2xl bg-paper p-4 transition hover:bg-ink hover:text-white">
              <Mail className="size-5 text-accent" />
              <p className="mt-3 text-xs opacity-60">Email</p>
              <p className="font-semibold">{settings.brand.email}</p>
            </a>
          </div>
        </div>
        <Reveal delay={0.15}>
          <div className="rounded-[28px] bg-paper p-4 md:p-6">
            <LeadForm courses={courses} source="Free demo class" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
