"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  type Object3D,
} from "three";
import { useConfigurator } from "@/features/configurator/store";
import { useEnvironment } from "@/stores/environment";
import { useExperience } from "@/stores/experience";
import { useEngineering } from "@/stores/engineering";
import { useDeveloper } from "@/stores/developer";
import {
  choreography,
  energySequence,
  smoothstep,
} from "../animation/timeline";
import { optimizeTextures } from "@/lib/three/optimize";
import type { ModelProps } from "../types";
const offsets: Record<string, [number, number, number]> = {
  TankCover: [0, 0.65, 0],
  FrontFairing: [0.3, 0.1, 0.55],
  RearFairing: [-0.35, 0.3, 0],
  Seat: [-0.1, 0.9, 0],
  FrontWheel: [0.65, 0, 0],
  RearWheel: [-0.65, 0, 0],
  Battery: [0, -0.15, 0.8],
  Motor: [-0.5, -0.1, 0.3],
  FrontFork: [0.4, 0.25, 0],
  RearSuspension: [-0.3, 0.4, 0.2],
  Headlight: [0.55, 0.25, 0],
  TailLight: [-0.4, 0.15, 0],
  Display: [0, 0.4, 0],
  Brakes: [0.65, 0, 0.35],
};
const parts = [...Object.keys(offsets), "Frame"];
export function AnimatedMotorcycle({
  source,
  chapter,
  reduced,
  onReady,
}: ModelProps & { source: Object3D }) {
  const gl = useThree((s) => s.gl);
  const root = useRef<Group>(null);
  const elapsed = useRef(0);
  const spin = useRef(0);
  const currentColor = useMemo(() => new Color(), []);
  const wantedColor = useMemo(() => new Color(), []);
  const model = useMemo(() => {
    const clone = source.clone(true);
    clone.traverse((n) => {
      if (n instanceof Mesh) {
        n.material = Array.isArray(n.material)
          ? n.material.map((m) => m.clone())
          : n.material.clone();
        n.castShadow = false;
        n.receiveShadow = false;
      }
    });
    return clone;
  }, [source]);
  const nodes = useMemo(
    () =>
      parts.map((name) => ({
        name,
        node: model.getObjectByName(name),
        base: model.getObjectByName(name)?.position.clone() ?? new Vector3(),
      })),
    [model],
  );
  const materials = useMemo(() => {
    const list: {
      material: MeshStandardMaterial;
      name: string;
      part: string;
      base: Color;
      emissive: Color;
      strength: number;
    }[] = [];
    model.traverse((n) => {
      if (!(n instanceof Mesh)) return;
      let parent: Object3D | null = n;
      let part = "";
      while (parent) {
        if (parts.includes(parent.name)) {
          part = parent.name;
          break;
        }
        parent = parent.parent;
      }
      for (const m of Array.isArray(n.material) ? n.material : [n.material]) {
        if (m instanceof MeshStandardMaterial)
          list.push({
            material: m,
            name: n.name,
            part,
            base: m.color.clone(),
            emissive: m.emissive.clone(),
            strength: m.emissiveIntensity,
          });
      }
    });
    return list;
  }, [model]);
  useEffect(() => {
    optimizeTextures(model, gl, matchMedia("(max-width:767px)").matches);
    onReady?.();
    return () => {
      materials.forEach(({ material }) => material.dispose());
    };
  }, [model, gl, materials, onReady]);
  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    elapsed.current += dt;
    const c = useConfigurator.getState();
    const night = useEnvironment.getState().night;
    const riding = chapter === "ride" && useExperience.getState().riding;
    const engineering = useEngineering.getState();
    const selected = chapter === "engineering" ? engineering.selected : null;
    const debug = useDeveloper.getState();
    const intro =
      chapter === "hero" && !reduced
        ? smoothstep(0.4, 2.8, elapsed.current)
        : 1;
    const energy = energySequence(
      useExperience.getState().batteryPhase ??
        (reduced ? 0.55 : choreography.energy),
    );
    const explosion =
      chapter === "engineering" && engineering.exploded
        ? reduced
          ? 1
          : smoothstep(0, 0.3, choreography.engineering)
        : 0;
    const blend = reduced ? 1 : 1 - Math.exp(-dt * 5);
    materials.forEach(({ material, name, part, base, emissive, strength }) => {
      wantedColor.copy(base);
      if (
        name.startsWith("Body_") ||
        ["TankCover", "FrontFairing", "RearFairing"].includes(part)
      )
        wantedColor.set(c.color);
      if (/Rim|Spoke/.test(name))
        wantedColor.set(
          String(c.wheels) === "Carbon"
            ? "#171b18"
            : c.wheels === "Forged"
              ? "#a7aba5"
              : "#373c35",
        );
      if (part === "Seat") {
        wantedColor.set(
          String(c.seat) === "Leather"
            ? "#402e25"
            : c.seat === "Alcantara"
              ? "#625c4e"
              : "#252926",
        );
        material.roughness = MathUtils.lerp(
          material.roughness,
          String(c.seat) === "Leather" ? 0.42 : 0.9,
          blend,
        );
      }
      if (selected && part !== selected) wantedColor.multiplyScalar(0.27);
      currentColor.copy(material.color).lerp(wantedColor, blend);
      material.color.copy(currentColor);
      material.wireframe = debug.enabled && debug.wireframe;
      let intensity = strength;
      material.emissive.copy(emissive);
      if (part === "Headlight") {
        material.emissive.set("#d7efc5");
        intensity =
          (riding
            ? 10
            : night
              ? String(c.lighting) === "Night Pack"
                ? 9
                : c.lighting === "Adaptive"
                  ? 7
                  : 5
              : 0.35) * intro;
      }
      if (part === "TailLight") {
        material.emissive.set("#ff321c");
        intensity = riding ? 5 : night ? 3 : 0.2;
      }
      if (part === "Display") {
        material.emissive.set("#9ce5bb");
        intensity = riding ? 3 : night ? 1.5 : 0.1;
      }
      if (selected === part || (chapter === "energy" && part === "Battery")) {
        material.emissive.set("#748d4e");
        intensity = 0.3;
      }
      material.emissiveIntensity = MathUtils.lerp(
        material.emissiveIntensity,
        intensity,
        blend,
      );
    });
    nodes.forEach(({ name, node, base }) => {
      if (!node) return;
      const offset = offsets[name] ?? [0, 0, 0];
      const x = base.x + offset[0] * explosion;
      let y = base.y + offset[1] * explosion,
        z = base.z + offset[2] * explosion;
      if (chapter === "energy") {
        if (name === "Battery") {
          z += energy.extract * 1.2;
          y += energy.extract * 0.2;
          node.rotation.y = MathUtils.damp(
            node.rotation.y,
            energy.rotate * energy.extract,
            4,
            dt,
          );
        }
        if (["TankCover", "Seat", "FrontFairing"].includes(name)) {
          y += energy.extract * 0.45;
          z += energy.extract * 0.18;
        }
      }
      node.position.x = MathUtils.lerp(node.position.x, x, blend);
      node.position.y = MathUtils.lerp(node.position.y, y, blend);
      node.position.z = MathUtils.lerp(node.position.z, z, blend);
      if (name === "Battery")
        node.scale.z = MathUtils.damp(
          node.scale.z,
          String(c.battery) === "Long Range"
            ? 1.18
            : String(c.battery) === "Performance"
              ? 1.08
              : 1,
          5,
          dt,
        );
    });
    for (const [name, offset] of [
      ["BatteryHousing", -0.38],
      ["BatteryModules", 0.05],
      ["BatteryCooling", -0.12],
      ["BatteryController", 0.65],
    ] as const) {
      const n = model.getObjectByName(name);
      if (n)
        n.position.y = MathUtils.lerp(
          n.position.y,
          chapter === "energy" ? energy.explode * offset : 0,
          blend,
        );
    }
    if (!reduced) {
      spin.current +=
        dt *
        (riding
          ? 13
          : chapter === "performance"
            ? choreography.performance * 1.4
            : 0);
      for (const name of ["FrontWheel", "RearWheel"]) {
        const wheel = model.getObjectByName(name);
        if (wheel) wheel.rotation.z = -spin.current;
      }
    }
    if (root.current) {
      root.current.rotation.y = MathUtils.damp(
        root.current.rotation.y,
        chapter === "performance"
          ? -0.15 + choreography.performance * 0.4
          : -0.12,
        3,
        dt,
      );
      root.current.position.y =
        -0.72 +
        (reduced
          ? 0
          : Math.sin(elapsed.current * (riding ? 45 : 0.8)) *
            (riding ? 0.003 : 0.003));
    }
  });
  return (
    <group ref={root} position={[0, -0.72, 0]} dispose={null}>
      <primitive object={model} />
    </group>
  );
}
