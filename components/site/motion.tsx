"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade + lift + un-blur when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; once?: boolean } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Masked word-by-word headline reveal. */
export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  as: Tag = "span",
  play,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  /** When provided, overrides in-view detection (e.g. wait for the intro). */
  play?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const show = play ?? inView;
  const words = text.split(" ");
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className={cn("inline-block will-change-transform", wordClassName)}
            initial={{ y: "110%", rotate: 4 }}
            animate={show ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Animated number that counts up once visible. */
export function Counter({ value, suffix = "", className, duration = 2 }: { value: number; suffix?: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString("en-IN")),
    });
    return () => controls.stop();
  }, [inView, value, duration]);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
      {suffix}
    </span>
  );
}

/** Element that gently follows the pointer (desktop only). */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={cn("inline-block", className)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Image/element with scroll-linked vertical parallax. */
export function Parallax({ children, offset = 60, className }: { children: ReactNode; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-offset, offset]);
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y }} className="h-[calc(100%+120px)] -mt-[60px] w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Section heading pattern: eyebrow + big title with an italic serif accent. */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  after,
  className,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  after?: string;
  className?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={cn(align === "center" && "text-center mx-auto", "max-w-3xl", className)}>
      <Reveal>
        <div className={cn("eyebrow mb-5 flex items-center gap-2", align === "center" && "justify-center", dark ? "text-white/60" : "text-muted")}>
          <span className="inline-block size-1.5 rounded-full bg-accent" />
          {eyebrow}
        </div>
      </Reveal>
      <h2 className={cn("display text-[clamp(2.4rem,7vw,5.2rem)]", dark && "text-white")}>
        <SplitWords text={title} />
        {accent && (
          <>
            {" "}
            <SplitWords text={accent} wordClassName="serif text-accent pr-[0.06em]" delay={0.15} />
          </>
        )}
        {after && (
          <>
            {" "}
            <SplitWords text={after} delay={0.25} />
          </>
        )}
      </h2>
    </div>
  );
}
