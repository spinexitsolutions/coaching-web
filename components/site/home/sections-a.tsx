"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BookOpen, Bot, CalendarCheck2, LineChart, Smartphone, Users } from "lucide-react";
import type { Course, Settings } from "@/lib/types";
import { cn, inr } from "@/lib/utils";
import { Counter, Reveal, SectionHeading, EASE } from "../motion";

/* ───────────────────────── Marquee ───────────────────────── */

export function ExamMarquee() {
  const row1 = ["JEE Main", "JEE Advanced", "NEET UG", "BITSAT", "Olympiads", "NTSE", "CUET", "CBSE Boards"];
  const row2 = ["Small batches", "Weekly tests", "1:1 mentorship", "Doubt desk", "Parent app", "Printed modules", "Scholarships"];
  const Row = ({ items, reverse, serif }: { items: string[]; reverse?: boolean; serif?: boolean }) => (
    <div className="marquee-pause mask-fade-x flex overflow-hidden">
      <div className={cn("flex shrink-0 items-center", reverse ? "animate-marquee-reverse" : "animate-marquee")} style={{ ["--marquee-duration" as string]: "45s" }}>
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center">
            <span className={cn("whitespace-nowrap px-6 text-[clamp(2rem,5vw,4rem)] tracking-[-0.04em]", serif ? "serif text-muted" : "font-semibold")}>{t}</span>
            <span className="text-accent text-2xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <section id="marquee" className="space-y-2 border-y border-line py-10 md:py-14">
      <Row items={row1} />
      <Row items={row2} reverse serif />
    </section>
  );
}

/* ───────────────────────── Manifesto ───────────────────────── */

export function Manifesto({ settings }: { settings: Settings }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = settings.manifesto.text.split(" ");
  return (
    <section id="manifesto" ref={ref} className="relative h-[220vh] md:h-[260vh]">
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10">
          <p className="eyebrow mb-8 flex items-center gap-2 text-muted">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            {settings.manifesto.label}
          </p>
          <p className="text-[clamp(1.8rem,4.6vw,4rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} highlight={/clarity|honest|extraordinary|Lumina/i.test(w)}>
                {w}
              </Word>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function Word({ children, progress, range, highlight }: { children: string; progress: MotionValue<number>; range: [number, number]; highlight?: boolean }) {
  const start = range[0] * 0.85;
  const end = range[1] * 0.85;
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const blur = useTransform(progress, [start, end], [4, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <motion.span style={{ opacity, filter }} className={cn("mr-[0.25em] inline-block", highlight && "serif font-normal text-accent")}>
      {children}
    </motion.span>
  );
}

/* ───────────────────────── Stats bento ───────────────────────── */

export function StatsBento({ settings, image }: { settings: Settings; image?: string }) {
  const s = settings.stats;
  return (
    <section id="stats" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <SectionHeading eyebrow="By the numbers" title="Fourteen years." accent="One obsession." after="Your result." />
      <div className="mt-14 grid auto-rows-[minmax(180px,auto)] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Reveal className="col-span-2 row-span-2 overflow-hidden rounded-[28px] bg-ink text-white">
          <div className="relative flex h-full min-h-[380px] flex-col justify-between p-7 md:p-9">
            {image && <Image src={image} alt="" fill sizes="50vw" className="object-cover opacity-45" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <span className="eyebrow relative text-white/70">{s[1]?.label}</span>
            <div className="relative">
              <p className="text-[clamp(4rem,11vw,8.5rem)] font-semibold leading-none tracking-[-0.06em]">
                <Counter value={s[1]?.value || 0} suffix={s[1]?.suffix} />
              </p>
              <p className="serif mt-2 text-2xl text-white/75">and every single one has a story.</p>
            </div>
          </div>
        </Reveal>
        {s[0] && (
          <Reveal delay={0.08} className="col-span-1 rounded-[28px] bg-accent p-6 text-white md:p-7">
            <div className="flex h-full flex-col justify-between">
              <span className="eyebrow text-white/80">{s[0].label}</span>
              <p className="text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-[-0.05em]">
                <Counter value={s[0].value} suffix={s[0].suffix} />
              </p>
            </div>
          </Reveal>
        )}
        {s[3] && (
          <Reveal delay={0.14} className="col-span-1 rounded-[28px] bg-white p-6 md:p-7">
            <div className="flex h-full flex-col justify-between">
              <span className="eyebrow text-muted">{s[3].label}</span>
              <div>
                <p className="text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-[-0.05em]">
                  <Counter value={s[3].value} suffix={s[3].suffix} />
                </p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper">
                  <motion.div className="h-full rounded-full bg-accent2" initial={{ width: 0 }} whileInView={{ width: `${s[3].value}%` }} viewport={{ once: true }} transition={{ duration: 2, ease: EASE }} />
                </div>
              </div>
            </div>
          </Reveal>
        )}
        {s[2] && (
          <Reveal delay={0.2} className="col-span-2 rounded-[28px] border border-line bg-white p-6 md:p-7">
            <div className="flex h-full flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="eyebrow text-muted">{s[2].label}</span>
                <p className="mt-3 text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-[-0.05em]">
                  <Counter value={s[2].value} suffix={s[2].suffix} />
                </p>
              </div>
              <MiniBars />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function MiniBars() {
  const bars = [32, 45, 41, 58, 64, 72, 88, 100];
  return (
    <div className="flex h-24 items-end gap-1.5">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className={cn("w-4 rounded-t-md md:w-5", i === bars.length - 1 ? "bg-accent" : "bg-ink/10")}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE, delay: i * 0.06 }}
        />
      ))}
    </div>
  );
}

/* ───────────────────────── Programs (horizontal scroll) ───────────────────────── */

export function Programs({ courses }: { courses: Course[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!desktop || !track.current) return;
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [desktop]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const [prog, setProg] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setProg);

  const cards = courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />);

  if (!desktop) {
    return (
      <section id="programs" ref={section} className="py-24">
        <div className="px-5">
          <SectionHeading eyebrow="Programs" title="A path for" accent="every" after="ambition." />
        </div>
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4" data-lenis-prevent-touch>
          {cards}
          <AllCoursesCard />
        </div>
      </section>
    );
  }

  return (
    <section id="programs" ref={section} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-stretch gap-5 pl-10 pr-10">
          <div className="flex w-[420px] shrink-0 flex-col justify-between py-4 pr-6">
            <SectionHeading eyebrow="Programs" title="A path for" accent="every" after="ambition." />
            <div>
              <p className="max-w-xs text-muted">Scroll to explore programs built for every class, every exam and every kind of learner.</p>
              <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(4, prog * 100)}%` }} />
              </div>
            </div>
          </div>
          {cards}
          <AllCoursesCard />
        </motion.div>
      </div>
    </section>
  );
}

function CourseCard({ course: c, index }: { course: Course; index: number }) {
  return (
    <Link
      href={`/courses/${c.slug}`}
      className="group relative flex h-[520px] w-[82vw] max-w-[400px] shrink-0 snap-start flex-col overflow-hidden rounded-[30px] bg-white lg:h-[600px] lg:w-[420px]"
    >
      <div className="relative h-[55%] overflow-hidden">
        <Image src={c.image} alt={c.title} fill sizes="420px" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-apple)] group-hover:scale-110" />
        <div className="absolute inset-0 opacity-30 mix-blend-multiply" style={{ background: c.color }} />
        <span className="eyebrow absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-ink backdrop-blur">{c.category}</span>
        <span className="absolute right-4 top-4 text-sm font-semibold text-white/90">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[28px] font-semibold leading-tight tracking-[-0.03em]">{c.title}</h3>
        <p className="serif mt-1 text-xl text-muted">{c.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[c.classLevel, c.duration, c.mode].filter(Boolean).map((t) => (
            <span key={t} className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink/70">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            {c.discountedFee > 0 && c.discountedFee < c.fee && <p className="text-sm text-muted line-through">{inr(c.fee)}</p>}
            <p className="text-2xl font-semibold tracking-tight">{inr(c.discountedFee || c.fee)}</p>
          </div>
          <span className="grid size-12 place-items-center rounded-full text-white transition-transform duration-500 group-hover:rotate-45" style={{ background: c.color }}>
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function AllCoursesCard() {
  return (
    <Link href="/courses" className="group grid h-[520px] w-[70vw] max-w-[340px] shrink-0 snap-start place-items-center rounded-[30px] border border-dashed border-ink/20 text-center transition hover:border-accent hover:bg-white lg:h-[600px]">
      <div>
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-ink text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-accent">
          <ArrowUpRight className="size-7 transition-transform duration-500 group-hover:rotate-45" />
        </span>
        <p className="mt-6 text-2xl font-semibold tracking-tight">View all programs</p>
        <p className="serif text-lg text-muted">compare, filter, decide.</p>
      </div>
    </Link>
  );
}

/* ───────────────────────── Features bento ───────────────────────── */

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <SectionHeading eyebrow="Why Lumina" title="Everything you need." accent="Nothing" after="you don't." />
      <div className="mt-14 grid gap-3 md:grid-cols-6 md:gap-4">
        <FeatureCard className="md:col-span-4" icon={Bot} title="AI doubt solver, 24×7" text="Snap a photo of any question at 2 AM and get a step-by-step solution — then discuss it with your teacher next morning.">
          <ChatDemo />
        </FeatureCard>
        <FeatureCard className="md:col-span-2" dark icon={Users} title="Batches of 40, not 400" text="Every teacher knows every student by name.">
          <div className="mt-6 grid grid-cols-8 gap-1.5">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.span
                key={i}
                className={cn("aspect-square rounded-full", i === 17 ? "bg-accent" : "bg-white/15")}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.015, type: "spring", stiffness: 300, damping: 15 }}
              />
            ))}
          </div>
        </FeatureCard>
        <FeatureCard className="md:col-span-2" icon={LineChart} title="Weekly test series" text="All-India ranking every Sunday with deep analytics.">
          <MiniBars />
        </FeatureCard>
        <FeatureCard className="md:col-span-2" icon={Smartphone} title="Parent app" text="Attendance, scores and remarks — live.">
          <div className="mt-5 space-y-2">
            {["Aarav scored 92% in Physics test", "Attendance: 26/26 days this month", "Mentor note: excellent progress"].map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease: EASE }}
                className="flex items-center gap-2 rounded-xl bg-paper px-3 py-2 text-[13px]"
              >
                <span className="size-2 rounded-full bg-emerald-500" />
                {n}
              </motion.div>
            ))}
          </div>
        </FeatureCard>
        <FeatureCard className="md:col-span-2" accent icon={CalendarCheck2} title="1:1 mentorship" text="A personal mentor every fortnight to plan, review and keep you on track.">
          <div className="mt-6 flex items-center gap-2">
            {["M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i} className={cn("grid size-9 place-items-center rounded-full text-xs font-semibold", i === 3 ? "bg-white text-accent" : "bg-white/20")}>
                {d}
              </span>
            ))}
          </div>
        </FeatureCard>
        <FeatureCard className="md:col-span-6" icon={BookOpen} title="Study material that actually makes sense" text="Beautifully designed modules, formula sheets and 10,000+ practice questions — written by our own faculty and updated every year.">
          <div className="mt-6 flex gap-3 overflow-hidden">
            {["Physics", "Chemistry", "Mathematics", "Biology", "Mental Ability", "PYQ Bank"].map((t, i) => (
              <motion.span
                key={t}
                initial={{ y: 40, opacity: 0, rotate: -4 }}
                whileInView={{ y: 0, opacity: 1, rotate: i % 2 ? 2 : -2 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.8, ease: EASE }}
                className="flex h-28 w-24 shrink-0 flex-col justify-end rounded-xl p-3 text-xs font-semibold text-white shadow-lg md:h-36 md:w-32"
                style={{ background: ["#FF5B1F", "#16A34A", "#5B5BF0", "#0EA5E9", "#F59E0B", "#0B0B0C"][i] }}
              >
                <span className="serif text-lg font-normal leading-none">Vol. {i + 1}</span>
                {t}
              </motion.span>
            ))}
          </div>
        </FeatureCard>
      </div>
    </section>
  );
}

function FeatureCard({
  className,
  icon: Icon,
  title,
  text,
  children,
  dark,
  accent,
}: {
  className?: string;
  icon: typeof Bot;
  title: string;
  text: string;
  children?: React.ReactNode;
  dark?: boolean;
  accent?: boolean;
}) {
  return (
    <Reveal className={cn("group overflow-hidden rounded-[28px] p-6 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] md:p-8", dark ? "bg-ink text-white" : accent ? "bg-accent text-white" : "bg-white", className)}>
      <span className={cn("grid size-11 place-items-center rounded-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110", dark || accent ? "bg-white/15" : "bg-paper")}>
        <Icon className="size-5" />
      </span>
      <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
      <p className={cn("mt-2 max-w-md text-[15px]", dark || accent ? "text-white/70" : "text-muted")}>{text}</p>
      {children}
    </Reveal>
  );
}

function ChatDemo() {
  return (
    <div className="mt-6 space-y-2.5 rounded-2xl bg-paper p-4">
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-[13px] text-white">
        Why is acceleration constant in projectile motion? 🤔
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.9 }} className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-[13px] shadow-sm">
        Because the only force acting is gravity — <span className="font-semibold text-accent">mg</span>, constant in magnitude & direction. So <span className="serif text-base">a = g</span> throughout the flight ✨
      </motion.div>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }} className="flex w-fit gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="size-1.5 rounded-full bg-muted" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }} />
        ))}
      </motion.div>
    </div>
  );
}
