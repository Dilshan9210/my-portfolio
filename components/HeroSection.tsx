"use client";

import { useEffect, useRef, useCallback } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_FRAMES  = 95;
const EXTRA_SCROLL  = 5000;  // px — extra scroll height that "plays" the sequence
const MOBILE_BP     = 768;   // px — below this, skip heavy preload

// ─── object-fit: cover ────────────────────────────────────────────────────────

function drawCover(
  ctx : CanvasRenderingContext2D,
  img : HTMLImageElement,
  cw  : number,
  ch  : number
) {
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth  * scale;
  const h = img.naturalHeight * scale;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}

// ─── Component ────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  isEntered: boolean;
}

export default function HeroSection({ isEntered }: HeroSectionProps) {
  /** Outer div — gives the page extra height so the section can "scroll" */
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  /**
   * Ref for the text overlay (name + subtitle).
   * GSAP timeline animates this from opacity:0 / y:50 → opacity:1 / y:0
   * beginning at 25% of the scroll sequence (1250 / 5000 px).
   */
  const textRef = useRef<HTMLDivElement>(null);

  /** All 95 Image objects live here as soon as isEntered fires */
  const framesRef   = useRef<HTMLImageElement[]>([]);

  /**
   * Tracks the current 1-based frame index.
   * Written by the Lenis scroll handler; read by img.onload callbacks
   * so they can self-correct if the user is parked on their frame.
   */
  const currentFrameRef = useRef(1);

  /** RAF handle — cancelled before every new draw to prevent pile-up */
  const rafRef = useRef<number>(0);

  // ── renderFrame ─────────────────────────────────────────────────────────────
  const renderFrame = useCallback((index: number) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const clamped = Math.max(1, Math.min(TOTAL_FRAMES, index));
      const img     = framesRef.current[clamped - 1];

      // Guard: only draw once the image has fully decoded
      if (!img || !img.complete || img.naturalWidth === 0) return;
      drawCover(ctx, img, canvas.width, canvas.height);
    });
  }, []);

  // ── Lenis scroll → frame index ───────────────────────────────────────────────
  //
  // Why useLenis instead of GSAP ScrollTrigger?
  //
  // GSAP ScrollTrigger reads native scroll on its own RAF; Lenis updates the
  // virtual scroll position on a separate RAF.  When they're not in sync,
  // ScrollTrigger sees the scroll jump from 0 → max in a single tick → only
  // frame 1 and frame 95 ever render.
  //
  // useLenis() fires synchronously inside Lenis's own tick, so we always get
  // the smoothly-interpolated scroll value with zero lag or drift.
  useLenis(({ scroll }: { scroll: number }) => {
    if (!isEntered || !wrapperRef.current) return;

    // wrapperRef.top (document-relative) = distance from page top to hero start
    const wrapperTop   = wrapperRef.current.offsetTop;
    const scrolledIn   = scroll - wrapperTop;                 // px scrolled past hero top
    const progress     = Math.max(0, Math.min(1, scrolledIn / EXTRA_SCROLL));
    const frameIndex   = Math.round(progress * (TOTAL_FRAMES - 1)) + 1;

    currentFrameRef.current = frameIndex;
    renderFrame(frameIndex);
  });

  // ── Scroll-restoration fix (runs once on mount) ──────────────────────────────
  //
  // Without this, Chrome/Safari restore the user's previous scroll position on
  // page refresh.  If the user refreshed mid-hero, the browser would place them
  // at e.g. scroll 3000 px — the canvas and GSAP would both start from frame ~57
  // instead of frame 1.
  //
  // history.scrollRestoration = 'manual'  →  browser hands scroll control to JS
  // window.scrollTo(0, 0)                 →  guarantee viewport at absolute top
  //
  // This must run BEFORE the canvas useEffect and before GSAP context so that
  // all trigger start/end measurements are taken from scroll position 0.
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
  }, []); // ← empty deps: fires once, immediately after first paint

  // ── Canvas sizing + image preloading ─────────────────────────────────────────
  useEffect(() => {

    if (!isEntered) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas resolution to match the physical viewport
    const syncSize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      // Repaint after resize so nothing is left stretched
      renderFrame(currentFrameRef.current);
    };
    syncSize();
    window.addEventListener("resize", syncSize);

    // ── Preload all 95 frames ─────────────────────────────────────────────────
    //
    // Build every Image object synchronously and push to the array first,
    // then set src.  This means framesRef.current[n] is never null — GSAP (or
    // useLenis) can index it at any time.  img.complete handles the "not yet
    // downloaded" case in renderFrame.
    //
    // Each onload checks: if the user is currently parked on *this* frame
    // (currentFrameRef.current === i), re-render immediately to fill the gap
    // that occurred when renderFrame was called before the download finished.
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/hero/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

      img.onload = () => {
        if (i === 1) {
          renderFrame(1);   // always paint the first frame when ready
        } else if (currentFrameRef.current === i) {
          renderFrame(i);   // self-correct if user is parked on this frame
        }
      };

      images.push(img);
    }

    framesRef.current = images;

    // If frame 1 was already in the browser cache, onload won't fire again
    if (images[0].complete) renderFrame(1);

    return () => {
      window.removeEventListener("resize", syncSize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isEntered, renderFrame]);

  // ── GSAP text-overlay timeline ────────────────────────────────────────────────
  //
  // Frame rendering stays in useLenis (avoids GSAP ↔ Lenis RAF desync).
  // This separate effect uses GSAP ScrollTrigger ONLY for the text overlay,
  // which doesn't need per-frame precision — just a smooth fade-in at 25–45%.
  //
  // Math:
  //   wrapper offsetTop ≈ 0  (hero is first element; PreLoader is fixed)
  //   EXTRA_SCROLL = 5000 px  (full sequence scroll distance)
  //   25% → 1250 px  |  45% → 2250 px
  //   GSAP start: "top+=1250 top" = scroll position 1250
  //   GSAP end:   "top+=2250 top" = scroll position 2250
  useEffect(() => {
    if (!isEntered) return;
    if (!textRef.current || !wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial hidden state immediately (no flash)
      gsap.set(textRef.current, { opacity: 0, y: 50 });

      // Timeline linked to scroll — reveal text at 25%–45% of the sequence
      gsap
        .timeline({
          scrollTrigger: {
            trigger:    wrapperRef.current,
            // "top+=N top" = scroll position N (since wrapper starts at page top)
            start:      `top+=${Math.round(EXTRA_SCROLL * 0.25)} top`,
            end:        `top+=${Math.round(EXTRA_SCROLL * 0.45)} top`,
            scrub:      1,   // 1 s lag — smooth, eased follow
          },
        })
        .to(textRef.current, {
          opacity:  1,
          y:        0,
          duration: 1,
          ease:     "power2.out",
        });
    });

    // React 18 safe: ctx.revert() kills all tweens + ScrollTriggers in scope
    return () => ctx.revert();
  }, [isEntered]);

  // ────────────────────────────────────────────────────────────────────────────
  return (
    /**
     * Wrapper div creates the extra scroll real-estate.
     * height = 100vh  (the visible hero)  +  EXTRA_SCROLL px
     *
     * The inner <section> uses CSS sticky so it stays fixed to the top of
     * the viewport while the wrapper scrolls behind it — no GSAP pin needed.
     */
    <div
      ref={wrapperRef}
      style={{ height: `calc(100vh + ${EXTRA_SCROLL}px)` }}
    >
      <section
        className="sticky top-0 w-full h-screen overflow-hidden bg-black"
        aria-label="Scroll-driven hero image sequence"
      >
        {/* Full-screen canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        {/*
          Text overlay — sits above the canvas (z-20).
          Always in the DOM so textRef is always valid.
          GSAP sets opacity: 0 immediately and reveals it at 25 % scroll.
        */}
        <div
          ref={textRef}
          className="absolute bottom-10 left-10 flex flex-col items-start pointer-events-none z-20"
          style={{ opacity: 0 }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white text-left leading-none tracking-tighter uppercase">
            DILSHAN
            <br />
            WIJESINGHE
          </h1>
          <p className="mt-4 text-xs md:text-base tracking-[0.45em] text-gray-400 uppercase font-light">
            Creative Multitalent Designer
          </p>
        </div>

        {/* Scroll nudge */}
        {isEntered && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-10">
            <span className="text-[9px] font-mono tracking-[0.5em] text-white/25 uppercase">
              Scroll
            </span>
            <svg
              className="w-4 h-4 text-white/20 animate-bounce"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </section>
    </div>
  );
}
