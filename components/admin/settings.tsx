"use client";

import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, GripVertical, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { Settings } from "@/lib/types";
import type { Field } from "@/lib/collections";
import { cn } from "@/lib/utils";
import { Button, Card, FieldInput, ImageInput, ListInput, PageTitle, Toggle, inputCls, useToast } from "./ui";

const TABS = [
  { id: "brand", label: "Brand & contact" },
  { id: "theme", label: "Theme" },
  { id: "intro", label: "Intro animation" },
  { id: "hero", label: "Hero" },
  { id: "nav", label: "Navbar" },
  { id: "sections", label: "Homepage sections" },
  { id: "stats", label: "Stats" },
  { id: "promo", label: "Promotions" },
  { id: "seo", label: "Manifesto & SEO" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const PRESETS = [
  { name: "Cobalt & Lime", accent: "#2F3CFF", accent2: "#D4FF3A", ink: "#0B0B10", paper: "#F2F2EE" },
  { name: "Forest & Mint", accent: "#0F5132", accent2: "#B8F5D0", ink: "#0A120E", paper: "#F1F3EF" },
  { name: "Plum & Peach", accent: "#5B2A86", accent2: "#FFC9A8", ink: "#120B16", paper: "#F5F2F4" },
  { name: "Ink & Coral", accent: "#111827", accent2: "#FF7A59", ink: "#0B0B0F", paper: "#F3F2EF" },
  { name: "Teal & Sun", accent: "#006D77", accent2: "#FFD23F", ink: "#081315", paper: "#F1F4F3" },
];

const ids = new WeakMap<object, string>();
const keyOf = (o: object) => {
  if (!ids.has(o)) ids.set(o, Math.random().toString(36).slice(2));
  return ids.get(o)!;
};

export function SettingsEditor({ initial }: { initial: Settings }) {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [s, setS] = useState<Settings>(() => structuredClone(initial));
  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) || "brand");
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(s) !== JSON.stringify(initial);

  useEffect(() => {
    const t = params.get("tab") as Tab | null;
    if (t) setTab(t);
  }, [params]);

  function up<K extends keyof Settings>(k: K, patch: Partial<Settings[K]>) {
    setS((x) => ({ ...x, [k]: { ...(x[k] as object), ...patch } as Settings[K] }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
    setSaving(false);
    if (!res.ok) return toast("Save failed", "err");
    toast("Settings saved — live on website");
    router.refresh();
  }

  async function reset() {
    if (!confirm("Reset ALL website content, settings and leads to the demo data? This cannot be undone.")) return;
    await fetch("/api/admin/reset", { method: "POST" });
    toast("Demo data restored");
    window.location.reload();
  }

  const F = <K extends keyof Settings>(k: K, field: Field) => (
    <FieldInput field={field} value={(s[k] as Record<string, unknown>)[field.key]} onChange={(v) => up(k, { [field.key]: v } as Partial<Settings[K]>)} />
  );

  return (
    <div className="pb-24">
      <PageTitle title="Site settings" subtitle="Control every part of the website — changes go live the moment you save.">
        <a href="/" target="_blank" className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-[14px] font-semibold">
          <ExternalLink className="size-4" /> Preview site
        </a>
      </PageTitle>

      <div className="no-scrollbar -mx-4 mb-5 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("relative shrink-0 rounded-xl px-3.5 py-2 text-[13px] font-medium transition", tab === t.id ? "text-white" : "text-black/55 hover:text-ink")}>
            {tab === t.id && <motion.span layoutId="settings-tab" className="absolute inset-0 rounded-xl bg-ink" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {tab === "brand" && (
            <Card className="grid gap-4 md:grid-cols-2">
              {F("brand", { key: "name", label: "Institute name", type: "text" })}
              {F("brand", { key: "shortName", label: "Short name (navbar & footer)", type: "text" })}
              <div className="md:col-span-2">{F("brand", { key: "tagline", label: "Tagline", type: "text" })}</div>
              {F("brand", { key: "phone", label: "Phone", type: "text" })}
              {F("brand", { key: "whatsapp", label: "WhatsApp number (with country code, digits only)", type: "text" })}
              {F("brand", { key: "email", label: "Email", type: "text" })}
              {F("brand", { key: "hours", label: "Office hours", type: "text" })}
              <div className="md:col-span-2">{F("brand", { key: "address", label: "Address", type: "textarea", rows: 2 })}</div>
              <div className="md:col-span-2">{F("brand", { key: "mapEmbed", label: "Google Maps embed URL", type: "text" })}</div>
              {F("brand", { key: "instagram", label: "Instagram URL", type: "text" })}
              {F("brand", { key: "youtube", label: "YouTube URL", type: "text" })}
              {F("brand", { key: "facebook", label: "Facebook URL", type: "text" })}
              {F("brand", { key: "linkedin", label: "LinkedIn URL", type: "text" })}
            </Card>
          )}

          {tab === "theme" && (
            <div className="space-y-3">
              <Card>
                <p className="mb-3 font-semibold">Presets</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {PRESETS.map((p) => (
                    <button key={p.name} onClick={() => up("theme", { accent: p.accent, accent2: p.accent2, ink: p.ink, paper: p.paper })} className={cn("rounded-xl p-3 text-left ring-1 transition hover:ring-black/30", s.theme.accent === p.accent ? "ring-2 ring-ink" : "ring-black/10")} style={{ background: p.paper }}>
                      <div className="flex gap-1">
                        {[p.accent, p.accent2, p.ink].map((c) => <span key={c} className="size-5 rounded-full" style={{ background: c }} />)}
                      </div>
                      <p className="mt-2 text-[13px] font-semibold" style={{ color: p.ink }}>{p.name}</p>
                    </button>
                  ))}
                </div>
              </Card>
              <Card className="grid gap-4 md:grid-cols-2">
                {F("theme", { key: "accent", label: "Primary accent", type: "color" })}
                {F("theme", { key: "accent2", label: "Highlight (buttons & accents on dark/brand panels)", type: "color" })}
                {F("theme", { key: "ink", label: "Ink (text & dark sections)", type: "color" })}
                {F("theme", { key: "paper", label: "Paper (background)", type: "color" })}
              </Card>
              <Card>
                <p className="mb-3 text-[12px] font-medium text-black/55">Live preview</p>
                <div className="rounded-2xl p-6" style={{ background: s.theme.paper, color: s.theme.ink }}>
                  <p className="text-4xl font-semibold tracking-[-0.04em]">
                    Learn with <span className="serif" style={{ color: s.theme.accent }}>clarity.</span>
                  </p>
                  <p className="mt-4 rounded-xl p-4 text-2xl font-semibold tracking-[-0.03em] text-white" style={{ background: s.theme.accent }}>
                    Brand panel with <span style={{ color: s.theme.accent2 }}>highlight</span>
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: s.theme.ink }}>Primary</span>
                    <span className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: s.theme.accent }}>Accent</span>
                    <span className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: s.theme.accent2, color: s.theme.ink }}>Highlight</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {tab === "intro" && (
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
              <Card className="space-y-4">
                <Toggle checked={s.intro.enabled} onChange={(v) => up("intro", { enabled: v })} label="Show intro animation" />
                <Toggle checked={s.intro.oncePerSession} onChange={(v) => up("intro", { oncePerSession: v })} label="Only once per visit (recommended)" />
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium text-black/55">Duration: {s.intro.duration.toFixed(1)}s</span>
                  <input type="range" min={1.2} max={6} step={0.1} value={s.intro.duration} onChange={(e) => up("intro", { duration: Number(e.target.value) })} className="w-full accent-[var(--accent)]" />
                </label>
                {F("intro", { key: "background", label: "Background colour", type: "color" })}
                <div>
                  <span className="mb-1.5 block text-[12px] font-medium text-black/55">Words (the last one is highlighted)</span>
                  <ListInput value={s.intro.words} onChange={(v) => up("intro", { words: v })} placeholder="Add a word…" />
                </div>
              </Card>
              <Card>
                <p className="mb-3 text-[12px] font-medium text-black/55">Preview</p>
                <IntroPreview intro={s.intro} />
                <p className="mt-3 text-[12px] text-black/45">Save, then open the site in a new tab to see the full-screen version.</p>
              </Card>
            </div>
          )}

          {tab === "hero" && (
            <Card className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">{F("hero", { key: "eyebrow", label: "Eyebrow (small text above headline)", type: "text" })}</div>
              {F("hero", { key: "titleLine1", label: "Headline — start", type: "text" })}
              {F("hero", { key: "titleAccent", label: "Headline — highlighted (italic) word", type: "text" })}
              <div className="md:col-span-2">{F("hero", { key: "titleLine2", label: "Headline — end", type: "text" })}</div>
              <div className="md:col-span-2">{F("hero", { key: "subtitle", label: "Subtitle", type: "textarea", rows: 3 })}</div>
              {F("hero", { key: "primaryCta", label: "Primary button", type: "text" })}
              {F("hero", { key: "primaryHref", label: "Primary button link", type: "text" })}
              {F("hero", { key: "secondaryCta", label: "Secondary button", type: "text" })}
              {F("hero", { key: "secondaryHref", label: "Secondary button link", type: "text" })}
              {[0].map((i) => (
                <div key={i} className={i === 0 ? "md:col-span-2" : ""}>
                  <span className="mb-1.5 block text-[12px] font-medium text-black/55">Background photo (shown as a duotone behind the hero)</span>
                  <ImageInput value={s.hero.images[i] || ""} onChange={(v) => up("hero", { images: Object.assign([...s.hero.images], { [i]: v }) })} />
                </div>
              ))}
            </Card>
          )}

          {tab === "nav" && (
            <div className="space-y-3">
              <Card className="grid gap-4 md:grid-cols-3">
                {F("nav", { key: "ctaLabel", label: "CTA button label", type: "text" })}
                {F("nav", { key: "ctaHref", label: "CTA button link", type: "text" })}
                {F("nav", { key: "islandStatus", label: "Island status text (when scrolled)", type: "text" })}
              </Card>
              <Card>
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold">Menu links</p>
                  <Button variant="ghost" onClick={() => up("nav", { links: [...s.nav.links, { label: "New link", href: "/" }] })}>
                    <Plus className="size-4" /> Add link
                  </Button>
                </div>
                <Reorder.Group axis="y" values={s.nav.links} onReorder={(links) => up("nav", { links })} className="space-y-2">
                  {s.nav.links.map((l, i) => (
                    <Reorder.Item key={keyOf(l)} value={l} className="flex items-center gap-2 rounded-xl border border-black/10 bg-white p-2">
                      <GripVertical className="size-4 shrink-0 cursor-grab text-black/25" />
                      <input className={inputCls} value={l.label} onChange={(e) => { l.label = e.target.value; up("nav", { links: [...s.nav.links] }); }} />
                      <input className={inputCls} value={l.href} onChange={(e) => { l.href = e.target.value; up("nav", { links: [...s.nav.links] }); }} />
                      <button onClick={() => up("nav", { links: s.nav.links.filter((_, k) => k !== i) })} className="grid size-9 shrink-0 place-items-center rounded-lg text-black/40 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="size-4" />
                      </button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
                <p className="mt-3 text-[12px] text-black/45">The first 6 links appear in the full desktop bar; all links appear in the expanded island menu.</p>
              </Card>
            </div>
          )}

          {tab === "sections" && (
            <Card>
              <p className="font-semibold">Homepage sections</p>
              <p className="mb-4 text-[13px] text-black/45">Drag to reorder, toggle to show or hide.</p>
              <Reorder.Group axis="y" values={s.sections} onReorder={(sections) => setS((x) => ({ ...x, sections }))} className="space-y-2">
                {s.sections.map((sec, i) => (
                  <Reorder.Item key={sec.id} value={sec} className={cn("flex items-center gap-3 rounded-xl border border-black/10 bg-white px-3 py-2.5", !sec.enabled && "opacity-55")}>
                    <GripVertical className="size-4 shrink-0 cursor-grab text-black/25" />
                    <span className="w-6 text-[12px] font-semibold text-black/35">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[14px] font-medium">{sec.label}</span>
                    <Toggle checked={sec.enabled} onChange={(v) => setS((x) => ({ ...x, sections: x.sections.map((y) => (y.id === sec.id ? { ...y, enabled: v } : y)) }))} />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </Card>
          )}

          {tab === "stats" && (
            <Card>
              <p className="mb-4 font-semibold">Animated counters</p>
              <div className="space-y-2">
                {s.stats.map((st, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px] gap-2 rounded-xl bg-black/[0.02] p-2 sm:grid-cols-[140px_80px_1fr_auto]">
                    <input type="number" className={inputCls} value={st.value} onChange={(e) => setS((x) => ({ ...x, stats: x.stats.map((y, k) => (k === i ? { ...y, value: Number(e.target.value) } : y)) }))} />
                    <input className={inputCls} placeholder="+ / %" value={st.suffix} onChange={(e) => setS((x) => ({ ...x, stats: x.stats.map((y, k) => (k === i ? { ...y, suffix: e.target.value } : y)) }))} />
                    <input className={cn(inputCls, "col-span-2 sm:col-span-1")} value={st.label} onChange={(e) => setS((x) => ({ ...x, stats: x.stats.map((y, k) => (k === i ? { ...y, label: e.target.value } : y)) }))} />
                    <span className="hidden self-center px-2 text-[11px] text-black/35 sm:block">#{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12px] text-black/45">#1 accent tile · #2 big image tile · #3 selections tile (also shown on hero) · #4 satisfaction bar.</p>
            </Card>
          )}

          {tab === "promo" && (
            <div className="grid gap-3 lg:grid-cols-2">
              <Card className="space-y-4">
                <p className="font-semibold">Announcement pill (hero)</p>
                <Toggle checked={s.announcement.enabled} onChange={(v) => up("announcement", { enabled: v })} label="Show announcement" />
                {F("announcement", { key: "text", label: "Text", type: "text" })}
                {F("announcement", { key: "href", label: "Link", type: "text" })}
              </Card>
              <Card className="space-y-4">
                <p className="font-semibold">Admission popup</p>
                <Toggle checked={s.popup.enabled} onChange={(v) => up("popup", { enabled: v })} label="Show popup to visitors" />
                {F("popup", { key: "title", label: "Title", type: "text" })}
                {F("popup", { key: "text", label: "Text", type: "textarea", rows: 2 })}
                {F("popup", { key: "delay", label: "Show after (seconds)", type: "number" })}
                {F("popup", { key: "image", label: "Image", type: "image" })}
              </Card>
              <Card className="space-y-4 lg:col-span-2">
                <p className="font-semibold">Scholarship test (countdown section)</p>
                <div className="grid gap-4 md:grid-cols-2">
                  {F("scholarship", { key: "title", label: "Title", type: "text" })}
                  {F("scholarship", { key: "date", label: "Test date & time", type: "datetime" })}
                  {F("scholarship", { key: "maxScholarship", label: "Max scholarship", type: "text" })}
                  {F("scholarship", { key: "subtitle", label: "Subtitle", type: "text" })}
                </div>
              </Card>
            </div>
          )}

          {tab === "seo" && (
            <div className="space-y-3">
              <Card className="space-y-4">
                <p className="font-semibold">Manifesto (scroll-reveal paragraph)</p>
                {F("manifesto", { key: "label", label: "Label", type: "text" })}
                {F("manifesto", { key: "text", label: "Text", type: "textarea", rows: 4 })}
              </Card>
              <Card className="space-y-4">
                <p className="font-semibold">Search engine (SEO)</p>
                {F("seo", { key: "title", label: "Meta title", type: "text" })}
                {F("seo", { key: "description", label: "Meta description", type: "textarea", rows: 3 })}
              </Card>
              <Card className="flex flex-col items-start justify-between gap-3 border-red-100 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold text-red-600">Danger zone</p>
                  <p className="text-[13px] text-black/50">Restore all content, settings and leads to the original demo data.</p>
                </div>
                <Button variant="danger" onClick={reset}>
                  <RotateCcw className="size-4" /> Reset demo data
                </Button>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {dirty && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 32 }} className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-ink py-2 pl-5 pr-2 text-white shadow-2xl lg:ml-[124px]">
            <span className="text-[13.5px]">Unsaved changes</span>
            <button onClick={() => setS(structuredClone(initial))} className="rounded-xl px-3 py-2 text-[13px] text-white/70 hover:bg-white/10">Discard</button>
            <Button variant="accent" loading={saving} onClick={save}>Save & publish</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IntroPreview({ intro }: { intro: Settings["intro"] }) {
  const words = intro.words.length ? intro.words : ["…"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % (words.length + 1)), (intro.duration * 1000) / words.length);
    return () => clearInterval(id);
  }, [words.length, intro.duration]);
  const w = i < words.length ? words[i] : null;
  return (
    <div className="relative grid aspect-video place-items-center overflow-hidden rounded-xl text-white" style={{ background: intro.background }}>
      <AnimatePresence mode="popLayout">
        {w ? (
          <motion.span key={i} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ duration: 0.5 }} className={cn("text-4xl font-semibold tracking-[-0.04em]", i === words.length - 1 && "serif font-normal text-accent")}>
            {w}
          </motion.span>
        ) : (
          <motion.div key="curtain" initial={{ y: 0 }} animate={{ y: "-100%" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-0 bg-accent" />
        )}
      </AnimatePresence>
      {!intro.enabled && <span className="absolute bottom-3 rounded-full bg-white/15 px-3 py-1 text-[11px]">Intro is disabled</span>}
    </div>
  );
}
