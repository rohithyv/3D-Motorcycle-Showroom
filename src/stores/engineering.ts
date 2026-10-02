import { create } from "zustand";
import type { Part } from "@/features/motorcycle/types";
export const useEngineering = create<{
  selected: Part | null;
  exploded: boolean;
  select: (part: Part | null) => void;
  setExploded: (value: boolean) => void;
  reset: () => void;
}>((set) => ({
  selected: null,
  exploded: true,
  select: (selected) => set({ selected }),
  setExploded: (exploded) => set({ exploded, selected: null }),
  reset: () => set({ selected: null, exploded: true }),
}));
