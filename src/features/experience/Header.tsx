"use client";
import { useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <a href="#" className="wordmark" aria-label="VOLT home">
        VOLT<span>®</span>
      </a>
      <nav aria-label="Main navigation" className={open ? "nav open" : "nav"}>
        <a href="#awakening" onClick={() => setOpen(false)}>
          Awakening
        </a>
        <a href="#performance" onClick={() => setOpen(false)}>
          Performance
        </a>
        <a href="/case-study" onClick={() => setOpen(false)}>
          Case study
        </a>
      </nav>
      <a className="header-cta" href="#configurator">
        Configure R1 <Arrow diagonal />
      </a>
      <button
        className="menu-toggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>
    </header>
  );
}
