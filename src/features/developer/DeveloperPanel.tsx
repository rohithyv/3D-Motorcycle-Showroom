"use client";
import { useDeveloper, type DebugFlag } from "@/stores/developer";
export function DeveloperPanel() {
  const d = useDeveloper();
  const flags: { key: DebugFlag; label: string }[] = [
    { key: "wireframe", label: "Wireframe" },
    { key: "axes", label: "Model axes" },
    { key: "hotspots", label: "Hotspots" },
    { key: "target", label: "Camera target" },
    { key: "stats", label: "Performance stats" },
  ];
  return (
    <aside
      className={`developer-panel ${d.enabled ? "expanded" : ""}`}
      aria-label="Developer tools"
    >
      <button
        className="dev-toggle"
        onClick={d.toggle}
        aria-expanded={d.enabled}
      >
        〈/〉 DEV MODE <span>{d.enabled ? "−" : "+"}</span>
      </button>
      {d.enabled && (
        <div className="dev-content">
          {d.stats && (
            <dl className="dev-metrics">
              {(["fps", "triangles", "calls", "textures", "dpr"] as const).map(
                (key, i) => (
                  <div key={key}>
                    <dt>
                      {["FPS", "TRIANGLES", "DRAW CALLS", "TEXTURES", "DPR"][i]}
                    </dt>
                    <dd>
                      {d.metrics
                        ? d.metrics[key].toLocaleString("en-US", {
                            maximumFractionDigits: 1,
                          })
                        : "—"}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          )}
          <p>Live measurements from the active scene.</p>
          <div className="dev-flags">
            {flags.map((flag) => (
              <label key={flag.key}>
                <input
                  type="checkbox"
                  checked={d[flag.key]}
                  onChange={(e) => d.setFlag(flag.key, e.target.checked)}
                />
                {flag.label}
              </label>
            ))}
          </div>
          <a href="/case-study">Read the engineering case study ↗</a>
        </div>
      )}
    </aside>
  );
}
