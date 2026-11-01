"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Phone, X } from "lucide-react";
import type { Settings } from "@/lib/types";
import { LeadForm } from "./lead-form";

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 0 1 2.2 12C2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 0 1 2.9 6.9c0 5.4-4.4 9.8-9.8 9.8zM20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.2 1.6 6L0 24l6.3-1.6a11.9 11.9 0 0 0 5.7 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.4z" />
    </svg>
  );
}

export function FloatingActions({ settings }: { settings: Settings }) {
  const { brand } = settings;
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 500));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 md:bottom-6 md:right-6"
        >
          <a
            href={`tel:${brand.phone.replace(/\s/g, "")}`}
            aria-label="Call"
            className="grid size-12 place-items-center rounded-full bg-ink text-white shadow-xl transition hover:scale-110 md:hidden"
          >
            <Phone className="size-5" />
          </a>
          <a
            href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(`Hi ${brand.name}, I'd like to know more about your courses.`)}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="group relative grid size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110 md:size-14"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
            <WhatsAppIcon className="relative size-6" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AdmissionPopup({ settings, courses }: { settings: Settings; courses: string[] }) {
  const { popup } = settings;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup.enabled) return;
    try {
      if (sessionStorage.getItem("lumina-popup")) return;
    } catch {}
    const t = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem("lumina-popup", "1");
      } catch {}
    }, Math.max(3, popup.delay) * 1000);
    return () => clearTimeout(t);
  }, [popup.enabled, popup.delay]);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative grid max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-paper shadow-2xl md:grid-cols-[0.9fr_1.1fr]"
            data-lenis-prevent
          >
            <div className="relative hidden md:block">
              {popup.image && <Image src={popup.image} alt="" fill sizes="400px" className="object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="serif absolute bottom-6 left-6 right-6 text-3xl leading-tight text-white">{settings.brand.tagline}</p>
            </div>
            <div className="p-6 md:p-8">
              <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-black/5 transition hover:bg-black/10">
                <X className="size-4" />
              </button>
              <span className="eyebrow text-accent">Limited slots</span>
              <h3 className="mt-2 pr-8 text-3xl font-semibold tracking-tight">{popup.title}</h3>
              <p className="mb-6 mt-2 text-muted">{popup.text}</p>
              <LeadForm courses={courses} source="Admission popup" compact submitLabel="Request a call back" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
