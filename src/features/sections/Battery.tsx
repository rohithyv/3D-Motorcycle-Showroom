"use client";
import { Viewport } from "@/features/motorcycle/Viewport";
import { useExperience } from "@/stores/experience";
export function Battery() {
  const phase = useExperience((s) => s.batteryPhase);
  const setPhase = useExperience((s) => s.setBatteryPhase);
  return (
    <section className="section energy-chapter narrative-chapter" id="battery">
      <div className="chapter-intro" data-reveal>
        <span className="eyebrow">03 / ENERGY</span>
        <h2>
          Power.
          <br />
          <span>From within.</span>
        </h2>
        <p>
          One integrated system. Four deliberate layers.
          <br />
          Unpack the energy that moves you.
        </p>
      </div>
      <div className="cinematic-stage energy-stage">
        <Viewport chapter="energy" />
        <div className="stage-top">
          <span>POWERCORE / MODULAR ARCHITECTURE</span>
          <span>EXTRACT. INSPECT. RECONNECT.</span>
        </div>
        <div className="energy-readout">
          <div>
            <strong>
              168<small>mi</small>
            </strong>
            <span>ESTIMATED RANGE</span>
          </div>
          <div>
            <strong>
              38<small>min</small>
            </strong>
            <span>20–80% FAST CHARGE</span>
          </div>
        </div>
        <div className="energy-layers">
          <span>01 / HOUSING</span>
          <span>02 / MODULES</span>
          <span>03 / COOLING</span>
          <span>04 / CONTROLLER</span>
        </div>
      </div>
      <div className="chapter-controls" aria-label="Battery inspection">
        <button aria-pressed={phase === 0.55} onClick={() => setPhase(0.55)}>
          Inspect battery ↗
        </button>
        <button aria-pressed={phase === 1} onClick={() => setPhase(1)}>
          Reconstruct
        </button>
        <button aria-pressed={phase === null} onClick={() => setPhase(null)}>
          Follow scroll
        </button>
      </div>
      <p className="chapter-footnote">
        Fictional concept figures. Range and charge time are illustrative.
      </p>
    </section>
  );
}
