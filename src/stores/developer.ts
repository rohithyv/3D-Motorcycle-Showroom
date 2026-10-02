import { create } from "zustand";
export type DebugFlag = "wireframe" | "axes" | "hotspots" | "target" | "stats";
export type RenderMetrics = {
  fps: number;
  triangles: number;
  calls: number;
  textures: number;
  dpr: number;
};
export const useDeveloper = create<{
  enabled: boolean;
  wireframe: boolean;
  axes: boolean;
  hotspots: boolean;
  target: boolean;
  stats: boolean;
  metrics: RenderMetrics | null;
  toggle: () => void;
  setFlag: (key: DebugFlag, value: boolean) => void;
  report: (metrics: RenderMetrics) => void;
}>((set) => ({
  enabled: false,
  wireframe: false,
  axes: false,
  hotspots: true,
  target: false,
  stats: true,
  metrics: null,
  toggle: () => set((s) => ({ enabled: !s.enabled })),
  setFlag: (key, value) => set({ [key]: value }),
  report: (metrics) => set({ metrics }),
}));
