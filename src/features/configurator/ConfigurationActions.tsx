"use client";
import { useState } from "react";
import { useConfigurator } from "./store";
import {
  configurationSummary,
  currency,
  getSpecs,
  serializeConfiguration,
  steps,
} from "./config/domain";
const STORAGE_KEY = "volt-r1:configuration:v1";
export function ConfigurationActions() {
  const c = useConfigurator();
  const [message, setMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [summary, setSummary] = useState(false);
  async function share() {
    const url = new URL(window.location.href);
    url.search = serializeConfiguration(c);
    url.hash = "configurator";
    window.history.replaceState(null, "", url);
    setShareUrl(url.toString());
    try {
      await navigator.clipboard.writeText(url.toString());
      setMessage("Configuration link copied.");
    } catch {
      setMessage("Copy the configuration link below.");
    }
  }
  function save() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Object.fromEntries(steps.map((key) => [key, c[key]]))),
      );
      setMessage("Build saved on this device.");
    } catch {
      setMessage(
        "Device storage is unavailable. You can share or download this build.",
      );
    }
  }
  function restore() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (!value) {
        setMessage("No saved build on this device yet.");
        return;
      }
      c.restore(JSON.parse(value));
      setMessage("Saved build restored.");
    } catch {
      setMessage(
        "This saved build could not be read. Save a new build to replace it.",
      );
    }
  }
  function download() {
    const specs = getSpecs(c);
    const text = `VOLT R1 — Your build\n\n${configurationSummary(c)}\n\nRange: ${specs.range} mi\n0–60: ${specs.acceleration.toFixed(1)} sec\nTop speed: ${specs.topSpeed} mph\nFast charge: ${specs.charge} min\nEstimated price: ${currency(specs.price)}\n\nIndependent fictional concept. Not available for purchase.`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "VOLT-R1-your-build.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Build downloaded.");
  }
  return (
    <div className="config-actions">
      <button
        className="button lime full"
        onClick={() => setSummary(!summary)}
        aria-expanded={summary}
      >
        Review your R1 <span>↗</span>
      </button>
      {summary && (
        <div className="build-summary">
          <p>{configurationSummary(c)}</p>
          <button onClick={download}>Download your build ↓</button>
        </div>
      )}
      <div className="build-utilities">
        <button onClick={share}>Share build ↗</button>
        <button onClick={save}>Save locally</button>
        <button onClick={restore}>Restore saved</button>
        <button
          onClick={() => {
            c.reset();
            setMessage("Configuration reset.");
            setShareUrl("");
            history.replaceState(null, "", location.pathname + "#configurator");
          }}
        >
          Reset build
        </button>
      </div>
      {shareUrl && (
        <label className="share-field">
          Configuration link
          <input
            aria-label="Configuration link"
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
          />
        </label>
      )}
      <p className="action-status" role="status">
        {message}
      </p>
    </div>
  );
}
