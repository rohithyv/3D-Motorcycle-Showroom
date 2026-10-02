"use client";
import { useEffect, useMemo } from "react";
import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  TorusGeometry,
} from "three";
import { AnimatedMotorcycle } from "./AnimatedMotorcycle";
import type { ModelProps } from "../types";
/** Isolated emergency model. Shares named parts and animation API with the GLB. */
export function ProceduralMotorcycle(props: ModelProps) {
  const bike = useMemo(() => {
    const root = new Group();
    root.name = "Bike";
    const add = (
      name: string,
      position: [number, number, number],
      size: [number, number, number],
      color: string,
    ) => {
      const g = new Group();
      g.name = name;
      g.position.set(...position);
      const mesh = new Mesh(
        new BoxGeometry(...size),
        new MeshStandardMaterial({ color, metalness: 0.65, roughness: 0.35 }),
      );
      mesh.name = name + "_Surface";
      g.add(mesh);
      root.add(g);
      return g;
    };
    add("Frame", [0, 1, 0], [1.8, 0.12, 0.4], "#70776b");
    add("TankCover", [0, 1.6, 0], [1.1, 0.38, 0.6], "#90958e");
    add("RearFairing", [-1, 1.5, 0], [0.9, 0.12, 0.4], "#90958e");
    add("FrontFairing", [0.7, 1.5, 0], [0.25, 0.4, 0.5], "#90958e");
    add("Seat", [-0.85, 1.7, 0], [0.8, 0.12, 0.45], "#262626");
    add("Battery", [0, 0.95, 0], [1.1, 0.6, 0.5], "#292d26");
    add("Motor", [-0.7, 0.65, 0], [0.3, 0.3, 0.35], "#555b50");
    add("FrontFork", [1.15, 1.1, 0], [0.1, 1, 0.3], "#989e94");
    add("RearSuspension", [-0.95, 1.1, 0], [0.13, 0.5, 0.13], "#727963");
    add("Headlight", [1.25, 1.65, 0], [0.08, 0.09, 0.4], "#d6f590");
    add("TailLight", [-1.5, 1.5, 0], [0.05, 0.05, 0.3], "#e33d28");
    add("Display", [0.8, 1.9, 0], [0.2, 0.02, 0.2], "#17261e");
    add("Brakes", [1.35, 0.68, 0.2], [0.12, 0.2, 0.1], "#888b7e");
    for (const [name, x] of [
      ["FrontWheel", 1.35],
      ["RearWheel", -1.35],
    ] as const) {
      const g = new Group();
      g.name = name;
      g.position.set(x, 0.68, 0);
      const tire = new Mesh(
        new TorusGeometry(0.5, 0.16, 12, 48),
        new MeshStandardMaterial({ color: "#151714", roughness: 0.9 }),
      );
      g.add(tire);
      const rim = new Mesh(
        new CylinderGeometry(0.38, 0.38, 0.12, 24),
        new MeshStandardMaterial({ color: "#565d50", metalness: 0.8 }),
      );
      rim.name = "Rim";
      rim.rotation.x = Math.PI / 2;
      g.add(rim);
      root.add(g);
    }
    return root;
  }, []);
  useEffect(
    () => () => {
      bike.traverse((node) => {
        if (node instanceof Mesh) {
          node.geometry.dispose();
          const materials = Array.isArray(node.material)
            ? node.material
            : [node.material];
          materials.forEach((material) => material.dispose());
        }
      });
    },
    [bike],
  );
  return <AnimatedMotorcycle {...props} source={bike} />;
}
