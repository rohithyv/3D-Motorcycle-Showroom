"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { cameraPresets, type CameraPose } from "./presets";
import { choreography } from "../animation/timeline";
import type { Chapter } from "../types";
import { useEngineering } from "@/stores/engineering";
import { components } from "@/features/engineering/data/components";
import { useExperience } from "@/stores/experience";
import { useDeveloper } from "@/stores/developer";
export function CameraRig({
  chapter,
  reduced,
  mobile,
}: {
  chapter: Chapter;
  reduced: boolean;
  mobile: boolean;
}) {
  const look = useRef(new Vector3(0, 0.4, 0));
  const elapsed = useRef(0);
  const targetMarker = useRef<import("three").Mesh>(null);
  const vectors = useRef({
    position: new Vector3(),
    target: new Vector3(),
    end: new Vector3(),
    offset: new Vector3(1.6, 1, 3.8),
  });
  useFrame(({ camera, pointer }, dt) => {
    const delta = Math.min(dt, 0.05);
    elapsed.current += delta;
    const p = choreography[chapter];
    let pose: CameraPose = cameraPresets.hero;
    let end: CameraPose | undefined;
    let blend = 0;
    if (chapter === "hero") {
      pose = cameraPresets.hero;
    }
    if (chapter === "performance") {
      const stops = [
        cameraPresets.frontWheel,
        cameraPresets.rearWheel,
        cameraPresets.body,
      ];
      const t = Math.min(p * 2, 1.999);
      pose = stops[Math.floor(t)];
      end = stops[Math.floor(t) + 1];
      blend = t % 1;
    }
    if (chapter === "energy") pose = cameraPresets.battery;
    if (chapter === "engineering") pose = cameraPresets.exploded;
    if (chapter === "ride")
      pose = useExperience.getState().riding
        ? cameraPresets.nightRide
        : cameraPresets.hero;
    vectors.current.position.set(...pose.position);
    vectors.current.target.set(...pose.target);
    if (end) {
      vectors.current.position.lerp(
        vectors.current.end.set(...end.position),
        blend,
      );
      vectors.current.target.lerp(
        vectors.current.end.set(...end.target),
        blend,
      );
    }
    const selected =
      chapter === "engineering" ? useEngineering.getState().selected : null;
    if (selected) {
      const part = components.find((c) => c.id === selected)!;
      vectors.current.target.set(...part.position);
      vectors.current.position
        .copy(vectors.current.target)
        .add(vectors.current.offset);
    }
    if (chapter === "hero" && !reduced && !mobile) {
      vectors.current.position.z += Math.max(0, 1 - elapsed.current / 3) * 1.8;
      vectors.current.position.x += pointer.x * 0.16;
      vectors.current.position.y += pointer.y * 0.08;
    }
    if (mobile) {
      vectors.current.position.multiplyScalar(1.2);
    }
    const amount = reduced ? 1 : 1 - Math.exp(-delta * 3);
    camera.position.lerp(vectors.current.position, amount);
    look.current.lerp(vectors.current.target, amount);
    camera.lookAt(look.current);
    if (camera instanceof PerspectiveCamera) {
      camera.fov = MathUtils.lerp(camera.fov, pose.fov, amount);
      camera.updateProjectionMatrix();
    }
    targetMarker.current?.position.copy(look.current);
  });
  const debug = useDeveloper((s) => s.enabled && s.target);
  return debug ? (
    <mesh ref={targetMarker}>
      <sphereGeometry args={[0.045, 10, 10]} />
      <meshBasicMaterial color="#d6f590" depthTest={false} />
    </mesh>
  ) : null;
}
