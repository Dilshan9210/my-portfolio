"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode } from "react";
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

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, syncTouch: true }}>
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
