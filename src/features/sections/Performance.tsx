import { Viewport } from "@/features/motorcycle/Viewport";
export function Performance() {
  return (
    <section className="performance section narrative-chapter" id="performance">
      <div className="chapter-intro" data-reveal>
        <span className="eyebrow">02 / PERFORMANCE</span>
        <h2>
          All response.
          <br />
          <span>No hesitation.</span>
        </h2>
        <p>
          From the contact patch to the electric heart.
          <br />
          Every input becomes instinct.
        </p>
      </div>
      <div className="cinematic-stage">
        <Viewport chapter="performance" />
        <div className="stage-top">
          <span>PRECISION IN MOTION</span>
          <span>FRONT → REAR → BODY</span>
        </div>
        <div className="performance-stats">
          <div>
            <strong>
              3.1<small>sec</small>
            </strong>
            <span>0–60 MPH</span>
          </div>
          <div>
            <strong>
              124<small>mph</small>
            </strong>
            <span>TOP SPEED</span>
          </div>
          <div>
            <strong className="instant-stat">Instant</strong>
            <span>TORQUE DELIVERY</span>
          </div>
        </div>
      </div>
      <p className="chapter-footnote">
        Concept targets. Scroll to follow the engineering beneath the feeling.
      </p>
    </section>
  );
}
