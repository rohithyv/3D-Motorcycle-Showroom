"use client";
import { Viewport } from "@/features/motorcycle/Viewport";
import { useEnvironment } from "@/stores/environment";
import { Arrow } from "@/components/ui/Arrow";
export function Hero() {
  const night = useEnvironment((s) => s.night);
  const toggleNight = useEnvironment((s) => s.toggleNight);
  return (
    <section
      className={`hero ${night ? "night" : ""}`}
      aria-labelledby="hero-heading"
      id="awakening"
    >
      <div className="hero-topline">
        <span>
          <i className="status-dot" /> 01 / AWAKENING
        </span>
        <span>ENGINEERED FOR THE FEELING.</span>
      </div>
      <div className="hero-title">
        <h1 id="hero-heading">
          VOLT <span>R1</span>
        </h1>
        <div className="edition">
          <span>01 — FIRST EDITION</span>
          <span>ALL ELECTRIC. ALL INSTINCT.</span>
        </div>
      </div>
      <div className="hero-tagline">
        <p>
          SILENCE.
          <br />
          <span>ACCELERATED.</span>
        </p>
        <span className="micro">NO EMISSIONS. NO COMPROMISE.</span>
      </div>
      <Viewport hero />
      <div className="hero-side">
        <span>360° EXPLORATION</span>
        <div className="crosshair">+</div>
        <span>MOVE TO DISCOVER</span>
      </div>
      <div className="hero-bottom">
        <div className="hero-specs">
          <div>
            <strong>
              3.1<span>sec</span>
            </strong>
            <small>0–60 MPH</small>
          </div>
          <div>
            <strong>
              168<span>mi</span>
            </strong>
            <small>ESTIMATED RANGE</small>
          </div>
          <div>
            <strong>
              124<span>mph</span>
            </strong>
            <small>TOP SPEED</small>
          </div>
        </div>
        <div className="hero-actions">
          <a href="#performance" className="button lime">
            Explore R1 <Arrow diagonal />
          </a>
          <span>FROM $18,900 · YOUR NEXT CHAPTER</span>
        </div>
      </div>
      <div className="hero-baseline">
        <a href="#performance">
          SCROLL TO FEEL IT <span>↓</span>
        </a>
        <button
          onClick={toggleNight}
          className="day-toggle"
          aria-label={`Switch to ${night ? "day" : "night"} mode`}
        >
          <span className={!night ? "active" : ""}>☀ DAY</span>
          <span className={night ? "active" : ""}>☾ NIGHT</span>
        </button>
        <span>DESIGNED TO MOVE YOU.</span>
      </div>
    </section>
  );
}
