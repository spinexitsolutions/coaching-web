"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import type { Result, Settings } from "@/lib/types";
import { useIntroDone } from "../intro";
import { Counter, Magnetic, SplitWords, EASE } from "../motion";

/**
 * Bento hero: the page opens as a set of tiles that assemble one by one —
 * headline, a live photo window, a rolling rank board and a social-proof tile.
 */
export function Hero({ settings, toppers }: { settings: Settings; toppers: Result[] }) {
  const { hero, announcement, stats } = settings;
  const play = useIntroDone();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -110]);
  const yC = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);

  const tile = (i: number) => ({
    initial: { opacity: 0, y: 40, scale: 0.97 },
    animate: play ? { opacity: 1, y: 0, scale: 1 } : undefined,
    transition: { duration: 1.1, ease: EASE, delay: 0.1 + i * 0.12 },
  });
  const fade = (d: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: EASE, delay: d },
  });

  const images = hero.images.filter(Boolean);
  const students = stats[1];

  return (
    <section ref={ref} id="hero" className="relative mx-auto max-w-[1440px] px-3 pb-10 pt-[84px] md:px-5 md:pt-[92px]">
      <div className="grid gap-3 lg:h-[calc(100svh-112px)] lg:min-h-[640px] lg:grid-cols-12 lg:grid-rows-[1fr_1fr_0.85fr]">
        {/* A — headline */}
        <motion.div style={{ y: yA }} {...tile(0)} className="relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-white p-6 md:p-10 lg:col-span-7 lg:row-span-2">
          <motion.div {...fade(0.4)} className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[13px] font-medium text-muted">{hero.eyebrow}</span>
            {announcement.enabled && (
              <Link href={announcement.href} className="group inline-flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-[12.5px] text-ink/80 transition hover:border-accent/40">
                <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">2027</span>
                <span className="max-w-[230px] truncate sm:max-w-none">{announcement.text}</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </motion.div>

          <div className="py-10 lg:py-0">
            <h1 className="display text-[clamp(2.6rem,min(6vw,10vh),6.4rem)] leading-[0.98]">
              <SplitWords text={hero.titleLine1} play={play} delay={0.45} />{" "}
              <span className="relative inline-block">
                <SplitWords text={hero.titleAccent} play={play} delay={0.55} wordClassName="text-accent" />
                <motion.span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[0.09em] w-full origin-left rounded-full bg-accent2"
                  initial={{ scaleX: 0 }}
                  animate={play ? { scaleX: 1 } : undefined}
                  transition={{ duration: 1, ease: EASE, delay: 1.15 }}
                />
              </span>{" "}
              <SplitWords text={hero.titleLine2} play={play} delay={0.65} />
            </h1>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <motion.p {...fade(0.9)} className="max-w-md text-[15.5px] leading-relaxed text-muted">
              {hero.subtitle}
            </motion.p>
            <motion.div {...fade(1)} className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
              <Magnetic>
                <Link href={hero.primaryHref} className="group flex h-13 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-white transition-colors duration-500 hover:bg-accent">
                  {hero.primaryCta}
                  <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                </Link>
              </Magnetic>
              <Link href={hero.secondaryHref} className="flex items-center justify-center rounded-full px-5 py-3.5 text-[15px] font-semibold text-ink/80 underline-offset-4 transition hover:text-accent hover:underline">
                {hero.secondaryCta}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* B — live photo window */}
        <motion.div style={{ y: yB }} {...tile(1)} className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-ink sm:aspect-[16/11] lg:col-span-5 lg:row-span-3 lg:aspect-auto">
          <PhotoWindow images={images} play={play} />
        </motion.div>

        {/* C — rank board */}
        <motion.div style={{ y: yC }} {...tile(2)} className="lg:col-span-4">
          <RankBoard toppers={toppers} play={play} />
        </motion.div>

        {/* D — social proof */}
        <motion.div style={{ y: yC }} {...tile(3)} className="flex flex-col justify-between gap-4 rounded-[28px] bg-accent2 p-6 text-ink lg:col-span-3">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {toppers.slice(0, 4).map((t) => (
                <span key={t.id} className="relative size-9 overflow-hidden rounded-full ring-2 ring-accent2">
                  <Image src={t.image} alt="" fill sizes="36px" className="object-cover" />
                </span>
              ))}
            </div>
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-ink text-ink" />
              ))}
            </span>
          </div>
          <div>
            <p className="text-[clamp(2rem,3.2vw,2.8rem)] font-semibold leading-none tracking-[-0.04em]">
              {play && students ? <Counter value={students.value} suffix={students.suffix} /> : "0"}
            </p>
            <p className="mt-1.5 text-[13.5px] font-medium text-ink/70">{students?.label || "Students mentored"}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── Photo window: slow Ken-Burns crossfade + live class caption ───────── */

function PhotoWindow({ images, play }: { images: string[]; play: boolean }) {
  const [i, setI] = useState(0);
  const classes = ["Physics · Rotational dynamics", "Chemistry · Reaction mechanisms", "Maths · Definite integrals"];
  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % images.length), 5200);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.4, ease: "easeInOut" }, scale: { duration: 7, ease: "linear" } }}
        >
          {images[i] && <Image src={images[i]} alt="Inside a Lumina classroom" fill priority={i === 0} sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/25" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, ease: EASE, delay: 1.2 }}
        className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md"
      >
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-70" />
          <span className="relative size-2 rounded-full bg-red-500" />
        </span>
        Live now
      </motion.div>

      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <div className="min-w-0 rounded-2xl bg-white/90 px-4 py-3 backdrop-blur-md">
          <p className="text-[11px] font-medium text-muted">In class right now</p>
          <div className="relative h-5 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="truncate text-[14px] font-semibold text-ink">
                {classes[i % classes.length]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5 pb-2">
          {images.map((_, k) => (
            <span key={k} className="relative h-1 w-6 overflow-hidden rounded-full bg-white/35">
              {k === i && <motion.span className="absolute inset-0 origin-left bg-white" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5.2, ease: "linear" }} />}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

/* ───────── Rank board: odometer-style rolling ranks ───────── */

function RankBoard({ toppers, play }: { toppers: Result[]; play: boolean }) {
  const list = toppers.slice(0, 6);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!play || list.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % list.length), 2800);
    return () => clearInterval(id);
  }, [play, list.length]);
  const r = list[i];
  if (!r) return null;

  return (
    <Link href="/results" className="group relative flex h-full min-h-[190px] items-stretch gap-4 overflow-hidden rounded-[28px] bg-accent p-6 text-white">
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-center justify-between text-[12.5px] text-white/70">
          <span>Results 2026</span>
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
        </div>
        <div>
          <div className="relative h-[1.05em] overflow-hidden text-[clamp(2.6rem,4.2vw,3.8rem)] font-semibold leading-none tracking-[-0.045em] text-accent2">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
                {r.rank}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="relative mt-2 h-10 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={i} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}>
                <p className="truncate text-[15px] font-semibold">{r.name}</p>
                <p className="truncate text-[12.5px] text-white/65">{r.exam} {r.year}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="relative w-[34%] shrink-0 overflow-hidden rounded-2xl">
        <AnimatePresence initial={false}>
          <motion.div key={i} className="absolute inset-0" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
            <Image src={r.image} alt={r.name} fill sizes="160px" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>
    </Link>
  );
}
