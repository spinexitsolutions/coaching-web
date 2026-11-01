"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Download, KanbanSquare, List, Mail, MessageCircle, Phone, Plus, Search, Trash2, X } from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/types";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/collections";
import { cn, fmtDate, inr } from "@/lib/utils";
import { Button, Drawer, PageTitle, inputCls, useToast } from "./ui";

const statusOf = (id: string) => LEAD_STATUSES.find((s) => s.id === id) || LEAD_STATUSES[0];
const initials = (n: string) => n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();
const COUNSELLORS = ["Priya (Counsellor)", "Rahul (Counsellor)", "Neha (Counsellor)"];

export function LeadsCRM({ initial, courses }: { initial: Lead[]; courses: string[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [leads, setLeads] = useState(initial);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>(params.get("status") || "all");
  const [source, setSource] = useState("all");
  const [course, setCourse] = useState("all");
  const [view, setView] = useState<"table" | "board">("table");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(params.get("lead"));
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("crm-view");
      if (v === "board" || v === "table") setView(v);
    } catch {}
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return leads.filter(
      (l) =>
        (status === "all" || l.status === status) &&
        (source === "all" || l.source === source) &&
        (course === "all" || l.course === course) &&
        (!s || [l.name, l.phone, l.email, l.course, l.message].some((x) => x?.toLowerCase().includes(s))),
    );
  }, [leads, q, status, source, course]);

  const sources = useMemo(() => Array.from(new Set([...LEAD_SOURCES, ...leads.map((l) => l.source)])), [leads]);
  const open = leads.find((l) => l.id === openId) || null;

  async function patch(id: string, body: Partial<Lead> & { addNote?: string; removeNote?: string }, msg?: string) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...body } : l)));
    const res = await fetch(`/api/admin/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) return toast("Could not save", "err");
    const updated = (await res.json()) as Lead;
    setLeads((ls) => ls.map((l) => (l.id === id ? updated : l)));
    if (msg) toast(msg);
    router.refresh();
  }

  async function remove(ids: string[]) {
    if (!confirm(`Delete ${ids.length} lead${ids.length > 1 ? "s" : ""}? This cannot be undone.`)) return;
    await Promise.all(ids.map((id) => fetch(`/api/admin/leads/${id}`, { method: "DELETE" })));
    setLeads((ls) => ls.filter((l) => !ids.includes(l.id)));
    setSelected(new Set());
    setOpenId(null);
    toast("Deleted");
    router.refresh();
  }

  async function bulkStatus(s: LeadStatus) {
    const ids = Array.from(selected);
    await Promise.all(ids.map((id) => patch(id, { status: s })));
    setSelected(new Set());
    toast(`Moved ${ids.length} to ${statusOf(s).label}`);
  }

  function exportCsv() {
    const cols: (keyof Lead)[] = ["name", "phone", "email", "course", "classLevel", "source", "status", "followUp", "assignedTo", "value", "message", "createdAt"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...filtered.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const setV = (v: "table" | "board") => {
    setView(v);
    try {
      localStorage.setItem("crm-view", v);
    } catch {}
  };

  return (
    <div>
      <PageTitle title="Leads & CRM" subtitle={`${leads.length} total · ${leads.filter((l) => l.status === "new").length} new — every form on the website lands here.`}>
        <Button variant="ghost" onClick={exportCsv}>
          <Download className="size-4" /> Export CSV
        </Button>
        <Button variant="accent" onClick={() => setCreating(true)}>
          <Plus className="size-4" /> Add lead
        </Button>
      </PageTitle>

      {/* Status tabs */}
      <div className="no-scrollbar -mx-4 mb-3 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0">
        {[{ id: "all", label: "All", color: "#0B0B0C" }, ...LEAD_STATUSES].map((s) => {
          const n = s.id === "all" ? leads.length : leads.filter((l) => l.status === s.id).length;
          const active = status === s.id;
          return (
            <button key={s.id} onClick={() => setStatus(s.id)} className={cn("relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition", active ? "text-white" : "bg-white text-black/60 hover:text-ink")}>
              {active && <motion.span layoutId="crm-tab" className="absolute inset-0 rounded-xl" style={{ background: s.color }} transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
              <span className="relative">{s.label}</span>
              <span className={cn("relative rounded-md px-1.5 text-[11px]", active ? "bg-white/25" : "bg-black/[0.05]")}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mb-3 flex flex-col gap-2 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35" />
          <input className={cn(inputCls, "pl-9")} placeholder="Search name, phone, email, course…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <select className={cn(inputCls, "md:w-44")} value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="all">All sources</option>
            {sources.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select className={cn(inputCls, "md:w-48")} value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="all">All programs</option>
            {courses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <div className="flex shrink-0 rounded-xl border border-black/10 bg-white p-0.5">
            {(["table", "board"] as const).map((v) => (
              <button key={v} onClick={() => setV(v)} className={cn("grid size-9 place-items-center rounded-lg transition", view === v ? "bg-ink text-white" : "text-black/50")} aria-label={v}>
                {v === "table" ? <List className="size-4" /> : <KanbanSquare className="size-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-ink px-3 py-2 text-[13px] text-white">
            <span className="font-semibold">{selected.size} selected</span>
            <span className="mx-1 h-4 w-px bg-white/20" />
            {LEAD_STATUSES.map((s) => (
              <button key={s.id} onClick={() => bulkStatus(s.id)} className="rounded-lg bg-white/10 px-2.5 py-1 hover:bg-white/20">
                → {s.label}
              </button>
            ))}
            <button onClick={() => remove(Array.from(selected))} className="ml-auto flex items-center gap-1 rounded-lg bg-red-500/90 px-2.5 py-1 hover:bg-red-500">
              <Trash2 className="size-3.5" /> Delete
            </button>
            <button onClick={() => setSelected(new Set())} className="grid size-7 place-items-center rounded-lg hover:bg-white/10">
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {view === "table" ? (
        <LeadTable leads={filtered} selected={selected} setSelected={setSelected} onOpen={setOpenId} onStatus={(id, s) => patch(id, { status: s }, "Status updated")} />
      ) : (
        <LeadBoard leads={filtered} onOpen={setOpenId} onMove={(id, s) => patch(id, { status: s }, `Moved to ${statusOf(s).label}`)} />
      )}

      <LeadDrawer lead={open} courses={courses} onClose={() => setOpenId(null)} onPatch={patch} onDelete={(id) => remove([id])} />
      <NewLeadDrawer
        open={creating}
        courses={courses}
        onClose={() => setCreating(false)}
        onCreated={(l) => {
          setLeads((ls) => [l, ...ls]);
          setCreating(false);
          toast("Lead added");
          router.refresh();
        }}
      />
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = statusOf(status);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold" style={{ background: s.color + "1a", color: s.color }}>
      <span className="size-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

function LeadTable({ leads, selected, setSelected, onOpen, onStatus }: { leads: Lead[]; selected: Set<string>; setSelected: (s: Set<string>) => void; onOpen: (id: string) => void; onStatus: (id: string, s: LeadStatus) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const all = leads.length > 0 && leads.every((l) => selected.has(l.id));
  const toggle = (id: string) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    setSelected(n);
  };
  if (!leads.length) return <div className="rounded-2xl bg-white py-20 text-center text-black/40">No leads match these filters.</div>;
  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
      {/* mobile cards */}
      <ul className="divide-y divide-black/[0.05] md:hidden">
        {leads.map((l) => (
          <li key={l.id} onClick={() => onOpen(l.id)} className="flex items-center gap-3 px-4 py-3 active:bg-black/[0.02]">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-black/[0.05] text-[12px] font-semibold">{initials(l.name)}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{l.name}</p>
              <p className="truncate text-[12px] text-black/45">{l.course || "—"} · {fmtDate(l.createdAt, { day: "numeric", month: "short" })}</p>
            </div>
            <StatusPill status={l.status} />
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-[13.5px]">
          <thead className="border-b border-black/[0.06] bg-black/[0.015] text-[11.5px] uppercase tracking-wider text-black/45">
            <tr>
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={all} onChange={() => setSelected(all ? new Set() : new Set(leads.map((l) => l.id)))} className="accent-[var(--accent)]" />
              </th>
              <th className="px-3 py-3 font-medium">Lead</th>
              <th className="px-3 py-3 font-medium">Program</th>
              <th className="px-3 py-3 font-medium">Source</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Follow-up</th>
              <th className="px-3 py-3 font-medium">Owner</th>
              <th className="px-3 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.05]">
            {leads.map((l) => (
              <tr key={l.id} className={cn("cursor-pointer transition hover:bg-black/[0.02]", selected.has(l.id) && "bg-accent/[0.04]")} onClick={() => onOpen(l.id)}>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.has(l.id)} onChange={() => toggle(l.id)} className="accent-[var(--accent)]" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-black/[0.05] text-[11px] font-semibold">{initials(l.name)}</span>
                    <div>
                      <p className="font-medium">{l.name}</p>
                      <p className="text-[12px] text-black/45">{l.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <p>{l.course || "—"}</p>
                  <p className="text-[12px] text-black/45">{l.classLevel}</p>
                </td>
                <td className="px-3 py-3 text-black/60">{l.source}</td>
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                  <select value={l.status} onChange={(e) => onStatus(l.id, e.target.value as LeadStatus)} className="cursor-pointer rounded-full border-0 py-1 pl-2.5 pr-7 text-[12px] font-semibold outline-none" style={{ background: statusOf(l.status).color + "1a", color: statusOf(l.status).color }}>
                    {LEAD_STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3">
                  {l.followUp ? (
                    <span className={cn("inline-flex items-center gap-1.5 text-[12.5px]", l.followUp < today && l.status !== "enrolled" && l.status !== "lost" ? "font-semibold text-red-500" : "text-black/60")}>
                      <CalendarClock className="size-3.5" /> {fmtDate(l.followUp, { day: "numeric", month: "short" })}
                    </span>
                  ) : (
                    <span className="text-black/25">—</span>
                  )}
                </td>
                <td className="px-3 py-3 text-black/60">{l.assignedTo?.split(" ")[0] || "—"}</td>
                <td className="px-3 py-3 text-black/45">{fmtDate(l.createdAt, { day: "numeric", month: "short" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadBoard({ leads, onOpen, onMove }: { leads: Lead[]; onOpen: (id: string) => void; onMove: (id: string, s: LeadStatus) => void }) {
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  return (
    <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
      {LEAD_STATUSES.map((s) => {
        const col = leads.filter((l) => l.status === s.id);
        return (
          <div
            key={s.id}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(s.id);
            }}
            onDragLeave={() => setOver(null)}
            onDrop={() => {
              if (drag) {
                const l = leads.find((x) => x.id === drag);
                if (l && l.status !== s.id) onMove(drag, s.id);
              }
              setDrag(null);
              setOver(null);
            }}
            className={cn("flex w-[280px] shrink-0 snap-start flex-col rounded-2xl bg-black/[0.035] p-2 transition", over === s.id && "bg-accent/10 ring-2 ring-accent/40")}
          >
            <div className="flex items-center justify-between px-2 py-2">
              <span className="flex items-center gap-2 text-[13px] font-semibold">
                <span className="size-2 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="rounded-md bg-white px-1.5 text-[11px] font-semibold text-black/50">{col.length}</span>
            </div>
            <div className="flex max-h-[65vh] flex-col gap-2 overflow-y-auto">
              {col.map((l) => (
                <motion.div
                  layout
                  layoutId={l.id}
                  key={l.id}
                  draggable
                  onDragStart={() => setDrag(l.id)}
                  onClick={() => onOpen(l.id)}
                  className={cn("cursor-grab rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04] transition hover:shadow-md active:cursor-grabbing", drag === l.id && "opacity-40")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13.5px] font-semibold leading-tight">{l.name}</p>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-black/[0.05] text-[9px] font-bold">{initials(l.assignedTo || "?")}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-black/50">{l.course || "—"}</p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-black/40">
                    <span className="rounded-md bg-black/[0.04] px-1.5 py-0.5">{l.source}</span>
                    {l.value > 0 ? <span className="font-semibold text-emerald-600">{inr(l.value)}</span> : <span>{fmtDate(l.createdAt, { day: "numeric", month: "short" })}</span>}
                  </div>
                </motion.div>
              ))}
              {!col.length && <p className="py-8 text-center text-[12px] text-black/30">Drop leads here</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LeadDrawer({ lead, courses, onClose, onPatch, onDelete }: { lead: Lead | null; courses: string[]; onClose: () => void; onPatch: (id: string, b: Partial<Lead> & { addNote?: string; removeNote?: string }, msg?: string) => void; onDelete: (id: string) => void }) {
  const [form, setForm] = useState<Lead | null>(lead);
  const [note, setNote] = useState("");
  useEffect(() => setForm(lead), [lead]);
  if (!form && !lead) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;
  const f = form || lead!;
  const set = (k: keyof Lead, v: unknown) => setForm((x) => (x ? { ...x, [k]: v } : x));
  const dirty = lead && form && (["name", "phone", "email", "course", "classLevel", "source", "followUp", "assignedTo", "value", "message"] as const).some((k) => lead[k] !== form[k]);
  const phone = f.phone.replace(/[^\d+]/g, "");

  return (
    <Drawer
      open={!!lead}
      onClose={onClose}
      title="Lead details"
      footer={
        <>
          <Button variant="danger" onClick={() => onDelete(f.id)} className="mr-auto">
            <Trash2 className="size-4" />
          </Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button
            disabled={!dirty}
            onClick={() =>
              form &&
              onPatch(form.id, { name: form.name, phone: form.phone, email: form.email, course: form.course, classLevel: form.classLevel, source: form.source, followUp: form.followUp, assignedTo: form.assignedTo, value: form.value, message: form.message }, "Lead saved")
            }
          >
            Save changes
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-ink text-lg font-semibold text-white">{initials(f.name)}</span>
        <div className="min-w-0">
          <p className="truncate text-xl font-semibold tracking-tight">{f.name}</p>
          <p className="text-[13px] text-black/45">
            {f.source} · {fmtDate(f.createdAt, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <a href={`tel:${phone}`} className="flex flex-col items-center gap-1 rounded-xl bg-white py-3 text-[12px] font-medium ring-1 ring-black/[0.06] hover:bg-ink hover:text-white">
          <Phone className="size-4" /> Call
        </a>
        <a href={`https://wa.me/${phone.replace("+", "")}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 rounded-xl bg-white py-3 text-[12px] font-medium ring-1 ring-black/[0.06] hover:bg-[#25D366] hover:text-white">
          <MessageCircle className="size-4" /> WhatsApp
        </a>
        <a href={f.email ? `mailto:${f.email}` : undefined} className={cn("flex flex-col items-center gap-1 rounded-xl bg-white py-3 text-[12px] font-medium ring-1 ring-black/[0.06]", f.email ? "hover:bg-ink hover:text-white" : "opacity-40")}>
          <Mail className="size-4" /> Email
        </a>
      </div>

      <p className="mb-2 mt-6 text-[12px] font-medium text-black/55">Pipeline stage</p>
      <div className="grid grid-cols-5 gap-1 rounded-xl bg-black/[0.04] p-1">
        {LEAD_STATUSES.map((s) => (
          <button key={s.id} onClick={() => onPatch(f.id, { status: s.id }, `Moved to ${s.label}`)} className={cn("relative rounded-lg px-1 py-2 text-[11px] font-semibold transition", lead?.status === s.id ? "text-white" : "text-black/50 hover:text-ink")}>
            {lead?.status === s.id && <motion.span layoutId="stage" className="absolute inset-0 rounded-lg" style={{ background: s.color }} />}
            <span className="relative">{s.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Lbl label="Name"><input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} /></Lbl>
        <Lbl label="Phone"><input className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Lbl>
        <Lbl label="Email" full><input className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} /></Lbl>
        <Lbl label="Program">
          <select className={inputCls} value={f.course} onChange={(e) => set("course", e.target.value)}>
            <option value="">—</option>
            {Array.from(new Set([...courses, f.course].filter(Boolean))).map((c) => <option key={c}>{c}</option>)}
          </select>
        </Lbl>
        <Lbl label="Class"><input className={inputCls} value={f.classLevel} onChange={(e) => set("classLevel", e.target.value)} /></Lbl>
        <Lbl label="Follow-up date"><input type="date" className={inputCls} value={f.followUp} onChange={(e) => set("followUp", e.target.value)} /></Lbl>
        <Lbl label="Assigned to">
          <select className={inputCls} value={f.assignedTo} onChange={(e) => set("assignedTo", e.target.value)}>
            <option value="">Unassigned</option>
            {Array.from(new Set([...COUNSELLORS, f.assignedTo].filter(Boolean))).map((c) => <option key={c}>{c}</option>)}
          </select>
        </Lbl>
        <Lbl label="Source">
          <select className={inputCls} value={f.source} onChange={(e) => set("source", e.target.value)}>
            {Array.from(new Set([...LEAD_SOURCES, f.source])).map((c) => <option key={c}>{c}</option>)}
          </select>
        </Lbl>
        <Lbl label="Deal value (₹)"><input type="number" className={inputCls} value={f.value} onChange={(e) => set("value", Number(e.target.value))} /></Lbl>
        <Lbl label="Message from lead" full><textarea rows={2} className={inputCls} value={f.message} onChange={(e) => set("message", e.target.value)} /></Lbl>
      </div>

      <p className="mb-2 mt-7 text-[12px] font-medium text-black/55">Activity & notes</p>
      <div className="flex gap-2">
        <input
          className={inputCls}
          placeholder="e.g. Called parent, demo fixed for Saturday"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && note.trim()) {
              onPatch(f.id, { addNote: note }, "Note added");
              setNote("");
            }
          }}
        />
        <Button
          onClick={() => {
            if (!note.trim()) return;
            onPatch(f.id, { addNote: note }, "Note added");
            setNote("");
          }}
        >
          Add
        </Button>
      </div>
      <ol className="relative mt-4 space-y-4 border-l border-black/10 pl-5">
        {(lead?.notes || []).map((n) => (
          <li key={n.id} className="group relative">
            <span className="absolute -left-[25px] top-1.5 size-2.5 rounded-full border-2 border-white bg-accent" />
            <p className="text-[13.5px]">{n.text}</p>
            <p className="text-[11px] text-black/40">
              {fmtDate(n.at, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
              <button onClick={() => onPatch(f.id, { removeNote: n.id })} className="ml-2 text-red-500 opacity-0 group-hover:opacity-100">remove</button>
            </p>
          </li>
        ))}
        <li className="relative">
          <span className="absolute -left-[25px] top-1.5 size-2.5 rounded-full border-2 border-white bg-black/20" />
          <p className="text-[13px] text-black/50">Lead created via {f.source}</p>
          <p className="text-[11px] text-black/40">{fmtDate(f.createdAt, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</p>
        </li>
      </ol>
    </Drawer>
  );
}

function Lbl({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={cn("block", full && "col-span-2")}>
      <span className="mb-1.5 block text-[12px] font-medium text-black/55">{label}</span>
      {children}
    </label>
  );
}

function NewLeadDrawer({ open, courses, onClose, onCreated }: { open: boolean; courses: string[]; onClose: () => void; onCreated: (l: Lead) => void }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", course: courses[0] || "", classLevel: "", source: "Walk-in", followUp: "", assignedTo: "", message: "" });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }));
  async function save() {
    if (!f.name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    setSaving(false);
    if (res.ok) {
      onCreated(await res.json());
      setF((x) => ({ ...x, name: "", phone: "", email: "", message: "" }));
    }
  }
  return (
    <Drawer open={open} onClose={onClose} title="Add a lead" footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button loading={saving} onClick={save}>Create lead</Button></>}>
      <div className="grid grid-cols-2 gap-3">
        <Lbl label="Student name" full><input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} autoFocus /></Lbl>
        <Lbl label="Phone"><input className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Lbl>
        <Lbl label="Email"><input className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} /></Lbl>
        <Lbl label="Program">
          <select className={inputCls} value={f.course} onChange={(e) => set("course", e.target.value)}>
            {courses.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Lbl>
        <Lbl label="Class"><input className={inputCls} value={f.classLevel} onChange={(e) => set("classLevel", e.target.value)} /></Lbl>
        <Lbl label="Source">
          <select className={inputCls} value={f.source} onChange={(e) => set("source", e.target.value)}>
            {LEAD_SOURCES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Lbl>
        <Lbl label="Follow-up"><input type="date" className={inputCls} value={f.followUp} onChange={(e) => set("followUp", e.target.value)} /></Lbl>
        <Lbl label="Assign to" full>
          <select className={inputCls} value={f.assignedTo} onChange={(e) => set("assignedTo", e.target.value)}>
            <option value="">Unassigned</option>
            {COUNSELLORS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Lbl>
        <Lbl label="Notes" full><textarea rows={3} className={inputCls} value={f.message} onChange={(e) => set("message", e.target.value)} /></Lbl>
      </div>
    </Drawer>
  );
}
