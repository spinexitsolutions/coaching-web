"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Settings } from "@/lib/types";

const EASE = [0.76, 0, 0.24, 1] as const;
const IntroCtx = createContext(true);
export const useIntroDone = () => useContext(IntroCtx);

const KEY = "lumina-intro-seen";

/** Runs before paint so returning visitors never see a flash of the overlay. */
export function IntroScript({ oncePerSession }: { oncePerSession: boolean }) {
  const js = oncePerSession
    ? `try{if(sessionStorage.getItem('${KEY}'))document.documentElement.classList.add('intro-seen')}catch(e){}`
    : "";
  return (
    <>
      <style>{`html.intro-seen .intro-overlay{display:none!important}`}</style>
      {js && <script dangerouslySetInnerHTML={{ __html: js }} />}
    </>
  );
}

export function IntroProvider({ intro, brand, children }: { intro: Settings["intro"]; brand: string; children: ReactNode }) {
  const [show, setShow] = useState(intro.enabled);
  const [done, setDone] = useState(!intro.enabled);

  useEffect(() => {
    if (!intro.enabled) return;
    const seen = document.documentElement.classList.contains("intro-seen");
    if (seen) {
      setShow(false);
      setDone(true);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();
    const total = Math.max(1.2, intro.duration) * 1000;
    const t = setTimeout(() => {
      setShow(false);
      try {
        if (intro.oncePerSession) sessionStorage.setItem(KEY, "1");
      } catch {}
    }, total);
    return () => clearTimeout(t);
  }, [intro.enabled, intro.duration, intro.oncePerSession]);

  return (
    <IntroCtx.Provider value={done}>
      <AnimatePresence
        onExitComplete={() => {
          document.documentElement.style.overflow = "";
          window.__lenis?.start();
          setDone(true);
        }}
      >
        {show && <IntroOverlay key="intro" intro={intro} brand={brand} onSkip={() => setShow(false)} />}
      </AnimatePresence>
      {children}
    </IntroCtx.Provider>
  );
}

function IntroOverlay({ intro, brand, onSkip }: { intro: Settings["intro"]; brand: string; onSkip: () => void }) {
  const words = intro.words.length ? intro.words : [brand];
  const [i, setI] = useState(0);
  const [count, setCount] = useState(0);
  const per = (Math.max(1.2, intro.duration) * 1000 - 500) / words.length;

  useEffect(() => {
    const id = setInterval(() => setI((v) => Math.min(v + 1, words.length - 1)), per);
    const start = performance.now();
    const total = Math.max(1.2, intro.duration) * 1000 - 300;
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / total);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [per, words.length, intro.duration]);

  return (
    <motion.div className="intro-overlay fixed inset-0 z-[100]" exit={{ pointerEvents: "none" }}>
      {/* accent layer that trails behind for a layered wipe */}
      <motion.div
        className="absolute inset-0 bg-accent"
        initial={{ y: 0 }}
        exit={{ y: "-100%", borderBottomLeftRadius: "50% 18vh", borderBottomRightRadius: "50% 18vh" }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.12 }}
      />
      <motion.div
        className="grain absolute inset-0 flex flex-col overflow-hidden text-white"
        style={{ background: intro.background }}
        initial={{ y: 0 }}
        exit={{ y: "-100%", borderBottomLeftRadius: "50% 18vh", borderBottomRightRadius: "50% 18vh" }}
        transition={{ duration: 1, ease: EASE }}
      >
        <div className="flex items-center justify-between px-5 pt-5 md:px-10 md:pt-8">
          <span className="eyebrow text-white/50">{brand}</span>
          <button onClick={onSkip} className="eyebrow rounded-full border border-white/15 px-3 py-1.5 text-white/60 transition hover:bg-white hover:text-black">
            Skip
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center px-5">
          <div className="relative h-[1.1em] w-full overflow-hidden text-center text-[clamp(3.2rem,13vw,11rem)] font-semibold leading-none tracking-[-0.05em]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={i}
                className="block"
                initial={{ y: "105%", filter: "blur(6px)" }}
                animate={{ y: "0%", filter: "blur(0px)" }}
                exit={{ y: "-105%", filter: "blur(6px)" }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {i === words.length - 1 ? <span className="serif tracking-[-0.02em] text-accent">{words[i]}</span> : words[i]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="px-5 pb-6 md:px-10 md:pb-10">
          <div className="mb-4 h-px w-full overflow-hidden bg-white/10">
            <div className="h-full bg-white transition-[width] duration-100" style={{ width: `${count}%` }} />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[clamp(3rem,10vw,7rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums">
              {String(count).padStart(3, "0")}
            </span>
            <span className="eyebrow max-w-[14rem] text-right text-white/50">Preparing your learning space</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
