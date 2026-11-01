"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, Plus, Upload, X, AlertCircle, GripVertical } from "lucide-react";
import type { Field } from "@/lib/collections";
import { IMAGE_LIBRARY } from "@/lib/seed";
import { cn } from "@/lib/utils";

/* ───────── Toasts ───────── */

type Toast = { id: number; text: string; kind: "ok" | "err" };
const ToastCtx = createContext<(text: string, kind?: "ok" | "err") => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, kind: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-xl"
            >
              {t.kind === "ok" ? <Check className="size-4 text-emerald-400" /> : <AlertCircle className="size-4 text-red-400" />}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ───────── Primitives ───────── */

export const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-[14px] outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/[0.04]";

export function Button({ variant = "primary", loading, className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "accent"; loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-semibold transition active:scale-[0.98] disabled:opacity-50",
        variant === "primary" && "bg-ink text-white hover:bg-black/80",
        variant === "accent" && "bg-accent text-white hover:brightness-110",
        variant === "ghost" && "border border-black/10 bg-white text-ink hover:bg-black/[0.03]",
        variant === "danger" && "bg-red-50 text-red-600 hover:bg-red-100",
        className,
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors duration-300", checked ? "bg-emerald-500" : "bg-black/15")}
      >
        <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className={cn("absolute top-[3px] size-5 rounded-full bg-white shadow", checked ? "right-[3px]" : "left-[3px]")} />
      </button>
      {label && <span className="text-[14px]">{label}</span>}
    </label>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-black/[0.06] bg-white p-5", className)}>{children}</div>;
}

export function PageTitle({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] md:text-[32px]">{title}</h1>
        {subtitle && <p className="mt-1 text-[14px] text-black/50">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

/* ───────── Image input (URL / library / upload) ───────── */

export function ImageInput({ value, onChange, accept = "image/*" }: { value: string; onChange: (v: string) => void; accept?: string }) {
  const [lib, setLib] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const isImage = value && !/\.pdf($|\?)/i.test(value) && value !== "#";

  async function upload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onChange(json.url);
      toast("Uploaded");
    } catch (e) {
      toast((e as Error).message || "Upload failed", "err");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-3">
        <div className="relative grid size-[74px] shrink-0 place-items-center overflow-hidden rounded-xl border border-black/10 bg-black/[0.03]">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <ImagePlus className="size-5 text-black/30" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload" />
          <div className="flex gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-medium hover:bg-black/[0.03]">
              {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />} Upload
            </button>
            {accept.startsWith("image") && (
              <button type="button" onClick={() => setLib((v) => !v)} className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-medium hover:bg-black/[0.03]">
                <ImagePlus className="size-3.5" /> Library
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      <AnimatePresence>
        {lib && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-3 grid max-h-64 grid-cols-5 gap-2 overflow-y-auto rounded-xl bg-black/[0.03] p-2 sm:grid-cols-6">
              {IMAGE_LIBRARY.map((src) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => {
                    onChange(src);
                    setLib(false);
                  }}
                  className={cn("relative aspect-square overflow-hidden rounded-lg ring-2 transition", value === src ? "ring-accent" : "ring-transparent hover:ring-black/20")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src.replace("w=1200", "w=200")} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────── List of strings ───────── */

export function ListInput({ value, onChange, placeholder = "Add item and press Enter" }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const [drag, setDrag] = useState<number | null>(null);
  const add = () => {
    if (!draft.trim()) return;
    onChange([...value, draft.trim()]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => setDrag(i)}
          onDragOver={(e) => {
            e.preventDefault();
            if (drag === null || drag === i) return;
            const next = [...value];
            const [m] = next.splice(drag, 1);
            next.splice(i, 0, m);
            onChange(next);
            setDrag(i);
          }}
          onDragEnd={() => setDrag(null)}
          className={cn("flex items-center gap-2 rounded-xl border border-black/10 bg-white pl-2 pr-1", drag === i && "opacity-50")}
        >
          <GripVertical className="size-4 shrink-0 cursor-grab text-black/25" />
          <input className="flex-1 bg-transparent py-2 text-[14px] outline-none" value={v} onChange={(e) => onChange(value.map((x, k) => (k === i ? e.target.value : x)))} />
          <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} className="grid size-7 place-items-center rounded-lg text-black/40 hover:bg-red-50 hover:text-red-500">
            <X className="size-4" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" onClick={add} className="grid size-[42px] shrink-0 place-items-center rounded-xl bg-black/[0.05] hover:bg-black/10">
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

/* ───────── Schema-driven field ───────── */

export function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const v = value as never;
  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = <textarea className={cn(inputCls, "resize-y")} rows={field.rows || 4} value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />;
      break;
    case "number":
      control = <input type="number" className={inputCls} value={(v as number) ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
      break;
    case "boolean":
      return <Toggle checked={!!v} onChange={onChange} label={field.label} />;
    case "select":
      control = (
        <select className={inputCls} value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
      break;
    case "image":
      control = <ImageInput value={(v as string) ?? ""} onChange={onChange} accept={field.key === "fileUrl" ? "image/*,application/pdf" : "image/*"} />;
      break;
    case "list":
      control = <ListInput value={(v as string[]) ?? []} onChange={onChange} />;
      break;
    case "date":
      control = <input type="date" className={inputCls} value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "datetime":
      control = <input type="datetime-local" className={inputCls} value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "color":
      control = (
        <div className="flex gap-2">
          <input type="color" className="h-[42px] w-14 cursor-pointer rounded-xl border border-black/10 bg-white p-1" value={(v as string) || "#000000"} onChange={(e) => onChange(e.target.value)} />
          <input className={inputCls} value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
      break;
    default:
      control = <input type={field.type === "url" ? "text" : "text"} className={inputCls} value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />;
  }
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-black/55">{field.label}</span>
      {control}
      {field.help && <span className="mt-1 block text-[11px] text-black/40">{field.help}</span>}
    </label>
  );
}

/* ───────── Slide-over drawer ───────── */

export function Drawer({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className={cn("absolute bottom-0 right-0 top-0 flex w-full flex-col bg-[#FAFAF8] shadow-2xl", wide ? "max-w-2xl" : "max-w-xl")}
          >
            <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <button onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-black/5">
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer && <div className="flex items-center justify-end gap-2 border-t border-black/[0.06] bg-white px-5 py-3">{footer}</div>}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
