"use client";

import { AnimatePresence, LayoutGroup, motion, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Phone, Mail } from "lucide-react";
import { Instagram, Youtube, Facebook, Linkedin } from "./icons";
import type { Course, Settings } from "@/lib/types";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring", stiffness: 420, damping: 38, mass: 0.9 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

type Mode = "full" | "compact" | "open";

export function Navbar({ settings, featured }: { settings: Settings; featured?: Pick<Course, "title" | "slug" | "image" | "tagline" | "category"> }) {
  const { brand, nav } = settings;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 60));

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const mode: Mode = open ? "open" : desktop && !scrolled ? "full" : "compact";
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4">
        <LayoutGroup>
          <motion.nav
            layout
            transition={SPRING}
            style={{ borderRadius: mode === "open" ? 30 : 999 }}
            className={cn(
              "pointer-events-auto relative overflow-hidden bg-ink text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-white/10",
              mode === "open" && "w-full max-w-[980px]",
              mode === "full" && "w-full max-w-[1120px]",
            )}
            aria-label="Main"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {mode === "full" && (
                <motion.div
                  key="full"
                  layout="position"
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.15 } }}
                  transition={{ duration: 0.35, delay: 0.08 }}
                  className="flex h-14 items-center gap-2 pl-2 pr-2"
                >
                  <Logo brand={brand.name} short={brand.shortName} expanded />
                  <ul className="mx-auto flex items-center" onMouseLeave={() => setHover(null)}>
                    {nav.links.slice(0, 6).map((l, i) => (
                      <li key={l.href} className="relative">
                        <Link
                          href={l.href}
                          onMouseEnter={() => setHover(i)}
                          className={cn("relative z-10 block px-3.5 py-2 text-[13.5px] font-medium transition-colors", isActive(l.href) ? "text-white" : "text-white/60 hover:text-white")}
                        >
                          {l.label}
                          {isActive(l.href) && <span className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" />}
                        </Link>
                        {hover === i && (
                          <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                        )}
                      </li>
                    ))}
                  </ul>
                  <MenuButton open={false} onClick={() => setOpen(true)} progress={progress} compact />
                  <Link
                    href={nav.ctaHref}
                    className="group flex h-10 items-center gap-1.5 rounded-full bg-accent pl-4 pr-3 text-[13.5px] font-semibold text-white transition hover:brightness-110"
                  >
                    {nav.ctaLabel}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                  </Link>
                </motion.div>
              )}

              {mode === "compact" && (
                <motion.div
                  key="compact"
                  layout="position"
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.15 } }}
                  transition={{ duration: 0.35, delay: 0.08 }}
                  className="flex h-[52px] items-center gap-2 pl-1.5 pr-1.5"
                >
                  <Logo brand={brand.name} short={brand.shortName} />
                  <span className="mx-1 h-5 w-px bg-white/15" />
                  <StatusTicker items={[nav.islandStatus, `Call ${brand.phone}`]} />
                  <MenuButton open={false} onClick={() => setOpen(true)} progress={progress} />
                </motion.div>
              )}

              {mode === "open" && (
                <motion.div
                  key="open"
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="max-h-[calc(100dvh-24px)] overflow-y-auto overscroll-contain"
                  data-lenis-prevent
                >
                  <div className="flex h-[60px] items-center justify-between pl-2 pr-2 pt-1">
                    <Logo brand={brand.name} short={brand.shortName} expanded />
                    <MenuButton open onClick={() => setOpen(false)} progress={progress} />
                  </div>

                  <div className="grid gap-6 px-5 pb-6 pt-4 md:grid-cols-[1.25fr_1fr] md:gap-8 md:px-8 md:pb-8">
                    <ul className="flex flex-col">
                      {[{ label: "Home", href: "/" }, ...nav.links].map((l, i) => (
                        <motion.li
                          key={l.href}
                          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ duration: 0.6, ease: EASE, delay: 0.12 + i * 0.035 }}
                        >
                          <Link
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="group flex items-baseline gap-4 border-b border-white/[0.07] py-2.5 md:py-3"
                          >
                            <span className="eyebrow w-6 text-white/35">{String(i + 1).padStart(2, "0")}</span>
                            <span
                              className={cn(
                                "text-[clamp(1.6rem,5.5vw,2.4rem)] font-semibold leading-none tracking-[-0.035em] transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent",
                                isActive(l.href) ? "text-white" : "text-white/80",
                              )}
                            >
                              {l.label}
                            </span>
                            <ArrowUpRight className="ml-auto size-5 -translate-x-2 text-accent opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>

                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
                      className="flex flex-col gap-4"
                    >
                      {featured && (
                        <Link href={`/courses/${featured.slug}`} onClick={() => setOpen(false)} className="group relative block aspect-[4/3] overflow-hidden rounded-[22px]">
                          <Image src={featured.image} alt={featured.title} fill sizes="400px" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-apple)] group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-5">
                            <span className="eyebrow rounded-full bg-white/15 px-2.5 py-1 text-white/90 backdrop-blur">Featured · {featured.category}</span>
                            <p className="mt-3 text-2xl font-semibold tracking-tight">{featured.title}</p>
                            <p className="serif text-lg text-white/70">{featured.tagline}</p>
                          </div>
                        </Link>
                      )}
                      <Link
                        href={nav.ctaHref}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between rounded-[18px] bg-accent px-5 py-4 font-semibold"
                      >
                        {nav.ctaLabel}
                        <span className="grid size-9 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                          <ArrowUpRight className="size-4" />
                        </span>
                      </Link>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 rounded-[14px] bg-white/[0.06] px-3 py-3 text-white/80 transition hover:bg-white/10">
                          <Phone className="size-4 text-accent" /> Call us
                        </a>
                        <a href={`mailto:${brand.email}`} className="flex items-center gap-2 rounded-[14px] bg-white/[0.06] px-3 py-3 text-white/80 transition hover:bg-white/10">
                          <Mail className="size-4 text-accent" /> Email
                        </a>
                      </div>
                      <div className="flex gap-2">
                        {[
                          [brand.instagram, Instagram],
                          [brand.youtube, Youtube],
                          [brand.facebook, Facebook],
                          [brand.linkedin, Linkedin],
                        ]
                          .filter(([h]) => h)
                          .map(([h, Icon], i) => {
                            const I = Icon as typeof Instagram;
                            return (
                              <a key={i} href={h as string} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full bg-white/[0.06] text-white/70 transition hover:bg-white hover:text-ink">
                                <I className="size-4" />
                              </a>
                            );
                          })}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        </LayoutGroup>
      </div>
    </>
  );
}

function Logo({ brand, short, expanded }: { brand: string; short: string; expanded?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 pr-1" aria-label={brand}>
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-full bg-white text-ink">
        <span className="serif text-[22px] leading-none">{short.charAt(0)}</span>
        <span className="absolute right-[7px] top-[7px] size-1.5 rounded-full bg-accent" />
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.02em]">
        {expanded ? brand : short}
      </span>
    </Link>
  );
}

function StatusTicker({ items }: { items: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 3200);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <div className="flex min-w-0 items-center gap-2 pr-1">
      <span className="pulse-dot size-2 shrink-0 rounded-full text-emerald-400" style={{ background: "currentColor" }} />
      <div className="relative h-5 w-[150px] overflow-hidden sm:w-[190px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-0 truncate text-[13px] leading-5 text-white/75"
          >
            {items[i]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function MenuButton({ open, onClick, progress, compact }: { open: boolean; onClick: () => void; progress: ReturnType<typeof useSpring>; compact?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className={cn("relative grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.08] transition hover:bg-white/15", compact && "mr-1")}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40" aria-hidden>
        <motion.circle cx="20" cy="20" r="18.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ pathLength: progress }} />
      </svg>
      <span className="relative block h-3 w-4">
        <span className={cn("absolute left-0 h-[1.5px] w-4 rounded bg-white transition-all duration-500 ease-[var(--ease-apple)]", open ? "top-1/2 rotate-45" : "top-0.5")} />
        <span className={cn("absolute left-0 h-[1.5px] rounded bg-white transition-all duration-500 ease-[var(--ease-apple)]", open ? "top-1/2 w-4 -rotate-45" : "bottom-0.5 w-2.5")} />
      </span>
    </button>
  );
}
