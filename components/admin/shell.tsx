"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { COLLECTIONS } from "@/lib/collections";
import { cn } from "@/lib/utils";
import { ToastProvider } from "./ui";

type Item = { href: string; label: string; icon: keyof typeof Icons; badge?: number };

export function AdminShell({ children, brand, newLeads, email }: { children: React.ReactNode; brand: string; newLeads: number; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const groups: { title: string; items: Item[] }[] = [
    {
      title: "Overview",
      items: [
        { href: "/admin", label: "Dashboard", icon: "LayoutGrid" },
        { href: "/admin/leads", label: "Leads & CRM", icon: "Inbox", badge: newLeads },
      ],
    },
    {
      title: "Website content",
      items: Object.entries(COLLECTIONS).map(([k, c]) => ({ href: `/admin/content/${k}`, label: c.label, icon: c.icon as keyof typeof Icons })),
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

  const isActive = (href: string) => {
    const [p, q] = href.split("?");
    if (q) return false;
    return p === "/admin" ? pathname === "/admin" : pathname.startsWith(p);
  };

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-4 pb-5 pt-5">
        <span className="relative grid size-9 place-items-center rounded-xl bg-ink text-white">
          <span className="serif text-xl leading-none">{brand.charAt(0)}</span>
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-accent" />
        </span>
        <div className="leading-tight">
          <p className="text-[14px] font-semibold tracking-tight">{brand}</p>
          <p className="text-[11px] text-black/45">Admin console</p>
        </div>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-1.5 px-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-black/35">{g.title}</p>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const Icon = Icons[it.icon] as Icons.LucideIcon;
                const active = isActive(it.href);
                return (
                  <li key={it.href} className="relative">
                    {active && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06]" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                    <Link href={it.href} className={cn("relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] font-medium transition-colors", active ? "text-ink" : "text-black/55 hover:text-ink")}>
                      {Icon && <Icon className={cn("size-[17px]", active && "text-accent")} />}
                      <span className="flex-1">{it.label}</span>
                      {!!it.badge && <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{it.badge}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="space-y-1 border-t border-black/[0.06] p-3">
        <a href="/" target="_blank" className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] font-medium text-black/55 hover:bg-white hover:text-ink">
          <Icons.ExternalLink className="size-[17px]" /> View website
        </a>
        <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] font-medium text-black/55 hover:bg-white hover:text-ink">
          <Icons.LogOut className="size-[17px]" /> Sign out
        </button>
        <p className="truncate px-2.5 pt-1 text-[11px] text-black/35">{email}</p>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-dvh bg-[#F2F1EE] text-ink">
        <aside className="fixed inset-y-0 left-0 hidden w-[248px] border-r border-black/[0.06] bg-[#F7F6F3] lg:block">{nav}</aside>

        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/[0.06] bg-[#F7F6F3]/90 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} className="grid size-9 place-items-center rounded-xl bg-white ring-1 ring-black/[0.06]" aria-label="Menu">
            <Icons.Menu className="size-4" />
          </button>
          <p className="text-[14px] font-semibold">{brand} Admin</p>
          <Link href="/admin/leads" className="relative grid size-9 place-items-center rounded-xl bg-white ring-1 ring-black/[0.06]">
            <Icons.Inbox className="size-4" />
            {newLeads > 0 && <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-white">{newLeads}</span>}
          </Link>
        </header>

        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
              <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 400, damping: 40 }} className="absolute inset-y-0 left-0 w-[270px] bg-[#F7F6F3] shadow-2xl">
                {nav}
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="lg:pl-[248px]">
          <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-[1280px] px-4 py-6 md:px-8 md:py-8">
            {children}
          </motion.div>
        </main>
      </div>
    </ToastProvider>
  );
}
