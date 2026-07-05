"use client";

import { useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";

/**
 * useScrollAudio
 *
 * Consumes the shared audio instance from AudioContext.
 * - Plays while the user is scrolling (fade-in to vol 1).
 * - Fades volume to 0 over 1 s then pauses when scrolling stops.
 * - Does nothing until isUnlocked === true (set by PreLoader's unlock()).
 */
export function useScrollAudio() {
  const { getAudio, isUnlocked } = useAudio();

  // Keep a ref so the scroll closure always sees the latest value
  const isUnlockedRef = useRef(isUnlocked);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPlayingRef = useRef(false);

  // Sync ref whenever context value changes
  useEffect(() => {
    isUnlockedRef.current = isUnlocked;
  }, [isUnlocked]);

  useEffect(() => {
    // ── Cancel any running fade ───────────────────────────────────────────────
    function cancelFade() {
      if (fadeIntervalRef.current !== null) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    }

    // ── Smooth volume transition over ~1 second ───────────────────────────────
    function fadeTo(target: number, onComplete?: () => void) {
      const audio = getAudio();
      cancelFade();

      const DURATION_MS = 1000;
      const TICK_MS = 30;
      const steps = DURATION_MS / TICK_MS;
      const delta = (target - audio.volume) / steps;

      fadeIntervalRef.current = setInterval(() => {
        const a = getAudio();
        const next = a.volume + delta;

        if ((delta > 0 && next >= target) || (delta < 0 && next <= target)) {
          a.volume = target;
          cancelFade();
          onComplete?.();
        } else {
          a.volume = Math.min(1, Math.max(0, next));
        }
      }, TICK_MS);
    }

    // ── Start playback with fade-in ───────────────────────────────────────────
    function startAudio() {
      if (!isUnlockedRef.current) return;
      if (isPlayingRef.current) return;

      isPlayingRef.current = true;
      const audio = getAudio();

      audio.play().catch((err) => {
        if (err instanceof DOMException) {
          console.log(
            `[useScrollAudio] play() rejected — ${err.name}: ${err.message}`
          );
        } else {
          console.log("[useScrollAudio] play() unexpected error:", err);
        }
        isPlayingRef.current = false;
      });

      fadeTo(1);
    }

    // ── Fade out then pause ───────────────────────────────────────────────────
    function stopAudio() {
      if (!isPlayingRef.current) return;

      fadeTo(0, () => {
        getAudio().pause();
        isPlayingRef.current = false;
        console.log("[useScrollAudio] Audio paused (scroll stopped).");
      });
    }

    // ── Scroll handler ────────────────────────────────────────────────────────
    function handleScroll() {
      if (!isUnlockedRef.current) return;

      if (scrollTimerRef.current !== null) clearTimeout(scrollTimerRef.current);

      startAudio();

      // Treat 200 ms of no scroll events as "scrolling stopped"
      scrollTimerRef.current = setTimeout(stopAudio, 200);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current !== null) clearTimeout(scrollTimerRef.current);
      cancelFade();
    };
  }, [getAudio]);
}
