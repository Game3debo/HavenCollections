import React from "react";

const points = [
  ["01", "VIBRANT COLOURS", "Rich colours that keep the design looking sharp and intentional."],
  ["02", "SUBLIMATION", "Sublimated graphics give the jersey a smooth integrated finish."],
  ["03", "NO FADING", "Designed to keep its visual character through regular wear and care."],
  ["04", "NO LOOSE THREADS", "Neat construction and finishing for a cleaner premium look."],
  ["05", "CORRECT LOGO PLACEMENT", "Brand marks are positioned carefully and consistently."],
  ["06", "BREATHABLE", "Comfort-focused fabric helps airflow while you move."],
];

export default function Quality() {
  return (
    <section className="page">
      <div className="page-hero">
        <p className="red-kicker">HAVEN / THE STANDARD</p>
        <h1>QUALITY<br /><em>MATTERS.</em></h1>
        <p>Good design deserves good construction.</p>
      </div>

      <section className="section">
        <div className="section-label">01 / SIX DETAILS THAT MATTER</div>
        <div className="quality-grid">
          {points.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="quality-statement">
        <p className="red-kicker">THE HAVEN PROMISE</p>
        <h2>IF IT DOESN'T<br /><em>FEEL RIGHT,</em><br />IT'S NOT HAVEN.</h2>
      </section>
    </section>
  );
}
