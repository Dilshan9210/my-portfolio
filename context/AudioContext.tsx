"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AudioContextValue {
  /** Returns the shared Audio element, creating it lazily on first call. */
  getAudio: () => HTMLAudioElement;
  /** True once the user gesture has successfully unlocked the audio context. */
  isUnlocked: boolean;
  /**
   * Must be called inside a user-gesture handler (e.g. button click).
   * Plays then immediately pauses the audio to unlock the browser audio context,
   * satisfying the autoplay policy without audible sound at that moment.
   */
  unlock: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AudioCtx = createContext<AudioContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  /** Lazy initialiser — safe to call on every render, only creates once. */
  const getAudio = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      const a = new Audio("/background-music.mp3");
      a.loop = true;
      a.volume = 0;
      audioRef.current = a;
      console.log("[AudioContext] Audio element created.");
    }
    return audioRef.current;
  }, []);

  /**
   * Call this inside the "ENTER EXPERIENCE" button click handler.
   * play() → pause() is the standard trick to satisfy browser autoplay policy.
   */
  const unlock = useCallback(async () => {
    const audio = getAudio();

    try {
      console.log("[AudioContext] Attempting to unlock audio context...");
      await audio.play();   // requires a user gesture — succeeds here because
      audio.pause();        // we are inside a click handler
      audio.currentTime = 0;
      setIsUnlocked(true);
      console.log("[AudioContext] Audio context unlocked successfully ✓");
    } catch (err) {
      if (err instanceof DOMException) {
        console.log(
          `[AudioContext] unlock() rejected — ${err.name}: ${err.message}`
        );
      } else {
        console.log("[AudioContext] unlock() unexpected error:", err);
      }
    }
  }, [getAudio]);

  return (
    <AudioCtx.Provider value={{ getAudio, isUnlocked, unlock }}>
      {children}
    </AudioCtx.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error("useAudio() must be used within <AudioProvider>.");
  }
  return ctx;
}
