"use client";

import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Check, Loader2, MapPin, Phone, Mail } from "lucide-react";
import type { Settings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Bento footer: tiles that mirror the hero, a callback form wired to the CRM,
 *  a live open/closed campus status and an outlined wordmark that fills on scroll. */
export function Footer({ settings, courses }: { settings: Settings; courses: { title: string; slug: string }[] }) {
  const { brand, nav } = settings;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const fill = useTransform(scrollYProgress, [0.45, 1], [0, 100]);
  const bg = useTransform(fill, (f) => `linear-gradient(90deg, var(--accent) ${f}%, transparent ${f}%)`);
  const lift = useTransform(scrollYProgress, [0, 1], [60, 0]);

  const socials = (["instagram", "youtube", "facebook", "linkedin"] as const).filter((k) => brand[k]);

  return (
    <footer ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y: lift }} className="mx-auto max-w-[1440px] px-3 pb-4 pt-16 md:px-5 md:pt-24">
        <div className="grid gap-3 lg:grid-cols-12">
          {/* CTA + callback */}
          <Reveal className="relative overflow-hidden rounded-[28px] bg-accent p-6 text-white md:p-10 lg:col-span-7">
            <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full border border-white/10" />
            <div aria-hidden className="absolute -right-6 -top-6 size-44 rounded-full border border-white/10" />
            <p className="text-[13px] font-medium text-white/60">Free counselling · 24h response</p>
            <h2 className="display mt-4 max-w-xl text-[clamp(2rem,4.4vw,3.8rem)]">
              Your rank starts with <span className="text-accent2">one conversation.</span>
            </h2>
            <Callback />
          </Reveal>

          {/* Campus */}
          <Reveal delay={0.08} className="flex flex-col justify-between gap-8 rounded-[28px] bg-ink p-6 text-white md:p-8 lg:col-span-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-white/50">Visit the campus</p>
                <OpenStatus />
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(brand.address)}`}
                target="_blank"
                rel="noreferrer"
                className="group flex shrink-0 items-center gap-2 rounded-full bg-white/10 py-2 pl-4 pr-2 text-[13px] font-semibold transition hover:bg-white hover:text-ink"
              >
                Directions
                <span className="grid size-7 place-items-center rounded-full bg-accent2 text-ink transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </a>
            </div>
            <ul className="space-y-3 text-[15px] text-white/75">
              <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-accent2" />{brand.address}</li>
              <li><a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="flex gap-3 transition hover:text-white"><Phone className="mt-0.5 size-4 shrink-0 text-accent2" />{brand.phone}</a></li>
              <li><a href={`mailto:${brand.email}`} className="flex gap-3 transition hover:text-white"><Mail className="mt-0.5 size-4 shrink-0 text-accent2" />{brand.email}</a></li>
            </ul>
          </Reveal>

          {/* Explore */}
          <Reveal delay={0.12} className="flex flex-col justify-between gap-8 rounded-[28px] bg-white p-6 md:p-8 lg:col-span-4">
            <div>
            <p className="mb-5 text-[13px] font-medium text-muted">Explore</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group inline-flex items-center gap-1 text-[15px] font-medium text-ink/80 transition hover:text-accent">
                    {l.label}
                    <ArrowUpRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
            </div>
            <div className="rounded-2xl bg-paper p-4">
              <p className="text-[12px] font-medium text-muted">Office hours</p>
              <p className="mt-0.5 text-[15px] font-semibold">{brand.hours}</p>
            </div>
          </Reveal>

          {/* Programs */}
          <Reveal delay={0.16} className="rounded-[28px] bg-white p-6 md:p-8 lg:col-span-4">
            <p className="mb-5 text-[13px] font-medium text-muted">Programs</p>
            <ul className="space-y-2.5">
              {courses.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/courses/${c.slug}`} className="group flex items-center justify-between gap-3 border-b border-line pb-2.5 text-[15px] font-medium text-ink/80 transition hover:text-accent">
                    <span className="truncate">{c.title}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-ink/30 transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Social */}
          <Reveal delay={0.2} className="flex flex-col justify-between gap-6 rounded-[28px] bg-accent2 p-6 text-ink md:p-8 lg:col-span-4">
            <p className="text-[13px] font-medium text-ink/60">Follow the journey</p>
            <ul className="divide-y divide-ink/15">
              {socials.map((k) => (
                <li key={k}>
                  <a href={brand[k]} target="_blank" rel="noreferrer" className="group flex items-center justify-between py-3 text-[clamp(1.25rem,2vw,1.6rem)] font-semibold capitalize tracking-[-0.03em]">
                    <span className="transition-transform duration-500 ease-[var(--ease-apple)] group-hover:translate-x-2">{k === "youtube" ? "YouTube" : k === "linkedin" ? "LinkedIn" : k}</span>
                    <span className="grid size-9 place-items-center rounded-full bg-ink/10 transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-accent2">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Wordmark that fills as you reach the bottom */}
        <div aria-hidden className="relative select-none overflow-hidden pt-6 md:pt-10">
          <motion.p
            style={{ backgroundImage: bg, WebkitTextStroke: "1.5px var(--ink)" }}
            className="text-center text-[clamp(4.5rem,22vw,21rem)] font-semibold leading-[0.82] tracking-[-0.065em] text-transparent [-webkit-background-clip:text] [background-clip:text]"
          >
            {brand.shortName}
          </motion.p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-[22px] border border-line px-5 py-4 text-[13px] text-muted md:flex-row md:rounded-full md:py-3">
          <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <LocalTime />
            <Link href="/contact" className="transition hover:text-ink">Privacy</Link>
            <Link href="/contact" className="transition hover:text-ink">Terms</Link>
            <button
              onClick={() => (window.__lenis ? window.__lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
              className="group flex items-center gap-2 rounded-full bg-ink py-1.5 pl-3.5 pr-1.5 font-medium text-white transition hover:bg-accent"
            >
              Back to top
              <span className="grid size-6 place-items-center rounded-full bg-white/15 transition-transform duration-500 group-hover:-translate-y-0.5">
                <ArrowUp className="size-3.5" />
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

function Callback() {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Callback request", phone, source: "Footer callback", message: "Requested a call back from the website footer." }),
    }).catch(() => null);
    setState(res?.ok ? "done" : "error");
  }
  return (
    <div className="relative mt-8 max-w-lg">
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex h-[60px] items-center gap-3 rounded-full bg-white/10 px-5 text-[15px] font-medium">
            <span className="grid size-7 place-items-center rounded-full bg-accent2 text-ink"><Check className="size-4" /></span>
            Got it — a counsellor will call you shortly.
          </motion.div>
        ) : (
          <motion.form key="f" onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="flex h-[60px] items-center rounded-full bg-white p-1.5 pl-5 text-ink">
            <span className="mr-2 text-[15px] font-medium text-ink/50">+91</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
              required
              inputMode="tel"
              minLength={10}
              placeholder="Your phone number"
              aria-label="Phone number"
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink/35"
            />
            <button disabled={state === "loading"} className="flex h-full shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-white transition hover:bg-accent2 hover:text-ink">
              {state === "loading" ? <Loader2 className="size-4 animate-spin" /> : "Call me back"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {state === "error" && <p className="mt-2 text-[13px] text-accent2">Please enter a valid 10-digit number.</p>}
    </div>
  );
}

/** Mon–Sat 8:00–20:00 IST. */
function OpenStatus() {
  const [s, setS] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    const calc = () => {
      const ist = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const day = ist.getDay();
      const h = ist.getHours() + ist.getMinutes() / 60;
      const open = day !== 0 && h >= 8 && h < 20;
      setS({ open, text: open ? "Open now" : "Closed now" });
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="mt-2 flex items-center gap-2.5 text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold tracking-[-0.03em]">
      <span className={cn("relative flex size-2.5", !s && "opacity-0")}>
        {s?.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />}
        <span className={cn("relative size-2.5 rounded-full", s?.open ? "bg-emerald-400" : "bg-red-400")} />
      </span>
      {s?.text ?? "Campus hours"}
      {s && <span className="text-[13px] font-medium tracking-normal text-white/50">{s.open ? "till 8 PM" : "opens 8 AM, Mon–Sat"}</span>}
    </p>
  );
}

function LocalTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" }));
    f();
    const id = setInterval(f, 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: t ? 1 : 0 }} transition={{ duration: 0.6, ease: EASE }} className="tabular-nums">
      Noida · {t} IST
    </motion.span>
  );
}
