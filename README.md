# VOLT R1 — Silence. Accelerated.

A cinematic, interactive electric-motorcycle concept built as a frontend engineering portfolio project. Six chapters move from awakening through performance, energy, engineering, configuration and a motion-driven finale. Accessories from the original implementation remain as an epilogue.

**This is an independent fictional product concept and is not affiliated with any real motorcycle manufacturer.** Every performance figure, price, charging claim and technical description is fictional. There is no checkout, reservation service or payment integration.

## Screenshots

The Playwright suite captures these review images under `test-results/` (ignored by Git):

- `volt-r1-desktop.png` — Awakening hero.
- `volt-r1-engineering.png` — exploded view and component controls.
- `volt-r1-mobile.png` — mobile fallback and navigation.

Publication placeholders: replace this list with approved desktop, engineering and mobile captures before publishing the portfolio case study.

## Technology choices

- **Next.js App Router / React 19 / TypeScript:** static page shells, focused client features and strict types.
- **React Three Fiber 9 / Drei / Three.js:** material configuration, environment lighting, cameras and component choreography.
- **GSAP ScrollTrigger / Lenis:** chapter progress, text reveals and predictable smooth scroll without scroll hijacking.
- **Zustand:** separate configuration, experience, engineering, environment and developer stores.
- **Tailwind CSS 4 + authored CSS:** tokens, editorial layouts and responsive chapter composition.
- **Vitest / Playwright:** domain and choreography tests plus core production-browser flows.

## Setup

Use Node.js 22.13+; Node 24 is recommended.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. `/case-study` documents architecture, asset strategy and real measurements.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run check` runs types, lint, unit tests and the production build. Playwright starts a production server at `127.0.0.1:3100`; build first. The development server can keep running on port 3000. `npm run format` formats source files.

Production builds use Next's supported Webpack option because Turbopack's PostCSS subprocess encountered a worker-port restriction in the original sandbox. Development retains Turbopack. No forced dependency resolutions or legacy-peer-dependency bypasses are used.

## Architecture

```text
src/app/                         routes, metadata, design tokens
src/features/motorcycle/
  model/                         common animated adapter, GLB and procedural sources
  camera/                        named camera poses and CameraRig
  animation/                     scroll frame data and battery sequence
  types/                         chapter, part and shared model contracts
  Scene.tsx                      renderer, lighting, adaptive runtime and fallback
  Viewport.tsx                   lazy loading, visibility and mobile opt-in
src/features/configurator/
  config/domain.ts               options, calculations, validation, URL serialization
  store.ts                       configuration state only
  Configurator.tsx               six-step controls and live specification panel
  ConfigurationActions.tsx       share, explicit local save/restore and download
src/features/engineering/data/   component descriptions and camera targets
src/features/ride/               start/stop experience and optional audio adapter
src/features/developer/          opt-in GPU metrics and diagnostic controls
src/features/case-study/         actual build and browser measurements
src/features/experience/         navigation, chapter progress, Lenis and GSAP
src/stores/                      independent environment, experience, engineering, debug state
src/lib/three/                   texture-quality policy
```

Scroll frame data bypasses React state. Camera movement, component choreography and material interpolation use frame-rate-independent damping. No section component writes directly to a Three.js camera. Configuration calculations live exclusively in the domain module.

## Experience

1. **Awakening:** subdued lighting, headlight activation, camera push and restrained pointer response.
2. **Performance:** front-wheel, rear-wheel and body camera sequence; rotating wheel details.
3. **Energy:** panel separation, battery extraction and rotation, housing/modules/cooling/controller separation, then reconstruction. Manual inspection controls also work with reduced motion.
4. **Engineering:** exploded components, seven keyboard-accessible selections, selected-part highlighting, camera focus and reset/assemble controls.
5. **Build your R1:** four finishes; Street/Forged/Carbon wheels; three seats, battery packs, lighting options and ride modes. URL sharing validates values. Local storage is written only when the user explicitly saves.
6. **The Ride:** opt-in startup, illuminated display and lamps, wheel motion, subtle vibration and moving light streaks. Stop is always available. Reduced motion retains the lighting sequence with a still presentation.

Day/night smoothly changes scene intensity, lamps, taillight and display. Dev Mode is off by default and reveals live FPS, triangle count, draw calls, texture count and DPR, plus wireframe, axes, hotspots and camera target toggles.

## Model replacement

The included `public/models/volt-r1.glb` is an original procedural placeholder generated with `npm run model:generate`. It is not production CAD or a manufacturer asset. `GLBMotorcycle.tsx` loads it using a shared `ModelProps` interface. `ProceduralMotorcycle.tsx` provides an isolated, lightweight emergency fallback if loading fails; `AnimatedMotorcycle.tsx` supplies common behavior to both.

A replacement should use meters, Y-up, forward +X, ground at Y=0. Keep these named groups:

```text
Bike
  Frame
  TankCover
  FrontFairing
  RearFairing
  Battery
    BatteryHousing
    BatteryModules
    BatteryCooling
    BatteryController
  Motor
  FrontWheel
  RearWheel
  Seat
  FrontFork
  RearSuspension
  Brakes
  Headlight
  TailLight
  Display
  Accessories
```

Wheel group origins must be their axle centers, with local Z as rotation axis. All other group origins and geometry must align to the model coordinate system. Body material selection follows named groups; rim/spoke selection additionally recognizes `Rim` and `Spoke` in mesh names. Preserve PBR materials. Each viewport clones materials; geometry is shared by GLTF cache.

Replace the asset at the same path, update the static SVG profile, tune camera presets and component targets, then run the model-contract test and visually review all six chapters. A missing model shows a notice and the procedural fallback; WebGL failure shows a static product profile with accessible controls outside the canvas.

## 3D optimization pipeline

Target production pipeline:

**Blender → GLTF → Meshopt → KTX2 → React Three Fiber → WebGL**

Current status is intentionally explicit: the included asset is an uncompressed, texture-free GLB. Meshopt loading is enabled. Draco decoders are served locally from `public/draco`. Texture anisotropy is capped by device capability. A production KTX2 asset needs `KTX2Loader` transcoder assets and renderer capability detection added before use; the project does not claim to ship a texture-compressed model.

Use instancing/merged static geometry where material boundaries permit. Bake detail into maps, simplify hidden geometry, retain separate animated parts, and check visual fidelity after each compression step. Avoid optimizing away the named-part contract.

## Performance strategy and honest measurements

- Lazy scene imports and near-viewport model preloading; mobile never preloads 3D before opt-in.
- Offscreen viewports release WebGL contexts; shared GLTF data stays cached.
- Mobile starts at DPR 1; desktop starts at 1.5 and reduces on slow rendering.
- Mobile uses lower environment and contact-shadow resolution. Slow scenes drop contact shadows.
- Environment lighting with one non-shadow-casting key light; no heavy postprocessing.
- Hidden tabs stop canvas rendering and smooth-scroll updates; the ride stops for visibility changes.
- Per-frame work avoids React rerenders; expensive scene clones and material lists are memoized.
- Animation callbacks, observers and listeners are cleaned up.

After each successful build, `scripts/measure-build.mjs` writes `public/build-metrics.json`. This measures model size, all emitted client JS bytes and the sum of per-file gzip sizes across both routes (including lazy 3D code). **It is not an initial-route payload or a Lighthouse score.** The case study reads this data and the current navigation TTFB; Dev Mode reads live renderer statistics. No final FPS, Lighthouse or Core Web Vitals score is invented.

## Accessibility and mobile

All meaningful text and configuration controls exist outside WebGL. Use keyboard-focusable native buttons, pressed/current states, visible focus rings, live summaries and the skip link. Reduced motion disables smooth scroll, automatic camera travel, wheel rotation, vibration and streaks; explicit controls still select components and inspect batteries. Mobile collapses hotspots into a comfortable two-column control list, uses larger tap targets, removes the fixed chapter rail and offers an explicit 3D opt-in.

## Audio

No licensed audio assets were supplied, so the site makes no sound. `useRideAudio` accepts an optional source, only plays after an explicit sound-enable action, exposes mute/stop, handles playback failures and cleans up on unmount. Supply a properly licensed asset and connect the source to reveal the sound control. There is no generated motor noise or unexpected autoplay.

## Testing

Vitest checks baseline figures, tradeoffs, every option combination, untrusted query validation, share-link round trips, battery reconstruction and GLB named groups. Playwright checks homepage/model loading, color and ride-mode changes, day/night controls, keyboard engineering selection, save/restore/share, reduced motion, mobile overflow/navigation and developer/case-study access. Failure screenshots and traces are retained in `test-results/`; `playwright-report/` contains the browser report.

## Deployment

Deploy to a Node-capable Next.js host (for example Vercel or a Node container):

```sh
npm ci
npm run check
npm start
```

Serve the `public/models`, `public/draco` and generated metrics files, preserve correct WASM MIME types, and enable compression/cache headers for immutable build assets. Use HTTPS for clipboard sharing; when clipboard access fails the UI exposes a copyable URL. No environment secrets are required. This repository has not been published automatically.

## Acknowledgements

The model and graphic assets are original procedural project work. The stack uses open-source React, Next.js, Three.js, React Three Fiber, Drei, GSAP, Lenis, Zustand, Tailwind, Vitest and Playwright. Vendored Draco runtime files originate from Three.js's bundled Draco distribution (Apache 2.0); their notices are retained. Manufacturer affiliation and real-world product claims are expressly excluded.
