"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Phone, X } from "lucide-react";
import type { Settings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, Linkedin, Youtube } from "./icons";

const EASE = [0.22, 1, 0.36, 1] as const;
const CURTAIN = [0.76, 0, 0.24, 1] as const;

/**
 * Split navbar: three floating pieces — logo chip, a segmented link rail with a
 * sliding indicator, and an action cluster. The rail tucks away while scrolling
 * down and returns on scroll up. The menu opens as a full-screen panel that
 * grows out of the menu button, with live image previews per link.
 */
export function Navbar({ settings, previews }: { settings: Settings; previews: Record<string, string> }) {
  const { brand, nav } = settings;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    if (y > 240 && y > prev + 4) setHidden(true);
    else if (y < prev - 4 || y < 240) setHidden(false);
  });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const rail = nav.links.slice(0, 5);
  const activeHref = rail.find((l) => isActive(l.href))?.href ?? null;
  const indicator = hover ?? activeHref;

  return (
    <>
      {/* reading progress */}
      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-accent2" />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-3 pt-3 md:px-5 md:pt-4">
          {/* logo chip */}
          <Link
            href="/"
            aria-label={brand.name}
            className={cn(
              "pointer-events-auto flex h-14 items-center gap-3 rounded-full bg-white/85 pl-2 pr-5 ring-1 ring-black/[0.06] backdrop-blur-xl transition-shadow duration-500",
              scrolled && "shadow-[0_12px_40px_-16px_rgba(0,0,0,0.25)]",
            )}
          >
            <Mark letter={brand.shortName.charAt(0)} />
            <span className="text-[15px] font-semibold tracking-[-0.02em]">
              <span className="sm:hidden">{brand.shortName}</span>
              <span className="hidden sm:inline">{brand.name}</span>
            </span>
          </Link>

          {/* segmented link rail */}
          <motion.nav
            aria-label="Main"
            animate={{ y: hidden ? -90 : 0, opacity: hidden ? 0 : 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className={cn(
              "pointer-events-auto hidden h-14 items-center rounded-full bg-white/85 p-1.5 ring-1 ring-black/[0.06] backdrop-blur-xl transition-shadow duration-500 lg:flex",
              scrolled && "shadow-[0_12px_40px_-16px_rgba(0,0,0,0.25)]",
            )}
            onMouseLeave={() => setHover(null)}
          >
            {rail.map((l) => {
              const on = indicator === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onMouseEnter={() => setHover(l.href)}
                  className={cn("relative flex h-full items-center rounded-full px-[18px] text-[14px] font-medium transition-colors duration-300", on ? "text-white" : "text-ink/65 hover:text-ink")}
                >
                  {on && <motion.span layoutId="rail-indicator" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative">{l.label}</span>
                  {isActive(l.href) && !on && <span className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" />}
                </Link>
              );
            })}
          </motion.nav>

          {/* actions */}
          <div className="pointer-events-auto flex items-center gap-2">
            <a
              href={`tel:${brand.phone.replace(/\s/g, "")}`}
              aria-label={`Call ${brand.phone}`}
              className="hidden size-14 place-items-center rounded-full bg-white/85 text-ink ring-1 ring-black/[0.06] backdrop-blur-xl transition hover:bg-white md:grid"
            >
              <Phone className="size-[18px]" />
            </a>
            <Link href={nav.ctaHref} className="group hidden h-14 items-center gap-3 rounded-full bg-accent pl-6 pr-2 text-[14.5px] font-semibold text-white transition-colors duration-500 hover:bg-ink sm:flex">
              {nav.ctaLabel}
              <span className="grid size-10 place-items-center rounded-full bg-accent2 text-ink transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="group flex h-14 items-center gap-3 rounded-full bg-ink pl-5 pr-5 text-[14px] font-semibold text-white transition-colors duration-500 hover:bg-accent"
            >
              <span className="hidden md:inline">Menu</span>
              <span className="flex w-5 flex-col items-end gap-[5px]">
                <span className="h-[1.5px] w-5 rounded bg-current transition-all duration-500 group-hover:w-3" />
                <span className="h-[1.5px] w-3 rounded bg-current transition-all duration-500 group-hover:w-5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>{open && <MenuPanel settings={settings} previews={previews} isActive={isActive} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function Mark({ letter, inverted }: { letter: string; inverted?: boolean }) {
  return (
    <span className={cn("relative grid size-10 place-items-center rounded-full", inverted ? "bg-accent2 text-ink" : "bg-accent text-accent2")}>
      <span className="text-[18px] font-bold leading-none">{letter}</span>
      <span className={cn("absolute bottom-[7px] right-[7px] size-1.5 rounded-full", inverted ? "bg-ink" : "bg-accent2")} />
    </span>
  );
}

/* ───────── Full-screen menu ───────── */

function MenuPanel({ settings, previews, isActive, onClose }: { settings: Settings; previews: Record<string, string>; isActive: (h: string) => boolean; onClose: () => void }) {
  const { brand, nav } = settings;
  const links = [{ label: "Home", href: "/" }, ...nav.links];
  const [hover, setHover] = useState<string>(links.find((l) => isActive(l.href))?.href || "/");
  const img = previews[hover] || previews["/"];
  const socials = [
    [brand.instagram, Instagram, "Instagram"],
    [brand.youtube, Youtube, "YouTube"],
    [brand.facebook, Facebook, "Facebook"],
    [brand.linkedin, Linkedin, "LinkedIn"],
  ] as const;

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-y-auto bg-accent text-white"
      initial={{ clipPath: "circle(0% at calc(100% - 52px) 44px)" }}
      animate={{ clipPath: "circle(150% at calc(100% - 52px) 44px)" }}
      exit={{ clipPath: "circle(0% at calc(100% - 52px) 44px)" }}
      transition={{ duration: 0.85, ease: CURTAIN }}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto flex min-h-full max-w-[1440px] flex-col px-3 pb-8 pt-3 md:px-5 md:pt-4">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex h-14 items-center gap-3 rounded-full bg-white/10 pl-2 pr-5">
            <Mark letter={brand.shortName.charAt(0)} inverted />
            <span className="text-[15px] font-semibold tracking-[-0.02em]">{brand.name}</span>
          </Link>
          <button onClick={onClose} aria-label="Close menu" className="group flex h-14 items-center gap-3 rounded-full bg-white pl-5 pr-2 text-[14px] font-semibold text-ink">
            Close
            <span className="grid size-10 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-90">
              <X className="size-4" />
            </span>
          </button>
        </div>

        <div className="mt-10 grid flex-1 gap-10 px-2 md:mt-14 md:px-6 lg:grid-cols-12 lg:gap-8">
          <ul className="group/list lg:col-span-7" onMouseLeave={() => setHover(links.find((l) => isActive(l.href))?.href || "/")}>
            {links.map((l, i) => (
              <motion.li
                key={l.href}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.04 }}
                className="overflow-hidden"
              >
                <Link
                  href={l.href}
                  onClick={onClose}
                  onMouseEnter={() => setHover(l.href)}
                  className={cn(
                    "flex items-baseline gap-4 py-1.5 transition-opacity duration-300 lg:group-hover/list:opacity-35 lg:hover:!opacity-100",
                  )}
                >
                  <span className="w-7 text-[12px] font-medium text-white/45 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("text-[clamp(2.1rem,5vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.045em] transition-transform duration-500 ease-[var(--ease-apple)]", hover === l.href && "lg:translate-x-3")}>
                    {l.label}
                  </span>
                  {isActive(l.href) && <span className="mb-[0.6em] size-2 self-end rounded-full bg-accent2" />}
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            className="flex flex-col gap-5 lg:col-span-5"
          >
            <div className="relative hidden aspect-[5/4] overflow-hidden rounded-[28px] bg-black/20 lg:block">
              <AnimatePresence initial={false}>
                {img && (
                  <motion.div
                    key={img}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(0 0 100% 0)", scale: 1.08 }}
                    animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: CURTAIN }}
                  >
                    <Image src={img} alt="" fill sizes="40vw" className="object-cover" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <p className="absolute bottom-5 left-5 text-[13px] font-medium text-white/85">
                {links.find((l) => l.href === hover)?.label} →
              </p>
            </div>

            <Link href={nav.ctaHref} onClick={onClose} className="group flex items-center justify-between rounded-[22px] bg-accent2 px-6 py-5 text-ink">
              <span>
                <span className="block text-[13px] font-medium text-ink/65">{nav.islandStatus}</span>
                <span className="text-xl font-semibold tracking-tight">{nav.ctaLabel}</span>
              </span>
              <span className="grid size-11 place-items-center rounded-full bg-ink text-accent2 transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="size-5" />
              </span>
            </Link>

            <div className="grid gap-x-6 gap-y-1 text-[14px] text-white/75 sm:grid-cols-2">
              <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="py-1 hover:text-white">{brand.phone}</a>
              <a href={`mailto:${brand.email}`} className="truncate py-1 hover:text-white">{brand.email}</a>
              <p className="py-1 sm:col-span-2">{brand.address}</p>
            </div>
            <div className="flex gap-2">
              {socials
                .filter(([h]) => h)
                .map(([h, Icon, label]) => (
                  <a key={label} href={h} target="_blank" rel="noreferrer" aria-label={label} className="grid size-11 place-items-center rounded-full border border-white/20 text-white/80 transition hover:bg-white hover:text-accent">
                    <Icon className="size-4" />
                  </a>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
