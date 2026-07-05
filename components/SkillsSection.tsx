"use client";

import { motion } from "framer-motion";

// ─── Skills distributed across 3 rows ────────────────────────────────────────
const ROW_1 = ["Script Writing", "Video Editing", "After Effects", "Motion Graphics", "AI Generations"];
const ROW_2 = ["Illustrator", "Ai Video Production", "3ds Max", "Maya", "WordPress"];
const ROW_3 = ["Web Development", "Photoshop", "Premiere Pro", "CapCut"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Repeat a row's items until we have ≥ minCount entries,
 * then double the whole thing for the seamless loop trick:
 * animating x 0% → -50% on a doubled array moves exactly one "copy"
 * so the visual wraps imperceptibly.
 */
function buildMarqueeItems(row: string[], minCount = 20): string[] {
  const filled: string[] = [];
  while (filled.length < minCount) filled.push(...row);
  return [...filled, ...filled]; // doubled → x: 0% to -50% = perfect loop
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SkillChipProps {
  text: string;
  outline: boolean;
}

function SkillChip({ text, outline }: SkillChipProps) {
  return (
    <span className="inline-flex items-center shrink-0">
      <span
        className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight px-3 select-none leading-none"
        style={
          outline
            ? {
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.30)",
              }
            : {
                color: "#e5e5e5",
              }
        }
      >
        {text}
      </span>
      {/* Separator dot */}
      <span
        className="shrink-0 select-none text-base"
        style={{ color: "rgba(255,255,255,0.15)" }}
      >
        •
      </span>
    </span>
  );
}

interface MarqueeRowProps {
  items: string[];
  direction: "left" | "right";
  duration: number;
}

function MarqueeRow({ items, direction, duration }: MarqueeRowProps) {
  const marqueeItems = buildMarqueeItems(items);

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex items-center whitespace-nowrap will-change-transform"
        /**
         * Seamless loop:
         *   Left  — start at 0%, end at -50% (first copy scrolls off left)
         *   Right — start at -50%, end at 0% (second copy scrolls in from left)
         * At either endpoint the visible area is identical → no jump on repeat.
         */
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {marqueeItems.map((skill, i) => (
          <SkillChip
            key={`${skill}-${i}`}
            text={skill}
            outline={i % 2 === 0}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function SkillsSection() {
  return (
    <section className="relative w-full bg-black overflow-hidden py-16 select-none">

      {/* ── Section heading ─────────────────────────────────────────────────── */}
      <div className="text-center mb-10 px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[10px] font-mono tracking-[0.55em] text-neutral-500 uppercase mb-4"
        >
          What I bring to the table
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white"
        >
          Skills &amp; Expertise
        </motion.h2>
      </div>

      {/* ── Marquee rows container ───────────────────────────────────────────── */}
      <div className="relative flex flex-col gap-1 md:gap-2">

        {/* Left / right edge fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 md:w-48"
          style={{ background: "linear-gradient(to right, #000 0%, transparent 100%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 md:w-48"
          style={{ background: "linear-gradient(to left, #000 0%, transparent 100%)" }}
        />

        {/* Row 1 — left ← */}
        <MarqueeRow items={ROW_1} direction="left" duration={28} />

        {/* Row 2 — right → */}
        <MarqueeRow items={ROW_2} direction="right" duration={22} />

        {/* Row 3 — left ← */}
        <MarqueeRow items={ROW_3} direction="left" duration={32} />
      </div>

      {/* ── Subtle top / bottom borders ─────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-neutral-900" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-900" />
    </section>
  );
}
