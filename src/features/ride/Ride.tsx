"use client";
import { useEffect } from "react";
import { Viewport } from "@/features/motorcycle/Viewport";
import { useExperience } from "@/stores/experience";
import { useReducedMotion } from "@/features/experience/motion";
import { useRideAudio } from "./useRideAudio";
export function Ride() {
  const { riding, startRide, stopRide } = useExperience();
  const reduced = useReducedMotion();
  const sound = useRideAudio();
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) useExperience.getState().stopRide();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  return (
    <section
      className={`section ride-chapter ${riding ? "is-riding" : ""}`}
      id="ride"
    >
      <div className="ride-title">
        <span className="eyebrow">06 / THE RIDE</span>
        <h2>
          THE ROAD
          <br />
          <span>JUST CHANGED.</span>
        </h2>
      </div>
      <div className="ride-stage">
        <Viewport chapter="ride" />
      </div>
      <div className="ride-dashboard">
        <div className="ride-status" role="status">
          <i />
          <span>
            {riding
              ? reduced
                ? "R1 READY / STILL EXPERIENCE"
                : "R1 LIVE / FEEL THE CONNECTION"
              : "SYSTEM STANDBY / AWAITING RIDER"}
          </span>
        </div>
        <div className="ride-actions">
          <button
            className="button ride-start"
            aria-pressed={riding}
            onClick={() => {
              if (riding) {
                stopRide();
                sound.stop();
              } else startRide();
            }}
          >
            {riding ? "STOP R1" : "START R1"}
            <span>⏻</span>
          </button>
          <a className="button lime" href="#configurator">
            Build your R1 ↗
          </a>
          {sound.available && (
            <button
              className="sound-toggle"
              onClick={sound.toggle}
              aria-pressed={!sound.muted}
            >
              {sound.muted ? "Enable sound" : "Mute sound"}
            </button>
          )}
        </div>
        {sound.error && <p role="status">{sound.error}</p>}
        <p>
          {reduced
            ? "Reduced motion is on. Lighting and controls remain fully available."
            : "A cinematic impression of motion. Your next chapter begins here."}
        </p>
      </div>
    </section>
  );
}
