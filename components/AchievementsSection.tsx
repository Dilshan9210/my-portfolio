"use client";

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AchievementsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const jatPanelRef = useRef<HTMLDivElement>(null);
  const dakshinaPanelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ── Initial states ────────────────────────────────────────────────────
      gsap.set(jatPanelRef.current, { clipPath: 'circle(0% at 50% 50%)' });
      gsap.set(dakshinaPanelRef.current, { clipPath: 'inset(100% 0 0 0)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      // ── Phase 1 (0 → 0.4): Expanding circle reveals JAT video ─────────
      // Title fades out as the circle grows
      tl.to(titleRef.current, {
        opacity: 0,
        scale: 0.9,
        ease: "power2.in",
        duration: 0.2
      }, 0);

      tl.to(jatPanelRef.current, {
        clipPath: 'circle(150% at 50% 50%)',
        ease: "power1.inOut",
        duration: 0.4
      }, 0);

      // ── Phase 2 (0.55 → 1.0): Dakshina video reveals from bottom ──────
      tl.to(dakshinaPanelRef.current, {
        clipPath: 'inset(0% 0 0 0)',
        ease: "none",
        duration: 0.45
      }, 0.55);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black"
      style={{ zIndex: 2 }}
    >

      {/* ═══════════════ LAYER 0 — "MY ACHIEVEMENTS" Title ═══════════════ */}
      <div
        ref={titleRef}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none select-none gap-5"
      >
        <span className="text-[10px] md:text-xs font-mono tracking-[0.6em] text-neutral-500 uppercase">
          Scroll to explore
        </span>
        <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black text-white text-center leading-[0.85] tracking-[-0.04em] uppercase">
          MY
          <br />
          ACHIEVEMENTS
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-neutral-500 to-transparent mt-2" />
      </div>

      {/* ═══════════════ LAYER 1 — JAT Video (circle expand) ═══════════════ */}
      <div
        ref={jatPanelRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 10 }}
      >
        <video
          autoPlay loop muted playsInline
          className="w-full h-full object-cover"
        >
          <source src="/jat-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl md:text-7xl font-black text-white text-center">
            1st Palce JAT Paints AI Video Competition 2026
          </h1>
        </div>

        {/* Watch Full Video — premium glassmorphism button */}
        <a
          href="https://drive.google.com/file/d/1WQbsnOAfcktGVRg9QFRpdbc8hKASwt4F/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-8 right-8 z-20 group flex items-center gap-3
                     px-7 py-3.5 rounded-full
                     bg-white/[0.08] backdrop-blur-2xl
                     border border-white/[0.15]
                     text-white/90 text-[13px] font-medium tracking-[0.05em]
                     shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
                     hover:bg-white/[0.15] hover:border-white/30
                     hover:shadow-[0_0_40px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.15)]
                     transition-all duration-500 ease-out
                     active:scale-[0.97]"
        >
          Watch full video
          <svg
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

      {/* ═══════════════ LAYER 2 — Dakshina Video (inset reveal) ═══════════════ */}
      <div
        ref={dakshinaPanelRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 20 }}
      >
        <video
          autoPlay loop muted playsInline
          className="w-full h-full object-cover"
        >
          <source src="/dakshina-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl md:text-7xl font-black text-white text-center">
            Dakshina Prabha National Online Video Competition 2026 Selected  to Best 10 Videos
          </h1>
        </div>

        {/* Watch Full Video — premium glassmorphism button */}
        <a
          href="https://drive.google.com/file/d/1EnBH0iVjqzVxemnUqXGOqzAnZh23u4E4/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-8 right-8 z-20 group flex items-center gap-3
                     px-7 py-3.5 rounded-full
                     bg-white/[0.08] backdrop-blur-2xl
                     border border-white/[0.15]
                     text-white/90 text-[13px] font-medium tracking-[0.05em]
                     shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
                     hover:bg-white/[0.15] hover:border-white/30
                     hover:shadow-[0_0_40px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.15)]
                     transition-all duration-500 ease-out
                     active:scale-[0.97]"
        >
          Watch full video
          <svg
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

    </section>
  );
}