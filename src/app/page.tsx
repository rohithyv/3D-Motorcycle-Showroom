import { Header } from "@/features/experience/Header";
import { Motion } from "@/features/experience/motion";
import { Hero } from "@/features/sections/Hero";
import {
  Engineering,
  Battery,
  Performance,
  Accessories,
  FinalCTA,
} from "@/features/sections/Story";
import { Ride } from "@/features/ride/Ride";
import { DeveloperPanel } from "@/features/developer/DeveloperPanel";
import { ChapterProgress } from "@/features/experience/ChapterProgress";
import { Configurator } from "@/features/configurator/Configurator";
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <div id="journey">
          <Hero />
          <Performance />
          <Battery />
          <Engineering />
        </div>

        <Configurator />
        <Ride />
        <Accessories />
        <FinalCTA />
      </main>
      <Motion />
      <ChapterProgress />
      <DeveloperPanel />
    </>
  );
}
