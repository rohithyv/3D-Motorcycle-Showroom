import { Arrow } from "@/components/ui/Arrow";
export function FinalCTA() {
  return (
    <>
      <section className="final-cta section">
        <span className="eyebrow">THE FUTURE IS A FEELING.</span>
        <h2>Go feel it.</h2>
        <a href="#configurator" className="button lime">
          Build your VOLT R1 <Arrow diagonal />
        </a>
        <span className="final-coordinate">
          QUIETLY RADICAL. ENTIRELY ELECTRIC.
        </span>
      </section>
      <footer className="footer">
        <a className="wordmark" href="#">
          VOLT<span>®</span>
        </a>
        <span>© {new Date().getFullYear()} VOLT MOTOR COMPANY</span>
        <a href="#engineering">Discover the R1 ↗</a>
        <span className="concept-note">
          This is an independent fictional product concept and is not affiliated
          with any real motorcycle manufacturer.
        </span>
      </footer>
    </>
  );
}
