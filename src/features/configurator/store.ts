import { create } from "zustand";
import {
  defaults,
  sanitizeConfiguration,
  type Configuration,
} from "./config/domain";
export * from "./config/domain";
type Store = Configuration & {
  set: <K extends keyof Configuration>(key: K, value: Configuration[K]) => void;
  restore: (input: unknown) => void;
  reset: () => void;
};
export const useConfigurator = create<Store>((set) => ({
  ...defaults,
  set: (key, value) => set({ [key]: value }),
  restore: (input) => set(sanitizeConfiguration(input)),
  reset: () => set(defaults),
}));
