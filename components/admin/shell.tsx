"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { COLLECTIONS } from "@/lib/collections";
import { cn } from "@/lib/utils";
import { ToastProvider } from "./ui";

type IconName = keyof typeof Icons;
type Item = { href: string; label: string; icon: IconName; badge?: number };

const EASE = [0.22, 1, 0.36, 1] as const;

function Icon({ name, className }: { name: IconName; className?: string }) {
  const I = Icons[name] as Icons.LucideIcon;
  return I ? <I className={className} /> : null;
}

export function AdminShell({ children, brand, newLeads, email }: { children: React.ReactNode; brand: string; newLeads: number; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("admin-collapsed") === "1");
    } catch {}
  }, []);
  useEffect(() => setMobile(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      try {
        localStorage.setItem("admin-collapsed", v ? "0" : "1");
      } catch {}
      return !v;
    });
  };

  const groups: { title: string; items: Item[] }[] = [
    {
      title: "Overview",
      items: [
        { href: "/admin", label: "Dashboard", icon: "LayoutGrid" },
        { href: "/admin/leads", label: "Leads & CRM", icon: "Inbox", badge: newLeads },
      ],
    },
    {
      title: "Content",
      items: Object.entries(COLLECTIONS).map(([k, c]) => ({ href: `/admin/content/${k}`, label: c.label, icon: c.icon as IconName })),
    },
    {
      title: "Configure",
      items: [
        { href: "/admin/settings", label: "Site settings", icon: "Settings2" },
        { href: "/admin/settings?tab=intro", label: "Intro animation", icon: "Sparkles" },
        { href: "/admin/settings?tab=sections", label: "Homepage sections", icon: "Rows3" },
      ],
    },
  ];
  const flat = groups.flatMap((g) => g.items);

  const isActive = (href: string) => {
    const [p, q] = href.split("?");
    if (q) return false;
    return p === "/admin" ? pathname === "/admin" : pathname.startsWith(p);
  };
  const current = flat.find((i) => isActive(i.href));

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = (compact: boolean) => (
    <div className="flex h-full flex-col text-white">
      <div className={cn("flex items-center gap-3 pb-5 pt-5", compact ? "justify-center px-3" : "px-5")}>
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-accent2 text-ink">
          <span className="text-[17px] font-bold leading-none">{brand.charAt(0)}</span>
          <span className="absolute bottom-[7px] right-[7px] size-1.5 rounded-full bg-ink" />
        </span>
        {!compact && (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[14.5px] font-semibold tracking-[-0.01em]">{brand}</p>
            <p className="text-[11.5px] text-white/50">Control room</p>
          </div>
        )}
      </div>

      <div className={cn("pb-4", compact ? "px-3" : "px-4")}>
        <button
          onClick={() => setPalette(true)}
          className={cn("flex h-10 w-full items-center gap-2.5 rounded-xl bg-white/[0.08] text-[13px] text-white/60 ring-1 ring-white/[0.08] transition hover:bg-white/[0.12] hover:text-white", compact ? "justify-center" : "px-3")}
          title="Search (⌘K)"
        >
          <Icons.Search className="size-4" />
          {!compact && (
            <>
              <span className="flex-1 text-left">Search or jump…</span>
              <kbd className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10.5px] font-semibold text-white/70">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      <nav className={cn("no-scrollbar flex-1 space-y-6 overflow-y-auto pb-4", compact ? "px-3" : "px-3")}>
        {groups.map((g) => (
          <div key={g.title}>
            {!compact && <p className="mb-2 px-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/35">{g.title}</p>}
            {compact && <div className="mx-auto mb-2 h-px w-6 bg-white/15" />}
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = isActive(it.href);
                return (
                  <li key={it.href} className="relative">
                    {active && (
                      <motion.span layoutId={compact ? "nav-c" : "nav-x"} className="absolute inset-0 rounded-xl bg-white/[0.1]" transition={{ type: "spring", stiffness: 500, damping: 40 }}>
                        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent2" />
                      </motion.span>
                    )}
                    <Link
                      href={it.href}
                      title={compact ? it.label : undefined}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl py-2.5 text-[13.5px] font-medium transition-colors",
                        compact ? "justify-center px-0" : "px-3",
                        active ? "text-white" : "text-white/55 hover:text-white",
                      )}
                    >
                      <Icon name={it.icon} className={cn("size-[18px] shrink-0", active && "text-accent2")} />
                      {!compact && <span className="flex-1 truncate">{it.label}</span>}
                      {!!it.badge && (
                        <span className={cn("rounded-full bg-accent2 font-bold leading-none text-ink", compact ? "absolute right-1 top-1 px-1 py-0.5 text-[9px]" : "px-1.5 py-1 text-[10.5px]")}>{it.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={cn("border-t border-white/10 p-3", compact && "flex flex-col items-center gap-1")}>
        {!compact ? (
          <div className="flex items-center gap-3 rounded-xl p-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-[12px] font-bold uppercase">{email.slice(0, 2) || "AD"}</span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-[13px] font-semibold">Administrator</p>
              <p className="truncate text-[11.5px] text-white/45">{email}</p>
            </div>
            <button onClick={logout} title="Sign out" className="grid size-8 place-items-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white">
              <Icons.LogOut className="size-4" />
            </button>
          </div>
        ) : (
          <button onClick={logout} title="Sign out" className="grid size-10 place-items-center rounded-xl text-white/55 hover:bg-white/10 hover:text-white">
            <Icons.LogOut className="size-[18px]" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-dvh bg-paper text-ink">
        {/* desktop sidebar */}
        <motion.aside
          animate={{ width: collapsed ? 84 : 264 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed inset-y-0 left-0 z-30 hidden overflow-hidden bg-accent lg:block"
        >
          {sidebar(collapsed)}
        </motion.aside>

        {/* mobile drawer */}
        <AnimatePresence>
          {mobile && (
            <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobile(false)} />
              <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 400, damping: 40 }} className="absolute inset-y-0 left-0 w-[280px] bg-accent shadow-2xl">
                {sidebar(false)}
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn("transition-[padding] duration-[450ms] ease-[var(--ease-apple)]", collapsed ? "lg:pl-[84px]" : "lg:pl-[264px]")}>
          {/* top bar */}
          <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-4 md:px-8">
              <button onClick={() => setMobile(true)} className="grid size-10 place-items-center rounded-xl bg-white ring-1 ring-line lg:hidden" aria-label="Menu">
                <Icons.Menu className="size-4" />
              </button>
              <button onClick={toggleCollapsed} className="hidden size-10 place-items-center rounded-xl text-ink/60 transition hover:bg-white hover:text-ink lg:grid" aria-label="Toggle sidebar" title="Toggle sidebar">
                <Icons.PanelLeft className="size-[18px]" />
              </button>
              <div className="flex min-w-0 items-center gap-2 text-[14px]">
                <span className="hidden text-ink/45 sm:inline">{brand}</span>
                <Icons.ChevronRight className="hidden size-3.5 text-ink/30 sm:block" />
                <span className="truncate font-semibold">{current?.label ?? "Admin"}</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => setPalette(true)} className="hidden h-10 w-64 items-center gap-2.5 rounded-xl bg-white px-3 text-[13px] text-ink/45 ring-1 ring-line transition hover:ring-ink/20 md:flex">
                  <Icons.Search className="size-4" />
                  <span className="flex-1 text-left">Search leads, pages…</span>
                  <kbd className="rounded-md bg-paper px-1.5 py-0.5 text-[10.5px] font-semibold text-ink/55">⌘K</kbd>
                </button>
                <button onClick={() => setPalette(true)} className="grid size-10 place-items-center rounded-xl bg-white ring-1 ring-line md:hidden" aria-label="Search">
                  <Icons.Search className="size-4" />
                </button>
                <Link href="/admin/leads?new=1" className="hidden h-10 items-center gap-2 rounded-xl bg-accent px-4 text-[13.5px] font-semibold text-white transition hover:bg-ink sm:flex">
                  <Icons.Plus className="size-4" /> New lead
                </Link>
                <a href="/" target="_blank" title="View website" className="grid size-10 place-items-center rounded-xl bg-white text-ink/70 ring-1 ring-line transition hover:text-ink">
                  <Icons.ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          </header>

          <main>
            <motion.div key={pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="mx-auto max-w-[1320px] px-4 py-6 md:px-8 md:py-8">
              {children}
            </motion.div>
          </main>
        </div>

        <AnimatePresence>{palette && <CommandPalette items={flat} onClose={() => setPalette(false)} />}</AnimatePresence>
      </div>
    </ToastProvider>
  );
}

/* ───────── ⌘K command palette ───────── */

type Lite = { id: string; name: string; phone: string; course: string; status: string };
type Row = { key: string; label: string; hint: string; icon: IconName; href: string; group: string };

function CommandPalette({ items, onClose }: { items: Item[]; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [leads, setLeads] = useState<Lite[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [sel, setSel] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Lite[]) => setLeads(d))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const rows = useMemo<Row[]>(() => {
    const s = q.trim().toLowerCase();
    const actions: Row[] = [
      { key: "a-lead", label: "Add a new lead", hint: "CRM", icon: "UserPlus", href: "/admin/leads?new=1", group: "Actions" },
      { key: "a-course", label: "Create a course", hint: "Content", icon: "GraduationCap", href: "/admin/content/courses", group: "Actions" },
      { key: "a-notice", label: "Post a notice", hint: "Content", icon: "Megaphone", href: "/admin/content/notices", group: "Actions" },
      { key: "a-theme", label: "Change theme colours", hint: "Settings", icon: "Palette", href: "/admin/settings?tab=theme", group: "Actions" },
      { key: "a-hero", label: "Edit hero section", hint: "Settings", icon: "PanelTop", href: "/admin/settings?tab=hero", group: "Actions" },
    ];
    const pages: Row[] = items.map((i) => ({ key: i.href, label: i.label, hint: "Page", icon: i.icon, href: i.href, group: "Go to" }));
    const leadRows: Row[] = s
      ? leads
          .filter((l) => [l.name, l.phone, l.course].some((x) => x?.toLowerCase().includes(s)))
          .slice(0, 6)
          .map((l) => ({ key: l.id, label: l.name, hint: `${l.course || "—"} · ${l.status}`, icon: "User", href: `/admin/leads?lead=${l.id}`, group: "Leads" }))
      : [];
    const match = (r: Row) => !s || r.label.toLowerCase().includes(s) || r.hint.toLowerCase().includes(s);
    return [...leadRows, ...actions.filter(match), ...pages.filter(match)];
  }, [q, leads, items]);

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-i="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const go = (r?: Row) => {
    if (!r) return;
    onClose();
    router.push(r.href);
  };

  let lastGroup = "";
  return (
    <motion.div className="fixed inset-0 z-[90] flex items-start justify-center px-3 pt-[12vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[3px]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="relative w-full max-w-xl overflow-hidden rounded-[22px] bg-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.5)] ring-1 ring-black/5"
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Icons.Search className="size-5 text-ink/40" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((v) => Math.min(rows.length - 1, v + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((v) => Math.max(0, v - 1));
              } else if (e.key === "Enter") go(rows[sel]);
              else if (e.key === "Escape") onClose();
            }}
            placeholder="Search leads by name or phone, or jump to a page…"
            className="h-16 flex-1 bg-transparent text-[16px] outline-none placeholder:text-ink/35"
          />
          <kbd className="rounded-md bg-paper px-2 py-1 text-[11px] font-semibold text-ink/50">ESC</kbd>
        </div>
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
          {rows.map((r, i) => {
            const header = r.group !== lastGroup ? r.group : null;
            lastGroup = r.group;
            return (
              <div key={r.key}>
                {header && <p className="px-3 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/35">{header}</p>}
                <button
                  data-i={i}
                  onMouseMove={() => setSel(i)}
                  onClick={() => go(r)}
                  className={cn("relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors", sel === i ? "bg-accent text-white" : "text-ink")}
                >
                  <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", sel === i ? "bg-white/15" : "bg-paper")}>
                    <Icon name={r.icon} className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{r.label}</span>
                  <span className={cn("shrink-0 text-[12px] capitalize", sel === i ? "text-white/70" : "text-ink/40")}>{r.hint}</span>
                  {sel === i && <Icons.CornerDownLeft className="size-3.5 shrink-0 text-accent2" />}
                </button>
              </div>
            );
          })}
          {!rows.length && <p className="py-10 text-center text-[14px] text-ink/40">{loaded ? `No results for “${q}”` : "Searching leads…"}</p>}
        </div>
        <div className="flex items-center gap-4 border-t border-line bg-paper/60 px-5 py-2.5 text-[11.5px] text-ink/45">
          <span><kbd className="font-semibold">↑↓</kbd> navigate</span>
          <span><kbd className="font-semibold">↵</kbd> open</span>
          <span className="ml-auto">Tip: press ⌘K anywhere</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
