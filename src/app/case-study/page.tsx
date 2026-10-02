import type { Metadata } from "next";
import Link from "next/link";
import { Measurements } from "@/features/case-study/Measurements";
export const metadata: Metadata = {
  title: "VOLT R1 — Engineering the experience",
  description:
    "Architecture, WebGL choreography and measured performance behind the fictional VOLT R1 product experience.",
};
export default function CaseStudy() {
  return (
    <main className="case-study">
      <header className="case-header">
        <Link href="/" className="wordmark">
          VOLT<span>®</span>
        </Link>
        <Link href="/">Back to the experience ↗</Link>
      </header>
      <section className="case-hero">
        <span className="eyebrow">
          BEHIND THE EXPERIENCE / ENGINEERING NOTES
        </span>
        <h1>
          Silence, engineered.
          <br />
          <span>In the browser.</span>
        </h1>
        <p>
          A study in cinematic storytelling, real-time materials, and the
          discipline of working within a frame budget.
        </p>
      </section>
      <section className="case-section">
        <span className="eyebrow">01 / THE CHALLENGE</span>
        <h2>
          Presence without
          <br />
          <span>the performance cost.</span>
        </h2>
        <p>
          How can a browser deliver a cinematic automotive experience while
          maintaining strong performance? The product needs to feel tangible,
          but the page must remain usable on modest hardware, by keyboard, and
          without WebGL.
        </p>
      </section>
      <section className="case-section">
        <span className="eyebrow">02 / THE APPROACH</span>
        <div className="case-approach">
          <article>
            <h3>Direct the camera.</h3>
            <p>
              Named camera presets and a chapter timeline describe position,
              target and field of view. Frame-rate-independent damping connects
              poses without section components owning camera math.
            </p>
          </article>
          <article>
            <h3>Separate the systems.</h3>
            <p>
              Configuration, environment, engineering selection and experience
              state have independent Zustand stores. Scroll progress uses
              mutable frame data to avoid React renders on every scroll event.
            </p>
          </article>
          <article>
            <h3>Make the material real.</h3>
            <p>
              Configuration updates cloned Three.js materials and battery
              geometry. A single domain module defines fictional performance
              rules, validates shared URLs and keeps saved builds predictable.
            </p>
          </article>
          <article>
            <h3>Spend GPU time deliberately.</h3>
            <p>
              Viewports load near the screen and release their contexts
              offscreen. Mobile opts into 3D, DPR adapts, shadows reduce on slow
              devices, and hidden tabs stop rendering.
            </p>
          </article>
        </div>
      </section>
      <section className="case-section">
        <span className="eyebrow">03 / THE 3D PIPELINE</span>
        <h2>Asset to experience.</h2>
        <p className="pipeline">
          Blender → GLTF → Meshopt → KTX2 → React Three Fiber → WebGL
        </p>
        <p>
          This is the target production asset pipeline, not a claim about the
          current asset. The included motorcycle is an original procedural GLB
          generated from primitives. It has no bitmap textures and is not
          Meshopt-compressed. Local Draco decoding and Meshopt loading are
          ready; a production KTX2 asset would need its transcoder wired into
          the loader.
        </p>
        <p>
          A shared model interface supports both the GLB and an isolated
          primitive fallback. Named parts make wheel rotation, battery layers,
          exploded choreography and engineering selection independent of the
          source asset.
        </p>
      </section>
      <section className="case-section">
        <span className="eyebrow">04 / MEASURE, DON’T INVENT</span>
        <h2>Actual measurements.</h2>
        <Measurements />
      </section>
      <section className="case-section">
        <span className="eyebrow">05 / ACCESSIBILITY & VALIDATION</span>
        <h2>More ways in.</h2>
        <p>
          The narrative has semantic text outside the canvas. Every configurator
          step and engineering selection is a native keyboard-accessible
          control. Reduced motion disables automatic camera choreography and
          ride motion; battery inspection, lighting and configuration remain
          available. Mobile has an explicit 3D opt-in and a static product
          profile.
        </p>
        <p>
          Vitest covers product calculations, query validation and battery
          choreography. Playwright covers the homepage, materials controls, ride
          modes, environment switching, engineering selection, sharing, reduced
          motion and mobile layout. TypeScript, ESLint and a production build
          complete the validation pipeline.
        </p>
      </section>
      <footer className="case-footer">
        <Link href="/#configurator" className="button lime">
          Build your R1 ↗
        </Link>
        <p>
          This is an independent fictional product concept and is not affiliated
          with any real motorcycle manufacturer.
        </p>
      </footer>
    </main>
  );
}
