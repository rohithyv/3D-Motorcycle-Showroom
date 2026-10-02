import { create } from "zustand";
import type { Chapter } from "@/features/motorcycle/types";
type Experience = {
  chapter: Chapter;
  riding: boolean;
  batteryPhase: number | null;
  setBatteryPhase: (phase: number | null) => void;
  setChapter: (chapter: Chapter) => void;
  startRide: () => void;
  stopRide: () => void;
};
export const useExperience = create<Experience>((set) => ({
  chapter: "hero",
  riding: false,
  batteryPhase: null,
  setBatteryPhase: (batteryPhase) => set({ batteryPhase }),
  setChapter: (chapter) => set({ chapter }),
  startRide: () => set({ riding: true }),
  stopRide: () => set({ riding: false }),
}));
