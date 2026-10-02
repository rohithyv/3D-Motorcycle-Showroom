"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Chapter } from "./types";
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <span className="viewport-loading">Preparing your perspective…</span>
  ),
});
export function Viewport({
  interactive = false,
  exploded = false,
  hero = false,
  chapter,
}: {
  interactive?: boolean;
  exploded?: boolean;
  hero?: boolean;
  chapter?: Chapter;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mobile, setMobile] = useState(true);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = matchMedia("(max-width: 767px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting && !query.matches) {
          // Warm the shared GLTF cache only near a desktop viewport. Mobile remains opt-in.
          void import("./model/GLBMotorcycle").then((module) =>
            module.preloadMotorcycle(),
          );
        }
      },
      { rootMargin: "180px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      query.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);
  return (
    <div ref={ref} className={`viewport ${hero ? "hero-viewport" : ""}`}>
      {visible && (!mobile || enabled) ? (
        <Scene
          interactive={interactive}
          chapter={
            chapter ??
            (exploded ? "engineering" : interactive ? "configurator" : "hero")
          }
          mobile={mobile}
        />
      ) : (
        <div className="scene-fallback">
          <Image
            src="/motorcycle.svg"
            width={1200}
            height={650}
            alt="VOLT R1 concept motorcycle, side profile"
            priority={hero}
          />
          {mobile && (
            <button className="mobile-3d" onClick={() => setEnabled(true)}>
              Explore in 3D <span>↗</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
