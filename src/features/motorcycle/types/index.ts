export type Chapter =
  "hero" | "performance" | "energy" | "engineering" | "configurator" | "ride";
export type Part =
  | "Battery"
  | "Motor"
  | "Frame"
  | "FrontFork"
  | "RearSuspension"
  | "Brakes"
  | "Headlight";
export type ModelProps = {
  chapter: Chapter;
  reduced: boolean;
  onReady?: () => void;
};
