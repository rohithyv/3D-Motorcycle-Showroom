"use client";
import { useEffect, useState } from "react";
type Metrics = {
  generatedAt: string;
  modelBytes: number;
  totalJavaScriptBytes: number;
  totalJavaScriptGzipBytes: number;
  javaScriptFiles: number;
  scope: string;
};
export function Measurements() {
  const [data, setData] = useState<Metrics | null>(null);
  const [error, setError] = useState(false);
  const [ttfb, setTtfb] = useState<number | null>(null);
  useEffect(() => {
    const abort = new AbortController();
    fetch("/build-metrics.json", { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Metrics unavailable");
        return response.json();
      })
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      });
    const observer = new PerformanceObserver((list) => {
      const entry = list.getEntries()[0] as
        PerformanceNavigationTiming | undefined;
      if (entry) setTtfb(Math.round(entry.responseStart - entry.requestStart));
    });
    if (PerformanceObserver.supportedEntryTypes.includes("navigation"))
      observer.observe({ type: "navigation", buffered: true });
    return () => {
      abort.abort();
      observer.disconnect();
    };
  }, []);
  return (
    <div className="measured-results">
      {data ? (
        <>
          <div className="measurement-grid">
            <div>
              <strong>
                {(data.modelBytes / 1024).toFixed(1)}
                <small> KiB</small>
              </strong>
              <span>GLB ASSET</span>
            </div>
            <div>
              <strong>
                {(data.totalJavaScriptGzipBytes / 1024).toFixed(1)}
                <small> KiB</small>
              </strong>
              <span>ALL CLIENT JS / GZIP</span>
            </div>
            <div>
              <strong>{data.javaScriptFiles}</strong>
              <span>EMITTED JS FILES</span>
            </div>
            <div>
              <strong>
                {ttfb ?? "—"}
                <small> ms</small>
              </strong>
              <span>THIS PAGE / TTFB</span>
            </div>
          </div>
          <p>
            {data.scope} Gzip sizes are calculated per file with Node zlib. TTFB
            is measured in this browser and varies with the environment.
          </p>
          <small>Asset measurement: {data.generatedAt}</small>
        </>
      ) : (
        <p role="status">
          {error
            ? "No build measurements available. Run a production build to generate real asset data."
            : "Reading build measurements…"}
        </p>
      )}
      <p>
        FPS, triangles, draw calls, textures and DPR are measured live in the
        showcase’s Dev Mode. No Lighthouse or field performance score is
        claimed.
      </p>
    </div>
  );
}
