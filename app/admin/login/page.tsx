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
      className="relative w-full max-w-sm rounded-[28px] bg-white/90 p-7 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.4)] ring-1 ring-black/5 backdrop-blur-xl"
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-ink text-white">
        <Lock className="size-5" />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">Welcome back</h1>
      <p className="mt-1 text-[14px] text-black/50">Sign in to manage your institute.</p>
      <div className="mt-7 space-y-3">
        <input className="w-full rounded-xl border border-black/10 px-4 py-3 text-[15px] outline-none focus:border-black/30" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input className="w-full rounded-xl border border-black/10 px-4 py-3 text-[15px] outline-none focus:border-black/30" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required autoFocus />
      </div>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      <button disabled={loading} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-white transition hover:bg-accent">
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
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#F2F1EE] px-4">
      <div aria-hidden className="absolute -left-40 top-0 size-[600px] rounded-full opacity-40" style={{ background: "radial-gradient(circle, var(--accent), transparent 65%)" }} />
      <div aria-hidden className="absolute -right-40 bottom-0 size-[600px] rounded-full opacity-30" style={{ background: "radial-gradient(circle, var(--accent-2), transparent 65%)" }} />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
