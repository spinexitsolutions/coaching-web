"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return false;
  if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { offset: -90, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
  return true;
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Smooth in-page anchor links.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      if (scrollToHash(href)) e.preventDefault();
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => scrollToHash(window.location.hash), 300);
    } else {
      window.__lenis?.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}
