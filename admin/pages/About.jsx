import React from "react";
import { Link } from "react-router-dom";
import haven1 from "../assets/haven1.png";

export default function About() {
  return (
    <section className="page">
      <div className="page-hero">
        <p className="red-kicker">HAVEN / OUR STORY</p>
        <h1>MORE THAN<br /><em>A JERSEY.</em></h1>
        <p>We create pieces that let the design speak before you do.</p>
      </div>

      <section className="section">
        <div className="section-label">01 / WHO WE ARE</div>
        <div className="two-col">
          <h2>WEAR<br /><span>YOUR IDENTITY.</span></h2>
          <div className="body-copy">
            <p>
              Haven is a jersey and lifestyle brand focused on expressive
              designs, wearable comfort and dependable quality.
            </p>
            <p>
              We believe a jersey can be more than something you wear for a
              match. It can represent your personality, your people, your
              creativity and your energy.
            </p>
            <p><strong>Our motto:</strong> Feel the design.......</p>
          </div>
        </div>
      </section>

      <section className="image-split light">
        <div className="split-image">
          <img src={haven1} alt="Haven design detail" />
        </div>
        <div className="split-copy">
          <p className="red-kicker">OUR APPROACH</p>
          <h2>DESIGN.<br />QUALITY.<br /><em>HAVEN.</em></h2>
          <p>
            We pay attention to the details that are easy to overlook:
            colour, print quality, neat threads, logo placement and
            breathability.
          </p>
          <Link className="outline-btn dark-btn" to="/quality">EXPLORE QUALITY ↗</Link>
        </div>
      </section>
    </section>
  );
}
