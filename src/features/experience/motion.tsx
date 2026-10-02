"use client";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { choreography } from "@/features/motorcycle/animation/timeline";
import type { Chapter } from "@/features/motorcycle/types";
import { useExperience } from "@/stores/experience";
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
// Legacy export remains while external model integrations migrate to chapter timelines.
export const sceneProgress = { value: 0, explode: 0 };
export const chapters: { key: Chapter; id: string; label: string }[] = [
  { key: "hero", id: "awakening", label: "Awakening" },
  { key: "performance", id: "performance", label: "Performance" },
  { key: "energy", id: "battery", label: "Energy" },
  { key: "engineering", id: "engineering", label: "Engineering" },
  { key: "configurator", id: "configurator", label: "Build your R1" },
  { key: "ride", id: "ride", label: "The ride" },
];
export function Motion() {
  const reduced = useReducedMotion();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = reduced
      ? null
      : new Lenis({ duration: 0.85, smoothWheel: true, anchors: true });
    const tick = (time: number) => {
      if (document.visibilityState === "visible") lenis?.raf(time * 1000);
    };
    lenis?.on("scroll", ScrollTrigger.update);
    if (lenis) gsap.ticker.add(tick);
    const ctx = gsap.context(() => {
      for (const chapter of chapters) {
        if (!document.getElementById(chapter.id)) continue;
        ScrollTrigger.create({
          trigger: `#${chapter.id}`,
          start: "top center",
          end: "bottom center",
          onEnter: () => useExperience.getState().setChapter(chapter.key),
          onEnterBack: () => useExperience.getState().setChapter(chapter.key),
        });
        if (!reduced)
          gsap.to(choreography, {
            [chapter.key]: 1,
            ease: "none",
            scrollTrigger: {
              trigger: `#${chapter.id}`,
              start: "top 65%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          });
      }
      if (!reduced)
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 22,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          }),
        );
    });
    const visibility = () => {
      if (document.hidden) lenis?.stop();
      else {
        lenis?.start();
        ScrollTrigger.refresh();
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      ctx.revert();
      lenis?.destroy();
      gsap.ticker.remove(tick);
      document.removeEventListener("visibilitychange", visibility);
      for (const key of Object.keys(choreography) as Chapter[])
        choreography[key] = 0;
    };
  }, [reduced]);
  return null;
}
