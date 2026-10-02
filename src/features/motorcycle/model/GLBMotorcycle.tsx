"use client";
import { useGLTF } from "@react-three/drei";
import { AnimatedMotorcycle } from "./AnimatedMotorcycle";
import type { ModelProps } from "../types";
export const MODEL_URL = "/models/volt-r1.glb";
export function preloadMotorcycle() {
  useGLTF.preload(MODEL_URL, "/draco/", true);
}
export function GLBMotorcycle(props: ModelProps) {
  const { scene } = useGLTF(MODEL_URL, "/draco/", true);
  return <AnimatedMotorcycle {...props} source={scene} />;
}
