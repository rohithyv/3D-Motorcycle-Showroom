"use client";
import { useEffect, useState } from "react";
import { useConfigurator } from "./store";
import {
  colors,
  getSpecs,
  currency,
  options,
  labels,
  steps,
  parseConfiguration,
  type ConfigKey,
} from "./config/domain";
import { ConfigurationActions } from "./ConfigurationActions";
import { Viewport } from "@/features/motorcycle/Viewport";
import { useEnvironment } from "@/stores/environment";
const descriptions: Record<ConfigKey, string> = {
  color: "Four finishes. One unmistakable silhouette.",
  wheels: "Street balance, forged precision, or lighter carbon.",
  seat: "Choose the texture of every journey.",
  battery: "Shape your balance of distance and response.",
  lighting: "A signature for every hour of the day.",
  mode: "Tune the response to your rhythm.",
};
export function Configurator() {
  const c = useConfigurator();
  const { night, toggleNight } = useEnvironment();
  const specs = getSpecs(c);
  const [step, setStep] = useState(0);
  const active = steps[step];
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (steps.some((key) => params.has(key)))
      useConfigurator.getState().restore(parseConfiguration(location.search));
    const back = () => {
      useConfigurator.getState().restore(parseConfiguration(location.search));
    };
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);
  return (
    <section className="configurator section" id="configurator">
      <div className="section-heading" data-reveal>
        <span className="eyebrow">05 / BUILD YOUR R1</span>
        <h2>
          Your instinct.
          <br />
          <span>Your R1.</span>
        </h2>
        <p>
          Every detail, your decision.
          <br />
          One unmistakable connection.
        </p>
      </div>
      <div className="config-layout step-config">
        <div className={`config-stage ${night ? "studio-night" : ""}`}>
          <div className="stage-label">
            <span>VOLT R1</span>
            <span>LIVE STUDIO / 360°</span>
          </div>
          <Viewport interactive chapter="configurator" />
          <span className="drag-hint">DRAG TO ROTATE · SCROLL TO ZOOM</span>
          <button
            className="studio-light"
            onClick={toggleNight}
            aria-label={`Switch to ${night ? "day" : "night"} mode`}
          >
            {night ? "☀ Day studio" : "☾ Night studio"}
          </button>
        </div>
        <div className="config-panel">
          <nav className="config-steps" aria-label="Configuration steps">
            {steps.map((key, index) => (
              <button
                key={key}
                aria-label={`${index + 1}. ${labels[key]}`}
                aria-current={step === index ? "step" : undefined}
                onClick={() => setStep(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{labels[key]}</small>
              </button>
            ))}
          </nav>
          <div className="step-content">
            <div className="option-label">
              <span>
                {String(step + 1).padStart(2, "0")} / {labels[active]}
              </span>
              <strong>
                {active === "color"
                  ? colors.find((color) => color.value === c.color)?.name
                  : c[active]}
              </strong>
            </div>
            <p>{descriptions[active]}</p>
            {active === "color" ? (
              <div className="swatches">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    style={{ background: color.value }}
                    aria-label={color.name}
                    aria-pressed={c.color === color.value}
                    onClick={() => c.set("color", color.value)}
                    className={c.color === color.value ? "selected" : ""}
                  >
                    {c.color === color.value ? "✓" : ""}
                  </button>
                ))}
              </div>
            ) : (
              <fieldset className="option">
                <legend className="sr-only">{labels[active]}</legend>
                <div className="choice-list">
                  {options[active].map((value) => (
                    <button
                      key={value}
                      aria-label={value}
                      aria-pressed={c[active] === value}
                      onClick={() => c.set(active, value)}
                    >
                      <span>{value}</span>
                      <span>{c[active] === value ? "●" : "○"}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
          <div className="step-pagination">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              ← Previous
            </button>
            <span>{step + 1} / 6</span>
            <button
              onClick={() => setStep(Math.min(5, step + 1))}
              disabled={step === 5}
            >
              Next →
            </button>
          </div>
          <div className="config-result expanded-specs" aria-live="polite">
            <div>
              <strong data-testid="config-range">
                {specs.range}
                <small> mi</small>
              </strong>
              <span>EST. RANGE</span>
            </div>
            <div>
              <strong data-testid="config-acceleration">
                {specs.acceleration.toFixed(1)}
                <small> sec</small>
              </strong>
              <span>0–60 MPH</span>
            </div>
            <div>
              <strong>
                {specs.topSpeed}
                <small> mph</small>
              </strong>
              <span>TOP SPEED</span>
            </div>
            <div>
              <strong>
                {specs.charge}
                <small> min</small>
              </strong>
              <span>FAST CHARGE</span>
            </div>
            <div>
              <strong>
                {specs.weight}
                <small> kg</small>
              </strong>
              <span>CONCEPT WEIGHT</span>
            </div>
            <div>
              <strong data-testid="config-price">
                {currency(specs.price)}
              </strong>
              <span>EST. PRICE</span>
            </div>
          </div>
          <ConfigurationActions />
          <p className="config-disclaimer">
            Independent fictional concept. All figures are illustrative.
          </p>
        </div>
      </div>
    </section>
  );
}
