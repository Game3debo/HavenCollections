import React from "react";

export default function Contact() {
  return (
    <section className="page">
      <div className="page-hero">
        <p className="red-kicker">HAVEN / CONTACT</p>
        <h1>LET'S<br /><em>CONNECT.</em></h1>
        <p>Questions about an order, sizing, delivery or a Haven piece?</p>
      </div>

      <section className="section contact-layout">
        <div>
          <div className="section-label">01 / GET IN TOUCH</div>
          <h2>WE'RE<br /><span>LISTENING.</span></h2>
          <p className="body-copy">
            Reach out to Haven for product questions, size guidance,
            delivery enquiries or general information.
          </p>
        </div>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            NAME
            <input type="text" placeholder="Your name" />
          </label>
          <label>
            EMAIL
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            MESSAGE
            <textarea rows="6" placeholder="Tell us what you need..." />
          </label>
          <button className="primary-btn" type="submit">SEND MESSAGE ↗</button>
        </form>
      </section>
    </section>
  );
}
