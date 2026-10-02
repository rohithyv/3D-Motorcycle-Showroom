import { create } from "zustand";
export const useEnvironment = create<{
  night: boolean;
  toggleNight: () => void;
}>((set) => ({
  night: false,
  toggleNight: () => set((s) => ({ night: !s.night })),
}));
