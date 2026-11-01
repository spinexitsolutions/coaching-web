"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Play, Star } from "lucide-react";
import type { Result, Settings } from "@/lib/types";
import { useIntroDone } from "../intro";
import { Magnetic, SplitWords, EASE } from "../motion";

export function Hero({ settings, topper, avatars }: { settings: Settings; topper?: Result; avatars: string[] }) {
  const { hero, announcement } = settings;
  const play = useIntroDone();
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: stage, offset: ["start end", "end end"] });

  // Image stage: center frame un-clips to full-bleed, side cards drift away.
  const inset = useTransform(p, [0.15, 0.85], reduce ? [0, 0] : [14, 0]);
  const radius = useTransform(p, [0.15, 0.85], [36, 0]);
  const clip = useTransform([inset, radius] as never, ([i, r]: number[]) => `inset(${i}% ${i * 1.4}% ${i}% ${i * 1.4}% round ${r}px)`);
  const imgScale = useTransform(p, [0.15, 1], [1.25, 1]);
  const leftX = useTransform(p, [0.1, 0.7], ["0%", "-140%"]);
  const rightX = useTransform(p, [0.1, 0.7], ["0%", "140%"]);
  const sideOpacity = useTransform(p, [0.35, 0.7], [1, 0]);
  const overlayOpacity = useTransform(p, [0.65, 0.9], [0, 1]);
  const overlayY = useTransform(p, [0.65, 0.95], [40, 0]);

  const fade = (d: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    animate: play ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
    transition: { duration: 1, ease: EASE, delay: d },
  });

  return (
    <section id="hero" className="relative">
      {/* soft ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[120vh] overflow-hidden"
        style={{ maskImage: "linear-gradient(to bottom, black 40%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent)" }}
      >
        <motion.div
          className="absolute left-[2%] top-[-25%] size-[70vw] max-w-[1000px] rounded-full opacity-[0.22]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)" }}
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-5%] top-[0%] size-[65vw] max-w-[950px] rounded-full opacity-[0.18]"
          style={{ background: "radial-gradient(circle, var(--accent-2) 0%, transparent 65%)" }}
          animate={{ x: [0, -70, 0], y: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-5 pb-14 pt-28 text-center md:px-10 md:pt-40">
        {announcement.enabled && (
          <motion.div {...fade(0)}>
            <Link href={announcement.href} className="group mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 py-1 pl-1 pr-3 text-[13px] backdrop-blur transition hover:border-ink/20">
              <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">New</span>
              <span className="text-ink/80">{announcement.text}</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        )}

        <motion.p {...fade(0.05)} className="eyebrow mb-6 text-muted">
          {hero.eyebrow}
        </motion.p>

        <h1 className="display max-w-[16ch] text-[clamp(3rem,10.5vw,9.5rem)]">
          <SplitWords text={hero.titleLine1} play={play} delay={0.1} />{" "}
          <SplitWords text={hero.titleAccent} play={play} delay={0.22} wordClassName="serif pr-[0.05em] text-accent" />{" "}
          <SplitWords text={hero.titleLine2} play={play} delay={0.32} />
        </h1>

        <motion.p {...fade(0.55)} className="mt-7 max-w-xl text-[17px] leading-relaxed text-muted md:text-lg">
          {hero.subtitle}
        </motion.p>

        <motion.div {...fade(0.7)} className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Magnetic className="w-full sm:w-auto">
            <Link href={hero.primaryHref} className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-7 font-semibold text-white sm:w-auto">
              <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[var(--ease-apple)] group-hover:translate-y-0" />
              <span className="relative">{hero.primaryCta}</span>
              <ArrowUpRight className="relative size-4 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          </Magnetic>
          <Magnetic className="w-full sm:w-auto">
            <Link href={hero.secondaryHref} className="group flex h-14 w-full items-center justify-center gap-3 rounded-full border border-line bg-white px-6 font-semibold transition hover:border-ink/25 sm:w-auto">
              <span className="grid size-7 place-items-center rounded-full bg-paper transition group-hover:bg-accent group-hover:text-white">
                <Play className="size-3 fill-current" />
              </span>
              {hero.secondaryCta}
            </Link>
          </Magnetic>
        </motion.div>

        <motion.div {...fade(0.85)} className="mt-10 flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {avatars.slice(0, 4).map((a, i) => (
              <span key={i} className="relative size-9 overflow-hidden rounded-full ring-2 ring-paper">
                <Image src={a} alt="" fill sizes="36px" className="object-cover" />
              </span>
            ))}
          </div>
          <div className="text-left text-[13px] leading-tight">
            <div className="flex gap-0.5 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </div>
            <span className="text-muted">Loved by 12,500+ students & parents</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll-driven image stage */}
      <div ref={stage} className="relative h-[170vh] md:h-[220vh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          <motion.div style={{ clipPath: clip }} className="absolute inset-0 overflow-hidden bg-ink">
            <motion.div style={{ scale: imgScale }} className="absolute inset-0">
              <Image src={hero.images[0]} alt="Lumina classroom" fill priority sizes="100vw" className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10" />
            <motion.div style={{ opacity: overlayOpacity, y: overlayY }} className="absolute inset-x-0 bottom-0 px-5 pb-12 text-white md:px-10 md:pb-16">
              <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-6 md:flex-row md:items-end">
                <h2 className="display max-w-2xl text-[clamp(2.4rem,7vw,6rem)]">
                  Built for <span className="serif text-accent">focus.</span>
                </h2>
                <p className="max-w-sm text-white/75 md:text-lg">
                  Silent study pods, 24×7 library, smart classrooms and a mentor who knows your name — not just your roll number.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {hero.images[1] && (
            <motion.div style={{ x: leftX, opacity: sideOpacity }} className="absolute left-[3%] top-[18%] hidden w-[19%] md:block">
              <div className="relative aspect-[3/4] -rotate-6 overflow-hidden rounded-[28px] shadow-2xl">
                <Image src={hero.images[1]} alt="" fill sizes="20vw" className="object-cover" />
              </div>
            </motion.div>
          )}
          {hero.images[2] && (
            <motion.div style={{ x: rightX, opacity: sideOpacity }} className="absolute right-[3%] top-[30%] hidden w-[17%] md:block">
              <div className="relative aspect-[3/4] rotate-6 overflow-hidden rounded-[28px] shadow-2xl">
                <Image src={hero.images[2]} alt="" fill sizes="20vw" className="object-cover" />
              </div>
            </motion.div>
          )}

          {topper && (
            <motion.div style={{ opacity: sideOpacity }} className="glass absolute bottom-[16%] left-[8%] flex items-center gap-3 rounded-2xl p-2 pr-4 shadow-xl md:bottom-[20%] md:left-[22%]">
              <span className="relative size-11 overflow-hidden rounded-xl">
                <Image src={topper.image} alt={topper.name} fill sizes="44px" className="object-cover" />
              </span>
              <div className="text-left leading-tight">
                <p className="text-[15px] font-semibold">{topper.rank}</p>
                <p className="text-xs text-muted">
                  {topper.name} · {topper.exam} {topper.year}
                </p>
              </div>
            </motion.div>
          )}
          <motion.div style={{ opacity: sideOpacity }} className="glass absolute right-[8%] top-[16%] rounded-2xl px-4 py-3 text-left shadow-xl md:right-[24%] md:top-[18%]">
            <p className="text-2xl font-semibold tracking-tight">
              {settings.stats[2]?.value.toLocaleString("en-IN")}
              {settings.stats[2]?.suffix}
            </p>
            <p className="text-xs text-muted">{settings.stats[2]?.label}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
