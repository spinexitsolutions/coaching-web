"use client";

import { motion } from "framer-motion";

/** Every route change: content rises in while a curtain sweeps away. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] origin-top bg-ink"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: "top" }}
      />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
        {children}
      </motion.div>
    </>
  );
}
