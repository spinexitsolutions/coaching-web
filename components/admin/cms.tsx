"use client";

import { motion, Reorder } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Copy, Eye, EyeOff, GripVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { CollectionDef } from "@/lib/collections";
import { cn } from "@/lib/utils";
import { Button, Drawer, FieldInput, PageTitle, inputCls, useToast } from "./ui";

type Item = Record<string, unknown> & { id: string };

export function CollectionEditor({ collection, def, initial }: { collection: string; def: CollectionDef; initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [editing, setEditing] = useState<Item | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const router = useRouter();

  async function persist(next: Item[], msg = "Saved — live on website") {
    setItems(next);
    setSaving(true);
    const res = await fetch(`/api/admin/cms/${collection}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
    setSaving(false);
    if (!res.ok) return toast("Save failed", "err");
    toast(msg);
    router.refresh();
  }

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return s ? items.filter((it) => JSON.stringify(it).toLowerCase().includes(s)) : items;
  }, [items, q]);

  function openNew() {
    setEditing({ ...structuredClone(def.blank), id: `${collection.slice(0, 2)}_${Date.now().toString(36)}` } as Item);
    setIsNew(true);
  }

  function saveItem() {
    if (!editing) return;
    const next = isNew ? [editing, ...items] : items.map((i) => (i.id === editing.id ? editing : i));
    persist(next, isNew ? `${def.singular} created` : `${def.singular} updated`);
    setEditing(null);
  }

  const str = (v: unknown) => (v === undefined || v === null ? "" : String(v));

  return (
    <div>
      <PageTitle title={def.label} subtitle={def.description}>
        <Button variant="accent" onClick={openNew}>
          <Plus className="size-4" /> New {def.singular.toLowerCase()}
        </Button>
      </PageTitle>

      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35" />
          <input className={cn(inputCls, "pl-9")} placeholder={`Search ${def.label.toLowerCase()}…`} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <span className="hidden text-[12px] text-black/40 md:block">{saving ? "Saving…" : q ? `${filtered.length} of ${items.length}` : "Drag ⋮⋮ to reorder"}</span>
      </div>

      <Reorder.Group
        axis="y"
        values={filtered}
        onReorder={(next: Item[]) => {
          if (q) return;
          setItems(next);
        }}
        className="space-y-2"
      >
        {filtered.map((it) => (
          <Reorder.Item
            key={it.id}
            value={it}
            dragListener={!q}
            onDragEnd={() => persist(items, "Order saved")}
            className="group flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white p-2.5 pr-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.3)" }}
          >
            <GripVertical className={cn("size-4 shrink-0 text-black/20", !q && "cursor-grab")} />
            {def.imageKey && (
              <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-black/[0.04]">
                {str(it[def.imageKey]) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={str(it[def.imageKey])} alt="" className="absolute inset-0 size-full object-cover" />
                )}
              </span>
            )}
            <button className="min-w-0 flex-1 text-left" onClick={() => { setEditing(structuredClone(it)); setIsNew(false); }}>
              <p className="truncate text-[14px] font-semibold">{str(it[def.titleKey]) || "Untitled"}</p>
              {def.subtitleKey && <p className="truncate text-[12.5px] text-black/45">{str(it[def.subtitleKey])}</p>}
            </button>
            {def.badgeKey && str(it[def.badgeKey]) && <span className="hidden rounded-full bg-black/[0.05] px-2.5 py-1 text-[11.5px] font-medium text-black/60 sm:inline">{str(it[def.badgeKey])}</span>}
            <div className="flex items-center gap-0.5">
              <IconBtn label={it.published ? "Hide from website" : "Publish"} onClick={() => persist(items.map((x) => (x.id === it.id ? { ...x, published: !x.published } : x)), it.published ? "Hidden from website" : "Published")}>
                {it.published ? <Eye className="size-4 text-emerald-600" /> : <EyeOff className="size-4 text-black/30" />}
              </IconBtn>
              <IconBtn label="Edit" onClick={() => { setEditing(structuredClone(it)); setIsNew(false); }}>
                <Pencil className="size-4" />
              </IconBtn>
              <IconBtn
                label="Duplicate"
                className="hidden sm:grid"
                onClick={() => {
                  const copy = { ...structuredClone(it), id: `${it.id}_copy${Date.now().toString(36).slice(-3)}`, published: false } as Item;
                  if (def.titleKey in copy) copy[def.titleKey] = `${str(copy[def.titleKey])} (copy)`;
                  if ("slug" in copy) copy.slug = `${str(copy.slug)}-copy`;
                  const idx = items.findIndex((x) => x.id === it.id);
                  persist([...items.slice(0, idx + 1), copy, ...items.slice(idx + 1)], "Duplicated (hidden)");
                }}
              >
                <Copy className="size-4" />
              </IconBtn>
              <IconBtn
                label="Delete"
                danger
                onClick={() => {
                  if (confirm(`Delete "${str(it[def.titleKey])}"?`)) persist(items.filter((x) => x.id !== it.id), "Deleted");
                }}
              >
                <Trash2 className="size-4" />
              </IconBtn>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {!filtered.length && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-black/15 py-16 text-center text-black/40">
          Nothing here yet. <button className="font-semibold text-accent" onClick={openNew}>Create the first one</button>
        </motion.div>
      )}

      <Drawer
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? `New ${def.singular.toLowerCase()}` : `Edit ${def.singular.toLowerCase()}`}
        wide
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveItem}>{isNew ? "Create" : "Save changes"}</Button>
          </>
        }
      >
        {editing && (
          <div className="grid gap-4 sm:grid-cols-2">
            {def.fields.map((f) => (
              <div key={f.key} className={cn(f.full || f.type === "boolean" ? "sm:col-span-2" : "")}>
                <FieldInput
                  field={f}
                  value={editing[f.key]}
                  onChange={(v) =>
                    setEditing((e) => {
                      if (!e) return e;
                      const next = { ...e, [f.key]: v };
                      if (f.key === "title" && "slug" in e && isNew) next.slug = String(v).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      return next;
                    })
                  }
                />
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}

function IconBtn({ children, label, onClick, danger, className }: { children: React.ReactNode; label: string; onClick: () => void; danger?: boolean; className?: string }) {
  return (
    <button title={label} aria-label={label} onClick={onClick} className={cn("grid size-8 place-items-center rounded-lg text-black/50 transition", danger ? "hover:bg-red-50 hover:text-red-500" : "hover:bg-black/[0.05] hover:text-ink", className)}>
      {children}
    </button>
  );
}
