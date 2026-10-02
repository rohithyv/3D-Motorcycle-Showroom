/** Deterministic fictional product data. Units: miles, seconds, mph, minutes, kg, USD. */
export const colors = [
  { name: "Obsidian Black", value: "#252826" },
  { name: "Titanium Silver", value: "#999e98" },
  { name: "Signal Red", value: "#ad352f" },
  { name: "Arctic White", value: "#e3e5df" },
] as const;
export const options = {
  wheels: ["Street", "Forged", "Carbon"],
  seat: ["Technical Fabric", "Alcantara", "Leather"],
  battery: ["Standard", "Long Range", "Performance"],
  lighting: ["Standard", "Adaptive", "Night Pack"],
  mode: ["Eco", "Street", "Sport"],
} as const;
export type Configuration = {
  color: string;
  wheels: (typeof options.wheels)[number];
  seat: (typeof options.seat)[number];
  battery: (typeof options.battery)[number];
  lighting: (typeof options.lighting)[number];
  mode: (typeof options.mode)[number];
};
export const defaults: Configuration = {
  color: colors[0].value,
  wheels: "Street",
  seat: "Technical Fabric",
  battery: "Standard",
  lighting: "Standard",
  mode: "Street",
};
export const labels = {
  color: "Body color",
  wheels: "Wheels",
  seat: "Seat material",
  battery: "Battery",
  lighting: "Lighting",
  mode: "Ride mode",
};
export const steps = [
  "color",
  "wheels",
  "seat",
  "battery",
  "lighting",
  "mode",
] as const;
export type ConfigKey = (typeof steps)[number];
const batterySpecs = {
  Standard: {
    range: 0,
    acceleration: 0,
    price: 0,
    weight: 0,
    charge: 38,
    speed: 0,
  },
  "Long Range": {
    range: 60,
    acceleration: 0.1,
    price: 2800,
    weight: 25,
    charge: 44,
    speed: 0,
  },
  Performance: {
    range: -12,
    acceleration: -0.4,
    price: 3400,
    weight: 6,
    charge: 32,
    speed: 6,
  },
};
const wheelSpecs = {
  Street: { range: 0, acceleration: 0, weight: 0, price: 0 },
  Forged: { range: 2, acceleration: 0, weight: -3, price: 950 },
  Carbon: { range: 4, acceleration: -0.1, weight: -7, price: 1800 },
};
export function getSpecs(c: Configuration) {
  const battery = batterySpecs[c.battery];
  const wheel = wheelSpecs[c.wheels];
  return {
    range:
      168 +
      battery.range +
      wheel.range +
      (c.mode === "Eco" ? 22 : c.mode === "Sport" ? -18 : 0),
    acceleration: Number(
      (
        3.1 +
        battery.acceleration +
        wheel.acceleration +
        (c.mode === "Eco" ? 1 : c.mode === "Sport" ? -0.2 : 0)
      ).toFixed(1),
    ),
    topSpeed:
      c.mode === "Eco"
        ? 92
        : 124 + battery.speed + (c.mode === "Sport" ? 4 : 0),
    charge: battery.charge,
    weight: 213 + battery.weight + wheel.weight,
    price:
      18900 +
      battery.price +
      wheel.price +
      (c.seat === "Alcantara" ? 350 : c.seat === "Leather" ? 500 : 0) +
      (c.lighting === "Adaptive" ? 450 : c.lighting === "Night Pack" ? 850 : 0),
  };
}
export function sanitizeConfiguration(input: unknown): Configuration {
  const result = { ...defaults };
  if (!input || typeof input !== "object") return result;
  const values = input as Record<string, unknown>;
  if (colors.some((c) => c.value === values.color))
    result.color = values.color as string;
  for (const key of Object.keys(options) as Array<keyof typeof options>) {
    if ((options[key] as readonly unknown[]).includes(values[key]))
      Object.assign(result, { [key]: values[key] });
  }
  return result;
}
export function serializeConfiguration(c: Configuration) {
  return new URLSearchParams(steps.map((key) => [key, c[key]])).toString();
}
export function parseConfiguration(query: string) {
  return sanitizeConfiguration(Object.fromEntries(new URLSearchParams(query)));
}
export const currency = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
export const configurationSummary = (c: Configuration) =>
  `${colors.find((color) => color.value === c.color)?.name} · ${c.wheels} wheels · ${c.seat} seat · ${c.battery} battery · ${c.lighting} lighting · ${c.mode} mode`;
