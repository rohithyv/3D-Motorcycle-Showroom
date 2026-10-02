"use client";
import Image from "next/image";
import {
  Suspense,
  useCallback,
  useRef,
  useState,
  Component,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import { MathUtils, type AmbientLight, type DirectionalLight } from "three";
import { MotorcycleModel } from "./model/MotorcycleModel";
import { CameraRig } from "./camera/CameraRig";
import { useEnvironment } from "@/stores/environment";
import { useExperience } from "@/stores/experience";
import { useDeveloper } from "@/stores/developer";
import { useReducedMotion } from "@/features/experience/motion";
import { usePageVisible } from "@/hooks/usePageVisible";
import type { Chapter } from "./types";
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback">
        <Image
          width={1200}
          height={650}
          src="/motorcycle.svg"
          alt="VOLT R1 side profile"
        />
        <p className="fallback-message">
          3D is unavailable on this device. All controls and specifications
          remain accessible.
        </p>
      </div>
    ) : (
      this.props.children
    );
  }
}
function StudioLights({
  chapter,
  reduced,
}: {
  chapter: Chapter;
  reduced: boolean;
}) {
  const ambient = useRef<AmbientLight>(null);
  const key = useRef<DirectionalLight>(null);
  const elapsed = useRef(0);
  useFrame(({ scene }, delta) => {
    const dt = Math.min(delta, 0.05);
    elapsed.current += dt;
    const dark = useEnvironment.getState().night || chapter === "ride";
    scene.environmentIntensity = MathUtils.damp(
      scene.environmentIntensity,
      dark ? 0.32 : 1,
      3,
      dt,
    );
    const intro =
      chapter === "hero" && !reduced
        ? MathUtils.smoothstep(elapsed.current, 0.5, 3)
        : 1;
    if (ambient.current)
      ambient.current.intensity = MathUtils.damp(
        ambient.current.intensity,
        (dark ? 0.12 : 0.65) * intro,
        3,
        dt,
      );
    if (key.current)
      key.current.intensity = MathUtils.damp(
        key.current.intensity,
        (dark ? 0.8 : 3) * intro,
        3,
        dt,
      );
  });
  return (
    <>
      <ambientLight ref={ambient} intensity={0.05} />
      <directionalLight
        ref={key}
        position={[3, 6, 4]}
        intensity={0.2}
        color="#f0f2e9"
      />
    </>
  );
}
function Runtime({
  onSlow,
  chapter,
}: {
  onSlow: () => void;
  chapter: Chapter;
}) {
  const frames = useRef(0);
  const elapsed = useRef(0);
  useFrame(({ gl }, delta) => {
    frames.current++;
    elapsed.current += delta;
    if (elapsed.current < 1) return;
    const fps = frames.current / elapsed.current;
    if (fps < 28) onSlow();
    if (
      useDeveloper.getState().enabled &&
      useExperience.getState().chapter === chapter
    )
      useDeveloper.getState().report({
        fps: Math.round(fps),
        triangles: gl.info.render.triangles,
        calls: gl.info.render.calls,
        textures: gl.info.memory.textures,
        dpr: gl.getPixelRatio(),
      });
    frames.current = 0;
    elapsed.current = 0;
  });
  return null;
}
function RideStreaks({
  reduced,
  mobile,
}: {
  reduced: boolean;
  mobile: boolean;
}) {
  const group = useRef<import("three").Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.visible = useExperience.getState().riding && !reduced;
    if (!group.current.visible) return;
    for (const mesh of group.current.children) {
      mesh.position.x -= Math.min(dt, 0.05) * 7;
      if (mesh.position.x < -7) mesh.position.x = 7;
    }
  });
  return (
    <group ref={group} visible={false}>
      {Array.from({ length: mobile ? 6 : 16 }, (_, i) => (
        <mesh
          key={i}
          position={[
            ((i * 1.7) % 14) - 7,
            -0.58 + (i % 4) * 0.36,
            -1.5 - (i % 3) * 1.2,
          ]}
        >
          <boxGeometry args={[0.7 + (i % 3) * 0.5, 0.008, 0.008]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#d6f590" : "#879b9c"}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
export default function Scene({
  interactive = false,
  chapter = "hero",
  mobile = false,
}: {
  interactive?: boolean;
  chapter?: Chapter;
  mobile?: boolean;
}) {
  const night = useEnvironment((s) => s.night);
  const visible = usePageVisible();
  const reduced = useReducedMotion();
  const [low, setLow] = useState(false);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFallback = useCallback(() => setFallback(true), []);
  const axes = useDeveloper((s) => s.enabled && s.axes);
  return (
    <SceneBoundary>
      <Canvas
        dpr={mobile || low ? 1 : 1.5}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [3, 1.9, 6.8], fov: 35 }}
        gl={{ antialias: !mobile, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor("#000000", 0)}
        aria-label="Interactive 3D VOLT R1 motorcycle"
      >
        <StudioLights chapter={chapter} reduced={reduced} />
        <Suspense fallback={null}>
          <Environment resolution={mobile || low ? 64 : 128}>
            <Lightformer
              intensity={3}
              position={[0, 5, -3]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[8, 3, 1]}
            />
            <Lightformer
              intensity={2}
              position={[-4, 2, 3]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[3, 5, 1]}
            />
            <Lightformer
              intensity={night ? 1.5 : 2}
              color={night ? "#748e9e" : "#d4ddc7"}
              position={[3, 1, -3]}
              scale={[3, 3, 1]}
            />
          </Environment>
          <MotorcycleModel
            chapter={chapter}
            reduced={reduced}
            onReady={onReady}
            onFallback={onFallback}
          />
          {!low && (
            <ContactShadows
              position={[0, -0.71, 0]}
              opacity={0.5}
              scale={12}
              blur={2.8}
              far={5}
              resolution={mobile ? 128 : 256}
              frames={mobile ? 1 : Infinity}
            />
          )}
        </Suspense>
        {interactive ? (
          <OrbitControls
            enablePan={false}
            minDistance={4.5}
            maxDistance={9}
            minPolarAngle={0.4}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0.4, 0]}
            enableDamping={!reduced}
            dampingFactor={0.07}
          />
        ) : (
          <CameraRig chapter={chapter} reduced={reduced} mobile={mobile} />
        )}{" "}
        {axes && <axesHelper args={[3]} />}{" "}
        {chapter === "ride" && (
          <RideStreaks reduced={reduced} mobile={mobile || low} />
        )}
        <Runtime chapter={chapter} onSlow={() => setLow(true)} />
      </Canvas>
      {!ready && (
        <div className="scene-loading" role="status">
          <span>V / R1</span>
          <i />
          <small>ESTABLISHING CONNECTION</small>
        </div>
      )}
      {fallback && (
        <p className="model-notice" role="status">
          Model unavailable. Showing the lightweight procedural R1.
        </p>
      )}
    </SceneBoundary>
  );
}
