import { describe, it, expect } from "vitest";
import {
  defaults,
  getSpecs,
  parseConfiguration,
  serializeConfiguration,
  sanitizeConfiguration,
  options,
  colors,
} from "../src/features/configurator/config/domain";
import { energySequence } from "../src/features/motorcycle/animation/timeline";
import { readFileSync } from "node:fs";
describe("fictional configuration domain", () => {
  it("defines the stated baseline with explicit imperial units", () => {
    expect(getSpecs(defaults)).toEqual({
      range: 168,
      acceleration: 3.1,
      topSpeed: 124,
      charge: 38,
      weight: 213,
      price: 18900,
    });
  });
  it("trades range, acceleration and weight deliberately", () => {
    const base = getSpecs(defaults);
    const long = getSpecs({ ...defaults, battery: "Long Range" });
    const sport = getSpecs({ ...defaults, battery: "Performance" });
    const carbon = getSpecs({ ...defaults, wheels: "Carbon" });
    expect(long.range).toBeGreaterThan(base.range);
    expect(sport.range).toBeLessThan(base.range);
    expect(sport.acceleration).toBeLessThan(base.acceleration);
    expect(carbon.weight).toBeLessThan(base.weight);
    expect(carbon.price).toBe(base.price + 1800);
  });
  it("keeps every supported combination finite and deterministic", () => {
    for (const battery of options.battery)
      for (const wheels of options.wheels)
        for (const mode of options.mode)
          for (const seat of options.seat)
            for (const lighting of options.lighting) {
              const c = { ...defaults, battery, wheels, mode, seat, lighting };
              const a = getSpecs(c);
              expect(a).toEqual(getSpecs(c));
              expect(
                Object.values(a).every((n) => Number.isFinite(n) && n > 0),
              ).toBe(true);
            }
  });
  it("round trips links and rejects untrusted values", () => {
    const c = {
      ...defaults,
      color: colors[2].value,
      battery: "Long Range" as const,
      mode: "Sport" as const,
    };
    expect(parseConfiguration(serializeConfiguration(c))).toEqual(c);
    expect(
      parseConfiguration("color=red&wheels=script&battery=unknown&price=0"),
    ).toEqual(defaults);
    expect(sanitizeConfiguration(null)).toEqual(defaults);
    expect(sanitizeConfiguration({ wheels: 1 })).toEqual(defaults);
  });
  it("extracts, separates and reconstructs the energy system", () => {
    expect(energySequence(0).extract).toBe(0);
    expect(energySequence(0.6).extract).toBe(1);
    expect(energySequence(0.6).explode).toBe(1);
    expect(energySequence(1).extract).toBe(0);
    expect(energySequence(1).explode).toBe(0);
  });
  it("ships the named model contract", () => {
    const glb = readFileSync("public/models/volt-r1.glb");
    expect(glb.readUInt32LE(0)).toBe(0x46546c67);
    expect(glb.readUInt32LE(8)).toBe(glb.length);
    const data = JSON.parse(
      glb.subarray(20, 20 + glb.readUInt32LE(12)).toString(),
    );
    for (const name of [
      "Bike",
      "Frame",
      "TankCover",
      "FrontFairing",
      "RearFairing",
      "Battery",
      "Motor",
      "FrontWheel",
      "RearWheel",
      "Seat",
      "FrontFork",
      "RearSuspension",
      "Headlight",
      "TailLight",
      "Display",
      "Accessories",
      "BatteryHousing",
      "BatteryModules",
      "BatteryCooling",
      "BatteryController",
    ])
      expect(
        data.nodes.some((n: { name: string }) => n.name === name),
        name,
      ).toBe(true);
  });
});
