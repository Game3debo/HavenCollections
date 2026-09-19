import React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";

const links = [
  ["HOME", "/"],
  ["SHOP", "/shop"],
  ["ABOUT", "/about"],
  ["QUALITY", "/quality"],
  ["LOCATIONS", "/locations"],
  ["CONTACT", "/contact"],
];

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <>
      <div className="announcement">
        <span>HAVEN 07</span>
        <span>FEEL THE DESIGN.......</span>
        <span>QUALITY • COMFORT • IDENTITY</span>
      </div>

      <header className="navbar">
        <Link to="/" className="brand"><img src={logo} alt="Haven" /></Link>

        <nav className="desktop-nav">
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} className={({ isActive }) => isActive ? "active" : ""}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <Link className="cart-nav" to="/cart">BAG <span>{totalItems}</span></Link>
          <Link className="nav-cta" to="/shop">SHOP NOW <span>↗</span></Link>
        </div>
      </header>
    </>
  );
}
