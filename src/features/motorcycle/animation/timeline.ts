import type { Chapter } from "../types";
// Mutable frame data intentionally bypasses React: scroll updates never re-render the page.
export const choreography: Record<Chapter, number> = {
  hero: 0,
  performance: 0,
  energy: 0,
  engineering: 0,
  configurator: 0,
  ride: 0,
};
export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export function energySequence(progress: number) {
  const out =
    smoothstep(0.05, 0.35, progress) * (1 - smoothstep(0.78, 1, progress));
  return {
    extract: out,
    explode:
      smoothstep(0.3, 0.6, progress) * (1 - smoothstep(0.7, 0.94, progress)),
    rotate: smoothstep(0.3, 0.7, progress) * Math.PI * 0.35,
  };
}
