import React from "react";

const locations = [
  "Lagos", "Ogun", "Enugu", "Port Harcourt", "Oyo",
  "Osun", "Abuja", "Ibadan", "Imo"
];

export default function Locations() {
  return (
    <section className="page">
      <div className="page-hero">
        <p className="red-kicker">HAVEN / DELIVERY COVERAGE</p>
        <h1>HAVEN<br /><em>IS HERE.</em></h1>
        <p>Our delivery coverage reaches customers across these locations.</p>
      </div>

      <section className="section">
        <div className="section-label">01 / LOCATIONS</div>
        <div className="location-grid">
          {locations.map((location, index) => (
            <div className="location" key={location}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{location}</strong>
              <i>↗</i>
            </div>
          ))}
        </div>
      </section>

      <section className="location-note">
        <p className="red-kicker">NEED A DIFFERENT LOCATION?</p>
        <h2>LET'S<br /><em>TALK.</em></h2>
        <p>Contact Haven to ask about delivery options for your area.</p>
        <h3>Use any of our <em>SOCIAL HANDLES</em></h3>
        <p>Whatsapp No: +234 8101010478</p>
        <p>Snapchat: FW.chimzy</p>
        
      </section>
    </section>
  );
}
