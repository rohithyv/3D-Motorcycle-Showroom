"use client";
import { useState } from "react";
const accessories = [
  {
    name: "The Urban Helmet",
    type: "PROTECTION, REFINED.",
    price: 390,
    kind: "helmet",
    description:
      "A sculpted full-face concept with a panoramic visor, breathable lining, and a quiet aerodynamic profile.",
  },
  {
    name: "The Weekender",
    type: "TAKE THE LONG WAY.",
    price: 240,
    kind: "bag",
    description:
      "A weather-resistant 24 L tail bag concept with a secure quick-release mount and room for the essentials.",
  },
  {
    name: "Home Charge",
    type: "READY WHEN YOU ARE.",
    price: 690,
    kind: "charger",
    description:
      "A compact 7.4 kW home charging concept with a five-meter cable and a simple charging status light.",
  },
];
export function Accessories() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <section className="accessories section" id="accessories">
      <div className="accessory-heading" data-reveal>
        <div>
          <span className="eyebrow">06 / COMPLETE THE RIDE</span>
          <h2>Beyond the bike.</h2>
        </div>
        <p>
          Considered essentials.
          <br />
          Made for your next escape.
        </p>
      </div>
      <div className="accessory-grid">
        {accessories.map((item, i) => (
          <button
            className="accessory-card"
            key={item.name}
            onClick={() => setSelected(selected === i ? null : i)}
            aria-expanded={selected === i}
          >
            <div className={`accessory-art ${item.kind}`}>
              <div className="product-shape">
                <i />
                <b>V</b>
              </div>
              <span className="accessory-plus">
                {selected === i ? "−" : "+"}
              </span>
            </div>
            <span className="micro">{item.type}</span>
            <div className="accessory-title">
              <h3>{item.name}</h3>
              <span>${item.price}</span>
            </div>
            {selected === i && (
              <p className="accessory-details">
                {item.description} Concept accessory; not available for
                purchase.
              </p>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
