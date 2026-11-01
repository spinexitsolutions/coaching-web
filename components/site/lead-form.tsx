"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  courses: string[];
  source: string;
  dark?: boolean;
  compact?: boolean;
  defaultCourse?: string;
  submitLabel?: string;
  showMessage?: boolean;
  className?: string;
};

const CLASSES = ["Class 6–8", "Class 9", "Class 10", "Class 11", "Class 12", "Dropper"];

export function LeadForm({ courses, source, dark, compact, defaultCourse, submitLabel = "Book my free demo", showMessage = !compact, className }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("idle");
    }
  }

  const field = cn(
    "peer w-full rounded-2xl border px-4 pb-2.5 pt-6 text-[15px] outline-none transition-all duration-300",
    dark
      ? "border-white/10 bg-white/[0.05] text-white placeholder-transparent focus:border-white/40 focus:bg-white/[0.08]"
      : "border-line bg-white text-ink placeholder-transparent focus:border-ink/40 focus:shadow-[0_0_0_4px_rgb(0_0_0/0.04)]",
  );
  const label = cn(
    "pointer-events-none absolute left-4 top-2 text-[11px] font-medium uppercase tracking-wider transition-all duration-300",
    "peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal",
    "peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider",
    dark ? "text-white/45" : "text-muted",
  );

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn("flex flex-col items-center justify-center rounded-3xl px-6 py-12 text-center", dark ? "bg-white/[0.05]" : "bg-white")}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.15 }}
              className="mb-5 grid size-16 place-items-center rounded-full bg-accent text-white"
            >
              <Check className="size-8" strokeWidth={2.5} />
            </motion.div>
            <p className={cn("text-2xl font-semibold tracking-tight", dark && "text-white")}>You&apos;re in.</p>
            <p className={cn("mt-2 max-w-xs text-[15px]", dark ? "text-white/60" : "text-muted")}>
              Our counsellor will call you within 24 hours to confirm your slot.
            </p>
            <button onClick={() => setState("idle")} className={cn("mt-6 text-sm underline underline-offset-4", dark ? "text-white/60" : "text-muted")}>
              Submit another response
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-3 sm:grid-cols-2">
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="relative sm:col-span-2">
              <input id={`${source}-name`} name="name" required minLength={2} placeholder="Full name" className={field} />
              <label htmlFor={`${source}-name`} className={label}>Student name</label>
            </div>
            <div className="relative">
              <input id={`${source}-phone`} name="phone" required type="tel" inputMode="tel" placeholder="Phone" className={field} />
              <label htmlFor={`${source}-phone`} className={label}>Phone number</label>
            </div>
            <div className="relative">
              <input id={`${source}-email`} name="email" type="email" placeholder="Email" className={field} />
              <label htmlFor={`${source}-email`} className={label}>Email (optional)</label>
            </div>
            <div className="relative">
              <select name="classLevel" defaultValue="" className={cn(field, "appearance-none")} required>
                <option value="" disabled>
                  Select
                </option>
                {CLASSES.map((c) => (
                  <option key={c} value={c} className="text-ink">
                    {c}
                  </option>
                ))}
              </select>
              <span className={cn(label, "!top-2 !text-[11px] !uppercase !tracking-wider")}>Class</span>
            </div>
            <div className="relative">
              <select name="course" defaultValue={defaultCourse || ""} className={cn(field, "appearance-none")} required>
                <option value="" disabled>
                  Select
                </option>
                {courses.map((c) => (
                  <option key={c} value={c} className="text-ink">
                    {c}
                  </option>
                ))}
              </select>
              <span className={cn(label, "!top-2 !text-[11px] !uppercase !tracking-wider")}>Interested in</span>
            </div>
            {showMessage && (
              <div className="relative sm:col-span-2">
                <textarea id={`${source}-msg`} name="message" rows={3} placeholder="Message" className={cn(field, "resize-none")} />
                <label htmlFor={`${source}-msg`} className={label}>Anything we should know? (optional)</label>
              </div>
            )}
            {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}
            <button
              type="submit"
              disabled={state === "loading"}
              className={cn(
                "group relative mt-1 flex h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl font-semibold transition sm:col-span-2",
                dark ? "bg-white text-ink" : "bg-ink text-white",
              )}
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-apple)] group-hover:scale-x-100" />
              <span className="relative flex items-center gap-2 transition-colors group-hover:text-white">
                {state === "loading" ? <Loader2 className="size-5 animate-spin" /> : submitLabel}
                {state !== "loading" && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
              </span>
            </button>
            <p className={cn("text-center text-xs sm:col-span-2", dark ? "text-white/40" : "text-muted")}>
              No spam. We only call to help you choose the right program.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
