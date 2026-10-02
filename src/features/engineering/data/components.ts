import type { Part } from "@/features/motorcycle/types";
export const components: {
  id: Part;
  label: string;
  description: string;
  detail: string;
  position: [number, number, number];
}[] = [
  {
    id: "Battery",
    label: "Battery",
    description:
      "A modular power core designed around serviceability. Separate housing, energy modules, cooling plate and controller keep each system accessible.",
    detail: "Modular architecture / liquid cooling",
    position: [0, 0.25, 1],
  },
  {
    id: "Motor",
    label: "Motor",
    description:
      "A compact permanent-magnet motor places its mass low in the chassis. Immediate response, without a gearbox interrupting the connection.",
    detail: "Direct response / single-speed drive",
    position: [-0.75, 0.1, 0.4],
  },
  {
    id: "Frame",
    label: "Frame",
    description:
      "An aluminum perimeter structure carries loads around the battery. Fewer interfaces create a direct, deliberate connection between rider and road.",
    detail: "Aluminum perimeter / central mass",
    position: [0, 0.6, 0],
  },
  {
    id: "FrontFork",
    label: "Front suspension",
    description:
      "An inverted fork separates precise steering control from road feedback. Adjustable damping keeps the front end composed.",
    detail: "Inverted fork / adjustable damping",
    position: [1.55, 0.7, 0.25],
  },
  {
    id: "RearSuspension",
    label: "Rear suspension",
    description:
      "A centrally positioned monoshock works with the aluminum swingarm to provide progressive, predictable support.",
    detail: "Progressive linkage / monoshock",
    position: [-1, 0.65, 0.3],
  },
  {
    id: "Brakes",
    label: "Brakes",
    description:
      "Dual front discs and regenerative deceleration work together. Mechanical braking remains independent of the energy recovery system.",
    detail: "Dual disc / blended regeneration",
    position: [1.8, -0.05, 0.4],
  },
  {
    id: "Headlight",
    label: "Lighting",
    description:
      "A slim LED signature opens into a focused nighttime beam. Adaptive and Night Pack options change output and accent illumination.",
    detail: "LED signature / adaptive options",
    position: [1.4, 1.05, 0],
  },
];
