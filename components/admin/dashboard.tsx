"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarClock, Phone, TrendingDown, TrendingUp } from "lucide-react";
import type { Lead } from "@/lib/types";
import { LEAD_STATUSES } from "@/lib/collections";
import { cn, fmtDate, inr } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const tileAnim = (i: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay: i * 0.06 },
});

export function Dashboard({ leads, counts, brand }: { leads: Lead[]; counts: { label: string; href: string; n: number }[]; brand: string }) {
  const [range, setRange] = useState<14 | 30>(30);

  const m = useMemo(() => {
    const now = new Date();
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    const today = iso(now);
    const days = Array.from({ length: range }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (range - 1 - i));
      return iso(d);
    });
    const perDay = days.map((d) => ({ d, n: leads.filter((l) => l.createdAt.slice(0, 10) === d).length }));
    const prevTotal = leads.filter((l) => {
      const t = +new Date(l.createdAt);
      return t <= +new Date(days[0]) && t > +new Date(days[0]) - range * 864e5;
    }).length;
    const curTotal = perDay.reduce((s, p) => s + p.n, 0);
    const enrolled = leads.filter((l) => l.status === "enrolled");
    const closed = leads.filter((l) => l.status === "enrolled" || l.status === "lost").length;
    const due = leads.filter((l) => l.followUp && l.followUp <= today && l.status !== "enrolled" && l.status !== "lost").sort((a, b) => a.followUp.localeCompare(b.followUp));
    const sources = Object.entries(leads.reduce<Record<string, number>>((a, l) => ((a[l.source] = (a[l.source] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
    const courses = Object.entries(leads.reduce<Record<string, number>>((a, l) => (l.course && (a[l.course] = (a[l.course] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
    return {
      perDay,
      curTotal,
      delta: prevTotal ? Math.round(((curTotal - prevTotal) / prevTotal) * 100) : 100,
      newToday: leads.filter((l) => l.createdAt.slice(0, 10) === today).length,
      fresh: leads.filter((l) => l.status === "new").length,
      conv: leads.length ? Math.round((enrolled.length / leads.length) * 100) : 0,
      winRate: closed ? Math.round((enrolled.length / closed) * 100) : 0,
      revenue: enrolled.reduce((s, l) => s + (l.value || 0), 0),
      enrolled: enrolled.length,
      due,
      sources,
      courses,
      byStatus: LEAD_STATUSES.map((s) => ({ ...s, n: leads.filter((l) => l.status === s.id).length })),
    };
  }, [leads, range]);

  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="grid gap-3 lg:grid-cols-12">
      {/* Welcome */}
      <motion.section {...tileAnim(0)} className="relative overflow-hidden rounded-[26px] bg-accent p-6 text-white md:p-8 lg:col-span-8">
        <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full border border-white/10" />
        <div aria-hidden className="absolute -right-10 -top-10 size-52 rounded-full border border-white/10" />
        <div className="relative flex h-full flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-[13px] text-white/60">{fmtDate(new Date().toISOString(), { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1 className="mt-2 text-[clamp(1.9rem,3.6vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.04em]">{greet}.</h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/75">
              <b className="text-accent2">{m.fresh} new leads</b> waiting and <b className="text-accent2">{m.due.length} follow-ups</b> due at {brand}. {m.newToday ? `${m.newToday} enquiries came in today.` : ""}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/admin/leads?status=new" className="group flex h-11 items-center gap-2 rounded-full bg-accent2 pl-5 pr-1.5 text-[14px] font-semibold text-ink">
                Work on new leads
                <span className="grid size-8 place-items-center rounded-full bg-ink text-accent2 transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight className="size-4" /></span>
              </Link>
              <Link href="/admin/settings" className="flex h-11 items-center rounded-full px-5 text-[14px] font-semibold text-white/85 ring-1 ring-white/25 transition hover:bg-white hover:text-accent">
                Edit website
              </Link>
            </div>
          </div>
          <Ring value={m.conv} label="Conversion" sub={`${m.enrolled} enrolled`} />
        </div>
      </motion.section>

      {/* Revenue */}
      <motion.section {...tileAnim(1)} className="flex flex-col justify-between gap-6 rounded-[26px] bg-accent2 p-6 text-ink md:p-7 lg:col-span-4">
        <div className="flex items-center justify-between text-[13px] font-medium text-ink/65">
          Revenue from enrolments
          <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-semibold">{m.winRate}% win rate</span>
        </div>
        <div>
          <p className="text-[clamp(2rem,3.4vw,2.8rem)] font-semibold leading-none tracking-[-0.045em]">{inr(m.revenue)}</p>
          <p className="mt-2 text-[13px] text-ink/60">from {m.enrolled} students · deal values in CRM</p>
        </div>
        <Spark data={m.perDay.map((p) => p.n)} />
      </motion.section>

      {/* Inflow chart */}
      <motion.section {...tileAnim(2)} className="rounded-[26px] bg-white p-6 md:p-7 lg:col-span-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-muted">Lead inflow · last {range} days</p>
            <div className="mt-1 flex items-baseline gap-3">
              <p className="text-[34px] font-semibold leading-none tracking-[-0.045em]">{m.curTotal}</p>
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold", m.delta >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600")}>
                {m.delta >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                {m.delta > 0 ? "+" : ""}
                {m.delta}%
              </span>
            </div>
          </div>
          <div className="flex rounded-full bg-paper p-1 text-[12.5px] font-semibold">
            {([14, 30] as const).map((r) => (
              <button key={r} onClick={() => setRange(r)} className={cn("relative rounded-full px-3.5 py-1.5 transition-colors", range === r ? "text-white" : "text-ink/55")}>
                {range === r && <motion.span layoutId="range" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                <span className="relative">{r} days</span>
              </button>
            ))}
          </div>
        </div>
        <AreaChart key={range} data={m.perDay} />
      </motion.section>

      {/* Funnel */}
      <motion.section {...tileAnim(3)} className="rounded-[26px] bg-ink p-6 text-white md:p-7 lg:col-span-4">
        <p className="text-[13px] font-medium text-white/55">Admission funnel</p>
        <div className="mt-5 space-y-2">
          {m.byStatus.map((s, i) => {
            const w = Math.max(18, (s.n / Math.max(1, ...m.byStatus.map((x) => x.n))) * 100);
            return (
              <Link key={s.id} href={`/admin/leads?status=${s.id}`} className="group flex items-center gap-3">
                <span className="w-24 shrink-0 text-[12.5px] text-white/60 group-hover:text-white">{s.label}</span>
                <div className="flex flex-1 justify-center">
                  <motion.div
                    className="flex h-9 items-center justify-center rounded-lg text-[13px] font-semibold"
                    style={{ background: i === 3 ? "var(--accent-2)" : `rgb(255 255 255 / ${0.16 - i * 0.02})`, color: i === 3 ? "var(--ink)" : "white" }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${w}%` }}
                    transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.08 }}
                  >
                    {s.n}
                  </motion.div>
                </div>
              </Link>
            );
          })}
        </div>
        <p className="mt-5 text-[12px] text-white/45">Click a stage to open those leads in the CRM.</p>
      </motion.section>

      {/* Follow-ups */}
      <motion.section {...tileAnim(4)} className="rounded-[26px] bg-white p-6 md:p-7 lg:col-span-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-muted">Follow-ups due</p>
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[12px] font-semibold text-accent">{m.due.length}</span>
        </div>
        <ol className="relative mt-4 space-y-1 border-l border-line pl-4">
          {m.due.slice(0, 5).map((l) => {
            const overdue = l.followUp < new Date().toISOString().slice(0, 10);
            return (
              <li key={l.id} className="relative">
                <span className={cn("absolute -left-[21px] top-3.5 size-2.5 rounded-full ring-4 ring-white", overdue ? "bg-red-500" : "bg-accent2")} />
                <div className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-paper">
                  <Link href={`/admin/leads?lead=${l.id}`} className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold">{l.name}</p>
                    <p className="flex items-center gap-1 truncate text-[12px] text-muted">
                      <CalendarClock className="size-3" /> {overdue ? "Overdue · " : ""}
                      {fmtDate(l.followUp, { day: "numeric", month: "short" })} · {l.course}
                    </p>
                  </Link>
                  <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="grid size-8 shrink-0 place-items-center rounded-full bg-paper transition hover:bg-accent hover:text-white" aria-label={`Call ${l.name}`}>
                    <Phone className="size-3.5" />
                  </a>
                </div>
              </li>
            );
          })}
          {!m.due.length && <li className="py-6 text-[13px] text-muted">All caught up 🎉</li>}
        </ol>
      </motion.section>

      {/* Sources donut */}
      <motion.section {...tileAnim(5)} className="rounded-[26px] bg-white p-6 md:p-7 lg:col-span-4">
        <p className="text-[13px] font-medium text-muted">Where leads come from</p>
        <Donut data={m.sources} total={leads.length} />
      </motion.section>

      {/* Programs */}
      <motion.section {...tileAnim(6)} className="rounded-[26px] bg-white p-6 md:p-7 lg:col-span-4">
        <p className="text-[13px] font-medium text-muted">Most enquired programs</p>
        <ul className="mt-4 space-y-3.5">
          {m.courses.slice(0, 6).map(([c, n], i) => (
            <li key={c}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-[13.5px]">
                <span className="truncate font-medium">{c}</span>
                <span className="font-semibold tabular-nums">{n}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-paper">
                <motion.div className={cn("h-full rounded-full", i === 0 ? "bg-accent" : "bg-ink/25")} initial={{ width: 0 }} animate={{ width: `${(n / m.courses[0][1]) * 100}%` }} transition={{ duration: 1, ease: EASE, delay: 0.3 + i * 0.06 }} />
              </div>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Latest */}
      <motion.section {...tileAnim(7)} className="rounded-[26px] bg-white p-6 md:p-7 lg:col-span-7">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-muted">Latest enquiries</p>
          <Link href="/admin/leads" className="text-[13px] font-semibold text-accent hover:underline">Open CRM →</Link>
        </div>
        <ul className="mt-3 divide-y divide-line">
          {leads.slice(0, 6).map((l) => {
            const st = LEAD_STATUSES.find((s) => s.id === l.status)!;
            return (
              <li key={l.id}>
                <Link href={`/admin/leads?lead=${l.id}`} className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-paper">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/10 text-[12px] font-bold text-accent">
                    {l.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold">{l.name}</p>
                    <p className="truncate text-[12px] text-muted">{l.course || "—"} · {l.source}</p>
                  </div>
                  <span className="hidden rounded-full px-2 py-0.5 text-[11px] font-semibold sm:inline" style={{ background: st.color + "1a", color: st.color }}>{st.label}</span>
                  <span className="w-12 text-right text-[12px] text-muted">{fmtDate(l.createdAt, { day: "numeric", month: "short" })}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.section>

      {/* Content */}
      <motion.section {...tileAnim(8)} className="rounded-[26px] bg-white p-6 md:p-7 lg:col-span-5">
        <p className="text-[13px] font-medium text-muted">Website content</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {counts.map((c) => (
            <Link key={c.href} href={c.href} className="group relative overflow-hidden rounded-2xl bg-paper p-3.5 transition-colors duration-300 hover:bg-accent hover:text-white">
              <p className="text-[24px] font-semibold leading-none tracking-[-0.04em]">{c.n}</p>
              <p className="mt-1.5 truncate text-[12px] opacity-60">{c.label}</p>
              <ArrowUpRight className="absolute right-3 top-3 size-3.5 opacity-0 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

/* ───────── Charts ───────── */

function Ring({ value, label, sub }: { value: number; label: string; sub: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid size-[140px] shrink-0 place-items-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="9" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--accent-2)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
        />
      </svg>
      <div className="text-center">
        <p className="text-[30px] font-semibold leading-none tracking-[-0.04em]">{value}%</p>
        <p className="mt-1 text-[11.5px] text-white/60">{label}</p>
        <p className="text-[11px] text-white/45">{sub}</p>
      </div>
    </div>
  );
}

function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[Math.max(0, i - 1)];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const [x3, y3] = pts[Math.min(pts.length - 1, i + 2)];
    const t = 0.12;
    d += ` C ${x1 + (x2 - x0) * t} ${y1 + (y2 - y0) * t}, ${x2 - (x3 - x1) * t} ${y2 - (y3 - y1) * t}, ${x2} ${y2}`;
  }
  return d;
}

function AreaChart({ data }: { data: { d: string; n: number }[] }) {
  const W = 760;
  const H = 220;
  const P = 8;
  const max = Math.max(2, ...data.map((p) => p.n)) * 1.15;
  const pts: [number, number][] = data.map((p, i) => [P + (i / (data.length - 1)) * (W - P * 2), H - P - (p.n / max) * (H - P * 2)]);
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="relative mt-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[220px] w-full overflow-visible"
        preserveAspectRatio="none"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * W;
          setHover(Math.max(0, Math.min(data.length - 1, Math.round(((x - P) / (W - P * 2)) * (data.length - 1)))));
        }}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke="var(--line)" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
        ))}
        <motion.path d={area} fill="url(#area-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} />
        <motion.path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: EASE }} />
        {hover !== null && (
          <line x1={pts[hover][0]} x2={pts[hover][0]} y1={0} y2={H} stroke="var(--ink)" strokeOpacity="0.15" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
      <AnimatePresence>
        {hover !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute"
            style={{ left: `${(pts[hover][0] / W) * 100}%`, top: `${(pts[hover][1] / H) * 100}%` }}
          >
            <span className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent shadow" />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[12px] font-medium text-white shadow-lg">
              <b className="text-accent2">{data[hover].n}</b> leads · {fmtDate(data[hover].d, { day: "numeric", month: "short" })}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-2 flex justify-between text-[11.5px] text-muted">
        <span>{fmtDate(data[0].d, { day: "numeric", month: "short" })}</span>
        <span>{fmtDate(data[Math.floor(data.length / 2)].d, { day: "numeric", month: "short" })}</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function Spark({ data }: { data: number[] }) {
  const W = 300;
  const H = 54;
  const max = Math.max(1, ...data);
  const pts: [number, number][] = data.map((v, i) => [(i / (data.length - 1)) * W, H - 4 - (v / max) * (H - 8)]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-14 w-full" preserveAspectRatio="none">
      <motion.path d={smoothPath(pts)} fill="none" stroke="var(--ink)" strokeWidth="2" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: EASE, delay: 0.4 }} />
    </svg>
  );
}

const DONUT_COLORS = ["var(--accent)", "var(--accent-2)", "#15171a", "#7c9a8d", "#d9c3a0", "#b5b0a6", "#4a6b60", "#e7dcc8", "#8a857c"];

function Donut({ data, total }: { data: [string, number][]; total: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const [hover, setHover] = useState<number | null>(null);
  let acc = 0;
  const shown = hover !== null ? data[hover] : null;
  return (
    <div className="mt-4 flex items-center gap-5">
      <div className="relative grid size-[132px] shrink-0 place-items-center">
        <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
          {data.map(([k, n], i) => {
            const len = (n / Math.max(1, total)) * c;
            const seg = (
              <motion.circle
                key={k}
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
                strokeWidth={hover === i ? 16 : 12}
                strokeDasharray={`${Math.max(0, len - 1.5)} ${c}`}
                strokeDashoffset={-acc}
                initial={{ opacity: 0 }}
                animate={{ opacity: hover === null || hover === i ? 1 : 0.3 }}
                transition={{ duration: 0.5, delay: hover === null ? 0.2 + i * 0.06 : 0 }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
            );
            acc += len;
            return seg;
          })}
        </svg>
        <div className="pointer-events-none text-center">
          <p className="text-[24px] font-semibold leading-none tracking-[-0.04em]">{shown ? shown[1] : total}</p>
          <p className="mt-1 max-w-[80px] truncate text-[11px] text-muted">{shown ? shown[0] : "total leads"}</p>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {data.slice(0, 6).map(([k, n], i) => (
          <li key={k} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className={cn("flex items-center gap-2 rounded-lg px-1.5 py-0.5 text-[12.5px] transition", hover === i && "bg-paper")}>
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            <span className="min-w-0 flex-1 truncate text-ink/75">{k}</span>
            <span className="font-semibold tabular-nums">{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
