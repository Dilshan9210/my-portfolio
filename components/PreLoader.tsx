"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";

interface PreLoaderProps {
  onEnter?: () => void;
}

export default function PreLoader({ onEnter }: PreLoaderProps) {
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const { unlock } = useAudio();

  // ── Body overflow lock ────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isEntered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEntered]);

  // ── Counter: counts 0 → 100 over 2 seconds ────────────────────────────────
  // No ref guard needed. React Strict Mode double-invokes effects intentionally;
  // cleanup clears the interval, and the second mount simply restarts it.
  useEffect(() => {
    let current = 0;
    const intervalTime = 20;           // tick every 20 ms
    const totalTicks = 2000 / intervalTime; // 100 ticks → 2 s total

    const timer = setInterval(() => {
      current += 1;
      setCount(current);

      if (current >= totalTicks) {
        clearInterval(timer);
        setIsLoaded(true);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {!isEntered && (
        <motion.div
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white select-none"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs tracking-[0.3em] text-neutral-400 font-mono"
            >
              INITIALIZING CREATIVE ENGINE...
            </motion.p>

            <div className="text-6xl font-bold font-mono tracking-tight md:text-8xl">
              {count}%
            </div>

            <div className="h-16 flex items-center justify-center">
              <AnimatePresence>
                {isLoaded && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onClick={async () => {
                      // unlock() calls audio.play()→pause() inside this user
                      // gesture, satisfying browser autoplay policy
                      await unlock();
                      setIsEntered(true);
                      onEnter?.(); // notify parent so HeroSection can start loading
                    }}
                    className="px-8 py-3 border border-white text-sm tracking-[0.2em] font-mono hover:bg-white hover:text-black transition-colors duration-300 rounded-none uppercase"
                  >
                    ENTER EXPERIENCE
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
