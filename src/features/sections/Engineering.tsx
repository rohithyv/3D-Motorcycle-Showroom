"use client";
import { Viewport } from "@/features/motorcycle/Viewport";
import { components } from "@/features/engineering/data/components";
import { useEngineering } from "@/stores/engineering";
import { useDeveloper } from "@/stores/developer";
export function Engineering() {
  const { selected, exploded, select, setExploded, reset } = useEngineering();
  const show = useDeveloper((s) => !s.enabled || s.hotspots);
  const part = components.find((c) => c.id === selected);
  return (
    <section
      className="section engineering engineering-chapter"
      id="engineering"
    >
      <div className="chapter-intro" data-reveal>
        <span className="eyebrow">04 / ENGINEERING</span>
        <h2>
          Nothing hidden.
          <br />
          <span>Nothing unnecessary.</span>
        </h2>
        <p>
          Explore the architecture.
          <br />
          Select a system. See the intention.
        </p>
      </div>
      <div className="engineering-stage">
        <Viewport chapter="engineering" />
        {show && (
          <div
            className="engineering-hotspots"
            aria-label="Motorcycle components"
          >
            {components.map((c, i) => (
              <button
                key={c.id}
                className={`hotspot hotspot-${i} ${selected === c.id ? "selected" : ""}`}
                aria-pressed={selected === c.id}
                onClick={() => select(selected === c.id ? null : c.id)}
              >
                <i>{String(i + 1).padStart(2, "0")}</i>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="engineering-toolbar">
        <div className="chapter-controls">
          <button
            onClick={() => setExploded(!exploded)}
            aria-pressed={exploded}
          >
            {exploded ? "Assemble motorcycle" : "Explode motorcycle"}
          </button>
          <button onClick={reset}>Reset view</button>
        </div>
        <span>7 SYSTEMS. ONE PURPOSE.</span>
      </div>
      <div className="component-detail" aria-live="polite">
        <span className="eyebrow">
          {part ? part.detail : "SELECT A COMPONENT TO EXPLORE"}
        </span>
        <h3>{part ? part.label : "Precision, made visible."}</h3>
        <p>
          {part
            ? part.description
            : "Use the numbered labels to isolate a system. The camera follows your selection while the surrounding components fall into the background."}
        </p>
      </div>
    </section>
  );
}
