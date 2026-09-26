import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer>
      <div>
        <Link to="/"><img src={logo} alt="Haven" className="footer-logo" /></Link>
        <p>FEEL THE DESIGN.......</p>
      </div>

      <div className="footer-links">
        <Link to="/">HOME</Link>
        <Link to="/shop">SHOP</Link>
        <Link to="/about">ABOUT</Link>
        <Link to="/quality">QUALITY</Link>
        <Link to="/locations">LOCATIONS</Link>
        <Link to="/contact">CONTACT</Link>
        <Link to="/cart">BAG</Link>
      </div>

      <div className="footer-meta">
        <p>HAVEN / 2026</p>
        <p>QUALITY • COMFORT • IDENTITY</p>
      </div>
    </footer>
  );
}
