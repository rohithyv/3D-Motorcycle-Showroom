"use client";
import { useEffect, useRef, useState } from "react";
/** No synthesized substitute: supply a licensed audio URL to enable sound. */
export function useRideAudio(source: string | null = null) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!source) return;
    audio.current = new Audio(source);
    audio.current.loop = true;
    audio.current.volume = 0.15;
    return () => {
      audio.current?.pause();
      audio.current = null;
    };
  }, [source]);
  async function toggle() {
    if (!audio.current) return;
    if (muted) {
      try {
        await audio.current.play();
        setMuted(false);
      } catch {
        setError(
          "Audio could not start. The ride remains available without sound.",
        );
      }
    } else {
      audio.current.pause();
      setMuted(true);
    }
  }
  function stop() {
    audio.current?.pause();
    setMuted(true);
  }
  return { available: Boolean(source), muted, toggle, stop, error };
}
