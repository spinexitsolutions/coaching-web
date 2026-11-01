"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarClock, IndianRupee, Inbox, Percent, TrendingUp, Phone } from "lucide-react";
import type { Lead } from "@/lib/types";
import { LEAD_STATUSES } from "@/lib/collections";
import { cn, fmtDate, inr } from "@/lib/utils";
import { Card, PageTitle } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Dashboard({ leads, counts, brand }: { leads: Lead[]; counts: { label: string; href: string; n: number }[]; brand: string }) {
  const [range, setRange] = useState<14 | 30>(30);
  const m = useMemo(() => {
    const now = new Date();
    const day = (d: Date) => d.toISOString().slice(0, 10);
    const days = Array.from({ length: range }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (range - 1 - i));
      return day(d);
    });
    const perDay = days.map((d) => ({ d, n: leads.filter((l) => l.createdAt.slice(0, 10) === d).length }));
    const weekAgo = Date.now() - 7 * 864e5;
    const twoWeeks = Date.now() - 14 * 864e5;
    const thisWeek = leads.filter((l) => +new Date(l.createdAt) > weekAgo).length;
    const lastWeek = leads.filter((l) => +new Date(l.createdAt) > twoWeeks && +new Date(l.createdAt) <= weekAgo).length;
    const enrolled = leads.filter((l) => l.status === "enrolled");
    const closed = leads.filter((l) => l.status === "enrolled" || l.status === "lost").length;
    const today = day(now);
    const due = leads.filter((l) => l.followUp && l.followUp <= today && l.status !== "enrolled" && l.status !== "lost").sort((a, b) => a.followUp.localeCompare(b.followUp));
    const sources = Object.entries(leads.reduce<Record<string, number>>((a, l) => ((a[l.source] = (a[l.source] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
    const courses = Object.entries(leads.reduce<Record<string, number>>((a, l) => (l.course && (a[l.course] = (a[l.course] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
    return {
      perDay,
      thisWeek,
      delta: lastWeek ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 100,
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

  const max = Math.max(1, ...m.perDay.map((p) => p.n));
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const kpis = [
    { label: "Total leads", value: leads.length.toLocaleString("en-IN"), sub: `${m.thisWeek} this week`, icon: Inbox, tone: "bg-ink text-white" },
    { label: "Weekly growth", value: `${m.delta > 0 ? "+" : ""}${m.delta}%`, sub: "vs previous week", icon: TrendingUp, tone: "bg-white" },
    { label: "Conversion rate", value: `${m.conv}%`, sub: `${m.enrolled} enrolled · ${m.winRate}% win rate`, icon: Percent, tone: "bg-white" },
    { label: "Revenue (enrolled)", value: inr(m.revenue), sub: "from CRM deal values", icon: IndianRupee, tone: "bg-accent text-white" },
  ];

  return (
    <div>
      <PageTitle title={`${greet} 👋`} subtitle={`Here's what's happening at ${brand} today, ${fmtDate(new Date().toISOString(), { weekday: "long", day: "numeric", month: "long" })}.`}>
        <Link href="/admin/leads" className="inline-flex h-10 items-center gap-2 rounded-xl bg-ink px-4 text-[14px] font-semibold text-white">
          Open CRM <ArrowUpRight className="size-4" />
        </Link>
      </PageTitle>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }} className={cn("rounded-2xl border border-black/[0.06] p-4 md:p-5", k.tone)}>
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium opacity-60">{k.label}</p>
              <k.icon className="size-4 opacity-50" />
            </div>
            <p className="mt-3 text-[26px] font-semibold tracking-[-0.03em] md:text-[30px]">{k.value}</p>
            <p className="text-[12px] opacity-55">{k.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.7fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold tracking-tight">Lead inflow</p>
              <p className="text-[12px] text-black/45">New enquiries per day</p>
            </div>
            <div className="flex rounded-lg bg-black/[0.04] p-0.5 text-[12px] font-medium">
              {([14, 30] as const).map((r) => (
                <button key={r} onClick={() => setRange(r)} className={cn("rounded-md px-2.5 py-1 transition", range === r ? "bg-white shadow-sm" : "text-black/50")}>
                  {r}d
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex h-48 items-end gap-[3px] md:gap-1.5">
            {m.perDay.map((p, i) => (
              <div key={p.d} className="group relative flex h-full flex-1 items-end">
                <motion.div
                  className={cn("w-full rounded-t-[5px]", i === m.perDay.length - 1 ? "bg-accent" : "bg-ink/80 group-hover:bg-accent")}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(3, (p.n / max) * 100)}%` }}
                  transition={{ duration: 0.8, ease: EASE, delay: i * 0.012 }}
                />
                <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100">
                  {p.n} · {fmtDate(p.d, { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-black/40">
            <span>{fmtDate(m.perDay[0].d, { day: "numeric", month: "short" })}</span>
            <span>Today</span>
          </div>
        </Card>

        <Card>
          <p className="font-semibold tracking-tight">Pipeline</p>
          <p className="text-[12px] text-black/45">Leads by stage</p>
          <div className="mt-5 space-y-3">
            {m.byStatus.map((s, i) => (
              <Link href={`/admin/leads?status=${s.id}`} key={s.id} className="block">
                <div className="mb-1 flex justify-between text-[13px]">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="size-2 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="text-black/50">{s.n}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/[0.05]">
                  <motion.div className="h-full rounded-full" style={{ background: s.color }} initial={{ width: 0 }} animate={{ width: `${(s.n / Math.max(1, leads.length)) * 100}%` }} transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.08 }} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold tracking-tight">Follow-ups due</p>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[12px] font-semibold text-accent">{m.due.length}</span>
          </div>
          <ul className="mt-3 divide-y divide-black/[0.05]">
            {m.due.slice(0, 6).map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-2.5">
                <CalendarClock className={cn("size-4 shrink-0", l.followUp < new Date().toISOString().slice(0, 10) ? "text-red-500" : "text-amber-500")} />
                <Link href={`/admin/leads?lead=${l.id}`} className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium">{l.name}</p>
                  <p className="truncate text-[12px] text-black/45">{l.course} · {fmtDate(l.followUp, { day: "numeric", month: "short" })}</p>
                </Link>
                <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="grid size-8 place-items-center rounded-lg bg-black/[0.04] hover:bg-ink hover:text-white">
                  <Phone className="size-3.5" />
                </a>
              </li>
            ))}
            {!m.due.length && <li className="py-6 text-center text-[13px] text-black/40">All caught up 🎉</li>}
          </ul>
        </Card>

        <Card>
          <p className="font-semibold tracking-tight">Lead sources</p>
          <div className="mt-4 space-y-2.5">
            {m.sources.map(([s, n]) => (
              <div key={s} className="flex items-center gap-3 text-[13px]">
                <span className="w-32 truncate text-black/60">{s}</span>
                <div className="h-6 flex-1 overflow-hidden rounded-md bg-black/[0.04]">
                  <motion.div className="flex h-full items-center rounded-md bg-accent px-2 text-[11px] font-semibold text-white" initial={{ width: 0 }} animate={{ width: `${(n / m.sources[0][1]) * 100}%` }} transition={{ duration: 1, ease: EASE }}>
                    {n}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="font-semibold tracking-tight">Most enquired programs</p>
          <div className="mt-4 space-y-3">
            {m.courses.slice(0, 6).map(([c, n], i) => (
              <div key={c} className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-lg bg-black/[0.04] text-[12px] font-semibold">{i + 1}</span>
                <span className="flex-1 truncate text-[13.5px]">{c}</span>
                <span className="text-[13px] font-semibold">{n}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-semibold tracking-tight">Latest enquiries</p>
            <Link href="/admin/leads" className="text-[13px] font-medium text-accent">View all</Link>
          </div>
          <ul className="mt-3 divide-y divide-black/[0.05]">
            {leads.slice(0, 6).map((l) => {
              const st = LEAD_STATUSES.find((s) => s.id === l.status)!;
              return (
                <li key={l.id}>
                  <Link href={`/admin/leads?lead=${l.id}`} className="flex items-center gap-3 py-2.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-black/[0.05] text-[12px] font-semibold">
                      {l.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium">{l.name}</p>
                      <p className="truncate text-[12px] text-black/45">{l.course || "—"} · {l.source}</p>
                    </div>
                    <span className="hidden rounded-full px-2 py-0.5 text-[11px] font-semibold sm:inline" style={{ background: st.color + "1a", color: st.color }}>{st.label}</span>
                    <span className="text-[12px] text-black/40">{fmtDate(l.createdAt, { day: "numeric", month: "short" })}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card>
          <p className="font-semibold tracking-tight">Website content</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {counts.map((c) => (
              <Link key={c.href} href={c.href} className="group rounded-xl bg-black/[0.03] p-3 transition hover:bg-ink hover:text-white">
                <p className="text-[22px] font-semibold tracking-tight">{c.n}</p>
                <p className="flex items-center justify-between text-[12px] opacity-60">
                  {c.label} <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" />
                </p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
