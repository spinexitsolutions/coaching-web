"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Result, Settings } from "@/lib/types";
import { useIntroDone } from "../intro";
import { Counter, Magnetic, SplitWords, EASE } from "../motion";

const SOFT = { type: "spring", stiffness: 140, damping: 22, mass: 0.9 } as const;

export function Hero({ settings, toppers }: { settings: Settings; toppers: Result[] }) {
  const { hero, announcement, stats, brand } = settings;
  const play = useIntroDone();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Leaving the hero: the panel recedes like a card being set down.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.9]);
  const radius = useTransform(scrollYProgress, [0, 1], [28, 56]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  // Pointer parallax for the topper deck.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 80, damping: 20 });
  const py = useSpring(my, { stiffness: 80, damping: 20 });
  const deckX = useTransform(px, (v) => v * 18);
  const deckY = useTransform(py, (v) => v * 14);
  const deckR = useTransform(px, (v) => v * 3);

  const show = (d: number) => ({
    initial: { opacity: 0, y: 26 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.1, ease: EASE, delay: d },
  });

  const headline = [hero.titleLine1, hero.titleAccent, hero.titleLine2];

  return (
    <section
      ref={ref}
      id="hero"
      className="relative px-2 pt-2 md:px-3 md:pt-3"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <motion.div
        style={{ scale, borderRadius: radius }}
        initial={{ clipPath: "inset(42% 34% 42% 34% round 48px)" }}
        animate={play ? { clipPath: "inset(0% 0% 0% 0% round 28px)" } : undefined}
        transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
        className="relative origin-top overflow-hidden bg-accent text-white"
      >
        {/* duotone photo */}
        {hero.images[0] && (
          <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[10%] h-[120%]">
            <Image src={hero.images[0]} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.22] mix-blend-luminosity grayscale" />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgb(255_255_255/0.16),transparent_55%)]" />
        {/* editorial column rules */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden grid-cols-4 lg:grid">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="border-r border-white/[0.08] last:border-0"
              initial={{ scaleY: 0 }}
              animate={play ? { scaleY: 1 } : undefined}
              transition={{ duration: 1.6, ease: EASE, delay: 0.5 + i * 0.08 }}
              style={{ transformOrigin: "top" }}
            />
          ))}
        </div>

        <motion.div style={{ y: contentY }} className="relative flex min-h-[calc(100svh-16px)] flex-col px-5 pb-6 pt-24 md:px-10 md:pb-7 md:pt-24 lg:min-h-[calc(100svh-24px)]">
          {/* meta row */}
          <motion.div {...show(0.55)} className="flex items-center justify-between gap-4 text-[13px] text-white/75">
            <span className="hidden md:block">Est. 2012 — {brand.address.split(",").slice(-2, -1)[0]?.trim() || "India"}</span>
            {announcement.enabled ? (
              <Link href={announcement.href} className="group inline-flex min-w-0 items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 backdrop-blur transition hover:bg-white/20">
                <span className="shrink-0 rounded-full bg-accent2 px-2 py-0.5 text-[11px] font-bold text-ink">NEW</span>
                <span className="truncate">{announcement.text}</span>
                <ArrowUpRight className="size-3.5 shrink-0 transition-transform group-hover:rotate-45" />
              </Link>
            ) : (
              <span>{hero.eyebrow}</span>
            )}
            <span className="hidden items-center gap-1.5 md:flex">
              Scroll
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
                <ArrowDownRight className="size-4" />
              </motion.span>
            </span>
          </motion.div>

          <div className="grid flex-1 items-center gap-14 py-10 lg:grid-cols-12 lg:gap-6 lg:py-4">
            {/* copy */}
            <div className="lg:col-span-7 xl:col-span-7">
              <motion.p {...show(0.6)} className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-accent2">
                {hero.eyebrow}
              </motion.p>
              <h1 className="display text-[clamp(2.6rem,min(6.6vw,11vh),7rem)] leading-[0.92]">
                {headline.map((line, i) => (
                  <span key={i} className="block">
                    <SplitWords text={line} play={play} delay={0.7 + i * 0.12} stagger={0.05} wordClassName={i === 1 ? "text-accent2" : undefined} />
                  </span>
                ))}
              </h1>
              <motion.p {...show(1.1)} className="mt-6 max-w-lg text-[16px] leading-relaxed text-white/80 md:text-[17px]">
                {hero.subtitle}
              </motion.p>
              <motion.div {...show(1.2)} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Magnetic>
                  <Link href={hero.primaryHref} className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-accent2 pl-7 pr-2 font-semibold text-ink">
                    <span className="relative">{hero.primaryCta}</span>
                    <span className="relative grid size-10 place-items-center rounded-full bg-ink text-accent2 transition-transform duration-500 ease-[var(--ease-apple)] group-hover:rotate-45">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href={hero.secondaryHref} className="flex h-14 items-center justify-center rounded-full border border-white/30 px-7 font-semibold transition-colors duration-500 hover:bg-white hover:text-accent">
                    {hero.secondaryCta}
                  </Link>
                </Magnetic>
              </motion.div>
            </div>

            {/* topper deck */}
            <motion.div style={{ x: deckX, y: deckY, rotate: deckR }} className="relative mx-auto w-full max-w-[300px] lg:col-span-5 lg:max-w-[min(340px,40vh)]">
              <motion.div initial={{ opacity: 0, y: 80, rotate: 6 }} animate={play ? { opacity: 1, y: 0, rotate: 0 } : undefined} transition={{ ...SOFT, delay: 0.9 }}>
                <TopperDeck toppers={toppers} />
              </motion.div>
              <motion.div initial={{ scale: 0, rotate: -90 }} animate={play ? { scale: 1, rotate: 0 } : undefined} transition={{ type: "spring", stiffness: 160, damping: 14, delay: 1.4 }} className="absolute -right-4 -top-10 z-20 md:-right-10">
                <Sticker href="/admissions" />
              </motion.div>
            </motion.div>
          </div>

          {/* stats strip */}
          <motion.div {...show(1.35)} className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-5 md:grid-cols-4">
            {stats.slice(0, 4).map((s, i) => (
              <div key={i} className="min-w-0">
                <p className="wide text-[clamp(1.6rem,3vw,2.4rem)] font-[760] leading-none tracking-[-0.04em]">
                  {play ? <Counter value={s.value} suffix={s.suffix} duration={2.2} /> : "0"}
                </p>
                <p className="mt-1.5 truncate text-[13px] text-white/65">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ───────── Swipeable deck of toppers ───────── */

function TopperDeck({ toppers }: { toppers: Result[] }) {
  const list = toppers.slice(0, 5);
  const [order, setOrder] = useState(list.map((_, i) => i));
  const [flying, setFlying] = useState<{ id: number; dir: number } | null>(null);
  const [paused, setPaused] = useState(false);

  const next = (dir = -1) => {
    if (flying) return;
    setFlying({ id: order[0], dir });
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setFlying(null);
    }, 420);
  };

  useEffect(() => {
    if (paused || list.length < 2) return;
    const t = setTimeout(() => next(-1), 3200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, paused, list.length]);

  if (!list.length) return null;
  const tilt = [0, 5, -6, 3, -3];

  return (
    <div className="relative aspect-[4/5] w-full" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {order
        .slice()
        .reverse()
        .map((id) => {
          const pos = order.indexOf(id);
          const r = list[id];
          const isFly = flying?.id === id;
          const front = pos === 0;
          return (
            <motion.div
              key={id}
              drag={front && !flying ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(_, info) => Math.abs(info.offset.x) > 70 && next(info.offset.x > 0 ? 1 : -1)}
              animate={
                isFly
                  ? { x: `${(flying!.dir) * 130}%`, rotate: flying!.dir * 22, opacity: 0, scale: 0.95 }
                  : { x: pos * 10, y: pos * -14, rotate: tilt[pos] ?? 0, scale: 1 - pos * 0.05, opacity: pos > 2 ? 0 : 1 }
              }
              transition={isFly ? { duration: 0.42, ease: [0.55, 0, 0.75, 0.2] } : { type: "spring", stiffness: 170, damping: 22 }}
              style={{ zIndex: 10 - pos }}
              className="absolute inset-0 cursor-grab touch-pan-y overflow-hidden rounded-[26px] bg-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] active:cursor-grabbing"
            >
              <Image src={r.image} alt={r.name} fill sizes="400px" draggable={false} className="pointer-events-none object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-[12px] font-semibold">
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-ink">{r.exam} {r.year}</span>
                
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="wide text-[clamp(3rem,6vw,4.4rem)] font-[800] leading-[0.85] tracking-[-0.05em] text-accent2">{r.rank}</p>
                <p className="mt-3 text-lg font-semibold">{r.name}</p>
                <p className="text-[13px] text-white/65">Score {r.score}</p>
              </div>
            </motion.div>
          );
        })}
      <div className="absolute -bottom-10 left-0 right-0 flex items-center justify-center gap-1.5">
        <AnimatePresence initial={false}>
          {list.map((_, i) => (
            <motion.span key={i} layout className="h-1.5 rounded-full bg-white" animate={{ width: order[0] === i ? 22 : 6, opacity: order[0] === i ? 1 : 0.4 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Sticker({ href }: { href: string }) {
  const text = "ADMISSIONS OPEN • 2027 • SCHOLARSHIPS • ";
  return (
    <Link href={href} className="group relative grid size-[112px] place-items-center rounded-full bg-accent2 text-ink shadow-xl md:size-[132px]" aria-label="Admissions open">
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full animate-[spin_14s_linear_infinite] group-hover:animate-[spin_5s_linear_infinite]">
        <defs>
          <path id="sticker-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text className="fill-current text-[10.2px] font-bold tracking-[0.12em]">
          <textPath href="#sticker-circle" textLength="286" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <span className="grid size-11 place-items-center rounded-full bg-ink text-accent2 transition-transform duration-500 group-hover:rotate-45 md:size-12">
        <ArrowUpRight className="size-5" />
      </span>
    </Link>
  );
}
