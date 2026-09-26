import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../data/products";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, total, totalItems, updateQuantity, removeFromCart } = useCart();

  if (!cart.length) {
    return (
      <section className="page empty-page">
        <p className="red-kicker">HAVEN / YOUR BAG</p>
        <h1>YOUR CART IS<br /><em>EMPTY.</em></h1>
        <p>Find something you love and add it to your Haven Cart.</p>
        <Link className="primary-btn" to="/shop">SHOP THE DROP ↗</Link>
      </section>
    );
  }

  return (
    <section className="page cart-page">
      <div className="section">
        <div className="section-label">01 / YOUR BAG</div>
        <div className="cart-heading">
          <div><p className="red-kicker">HAVEN / CART</p><h1>YOUR<br /><em>SELECTION.</em></h1></div>
          <p>{totalItems} item{totalItems === 1 ? "" : "s"} selected.</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.key}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <div>
                    <p className="red-kicker">{item.color} / {item.size}</p>
                    <h3>{item.name}</h3>
                    <p>{formatPrice(item.price)} each</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-control small">
                      <button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button>
                    </div>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                    <button className="remove-btn" type="button" onClick={() => removeFromCart(item.key)}>REMOVE</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <p className="red-kicker">ORDER SUMMARY</p>
            <div><span>ITEMS</span><strong>{totalItems}</strong></div>
            <div><span>SUBTOTAL</span><strong>{formatPrice(total)}</strong></div>
            <p className="summary-note">Delivery and payment details are confirmed at checkout.</p>
            <Link className="primary-btn full-btn" to="/checkout">CHECKOUT ↗</Link>
            <Link className="text-link" to="/shop">CONTINUE SHOPPING ↗</Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
