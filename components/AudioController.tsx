"use client";

import { useScrollAudio } from "@/hooks/useScrollAudio";

/**
 * AudioController
 *
 * A zero-render client component whose sole purpose is to mount
 * the useScrollAudio hook into the React tree. Placed in the root
 * layout so the audio logic is available on every page.
 */
export default function AudioController() {
  useScrollAudio();
  return null;
}
