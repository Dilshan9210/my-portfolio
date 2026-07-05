"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once, globally — safe to call multiple times (GSAP is a no-op on re-register)
gsap.registerPlugin(ScrollTrigger);

/**
 * Inner component: must live INSIDE ReactLenis so useLenis() can reach the context.
 * Fires ScrollTrigger.update() on every Lenis scroll tick so GSAP's pinning and
 * scrubbing math uses Lenis's virtual scroll position, not raw DOM scroll.
 */
function LenisScrollTriggerBridge() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

/**
 * Ensures ScrollTrigger positions are recalculated AFTER all heavy resources
 * (images, videos, fonts, dynamic data) have fully loaded.
 *
 * Three layers of protection:
 * 1. `window load`  — fires when every sub-resource has finished downloading
 * 2. Fallback timer — catches edge-cases where `load` already fired before mount
 * 3. Resize observer — recalculates if any section changes height post-load
 */
function GlobalScrollTriggerRefresh() {
  useEffect(() => {
    // 1. Refresh when ALL resources (images, videos, fonts) finish loading
    const onWindowLoad = () => {
      // Double-rAF ensures the browser has painted at least once
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    };

    if (document.readyState === "complete") {
      onWindowLoad();
    } else {
      window.addEventListener("load", onWindowLoad);
    }

    // 2. Fallback: generous delay covers dynamic fetch + lazy media
    const fallback = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 3000);

    // 3. Watch for late layout shifts (e.g. images settling after decode)
    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });

    // Observe the main content wrapper (captures all child height changes)
    const main = document.querySelector("main");
    if (main) ro.observe(main);

    return () => {
      window.removeEventListener("load", onWindowLoad);
      clearTimeout(fallback);
      clearTimeout(resizeTimer);
      ro.disconnect();
    };
  }, []);

  return null;
}

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, syncTouch: true }}>
      <LenisScrollTriggerBridge />
      <GlobalScrollTriggerRefresh />
      {children}
    </ReactLenis>
  );
}
