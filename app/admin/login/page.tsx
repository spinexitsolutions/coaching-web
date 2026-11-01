"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("admin@lumina.academy");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (res.ok) {
      router.push(params.get("next") || "/admin");
      router.refresh();
    } else {
      setError((await res.json()).error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-sm rounded-[28px] bg-white p-7 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent2">
        <Lock className="size-5" />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">Welcome back</h1>
      <p className="mt-1 text-[14px] text-black/50">Sign in to manage your institute.</p>
      <div className="mt-7 space-y-3">
        <input className="w-full rounded-xl border border-black/10 px-4 py-3 text-[15px] outline-none focus:border-black/30" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input className="w-full rounded-xl border border-black/10 px-4 py-3 text-[15px] outline-none focus:border-black/30" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required autoFocus />
      </div>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      <button disabled={loading} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-white transition hover:bg-ink">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <>Sign in <ArrowRight className="size-4" /></>}
      </button>
      <p className="mt-5 rounded-xl bg-black/[0.03] px-3 py-2.5 text-center text-[12px] text-black/50">
        Demo login: <b>admin@lumina.academy</b> / <b>lumina@2026</b>
      </p>
    </motion.form>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh bg-paper lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-accent p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="absolute -right-40 -top-40 size-[520px] rounded-full border border-white/10" />
        <div aria-hidden className="absolute -right-16 -top-16 size-[300px] rounded-full border border-white/10" />
        <div aria-hidden className="absolute -bottom-32 -left-32 size-[420px] rounded-full border border-accent2/30" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-accent2 text-[18px] font-bold text-ink">L</span>
          <span className="text-[15px] font-semibold">Lumina Academy · Control room</span>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} className="relative">
          <p className="text-[clamp(2.4rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
            Every enquiry, every page, <span className="text-accent2">one place.</span>
          </p>
          <ul className="mt-8 space-y-3 text-[15px] text-white/75">
            {["CRM with pipeline, follow-ups & notes", "Edit every page of the website live", "Intro, theme, navbar & sections — no code"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-accent2" />
                {t}
              </li>
            ))}
          </ul>
        </motion.div>
        <p className="relative text-[13px] text-white/45">Press ⌘K inside the panel to search anything.</p>
      </div>
      <div className="grid place-items-center px-4 py-12">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
