import React, {useEffect,useState} from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../data/products";
import { useCart } from "../context/CartContext";

const PAYMENT_ACCOUNT = {
  bank: "MONIEPOINT MICROFINANCE BANK",
  accountName: "CHIMA EJIMOFOR",
  accountNumber: "8101010478",
};

export default function Checkout() {
  const { cart, total, totalItems, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "" });
  const [paymentStatus, setPaymentStatus] = useState("not_started");
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  if (paymentStatus !== "pending_verification" || !orderId) {
    return;
  }

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/orders");

      if (!response.ok) {
        return;
      }

      const orders = await response.json();

      const currentOrder = orders.find(
        (order) => String(order.id) === String(orderId.replace("HVN-", ""))
      );

      if (currentOrder?.payment_status === "PAID") {
        setPaymentStatus("paid");
      }
    } catch (error) {
      console.error("PAYMENT STATUS CHECK ERROR:", error);
    }
  };

  checkPaymentStatus();

  const interval = setInterval(checkPaymentStatus, 3000);

  return () => clearInterval(interval);
}, [paymentStatus, orderId]);

  if (!cart.length && paymentStatus === "not_started") {
    return (
      <section className="page empty-page">
        <h1>NOTHING TO<br /><em>CHECK OUT.</em></h1>
        <Link className="primary-btn" to="/shop">GO TO SHOP ↗</Link>
      </section>
    );
  }

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_ACCOUNT.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const submitOrder = async (event) => {
  event.preventDefault();

  setSubmitting(true);
  setError("");

  try {
    const response = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        total: total,
        items: cart.map((item) => ({
          product_id: item.productId,
          product_name: item.name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create order");
    }

    const backendOrderId = data.order.id;

    setOrderId(`HVN-${backendOrderId}`);
    setPaymentStatus("awaiting_payment");

  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    setError("Something went wrong while creating your order. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  const markPaymentSubmitted = () => {
    setPaymentStatus("pending_verification");
    clearCart();
  };

  if (paymentStatus === "paid") {
    return (
      <section className="page empty-page success-page">
        <div className="payment-success-icon">✓</div>
        <p className="red-kicker">HAVEN / PAYMENT CONFIRMED</p>
        <h1>PAYMENT<br /><em>RECEIVED.</em></h1>
        <p>
          Your payment for order <strong>{orderId}</strong> has been received successfully.
          Haven can now process your order.
        </p>
        <div className="payment-receipt-mini">
          <span>ORDER</span><strong>{orderId}</strong>
          <span>STATUS</span><strong className="paid-text">PAID ✓</strong>
        </div>
        <Link className="primary-btn" to="/shop">KEEP SHOPPING ↗</Link>
      </section>
    );
  }

  if (paymentStatus === "pending_verification") {
    return (
      <section className="page empty-page success-page">
        <div className="payment-pending-icon">○</div>
        <p className="red-kicker">HAVEN / PAYMENT SUBMITTED</p>
        <h1>PAYMENT IS<br /><em>PROCESSING.</em></h1>
        <p>
          Order <strong>{orderId}</strong> has been submitted. Your payment is awaiting verification.
          Once the Haven confirms it, this page will show <strong>PAYMENT RECEIVED</strong>.
        </p>



        <Link className="text-link" to="/shop">CONTINUE SHOPPING ↗</Link>
      </section>
    );
  }

  if (paymentStatus === "awaiting_payment") {
    return (
      <section className="page checkout-page">
        <div className="section">
          <div className="section-label">02 / PAYMENT</div>
          <div className="payment-layout">
            <div>
              <p className="red-kicker">BANK TRANSFER</p>
              <h2>PAY FOR<br /><em>YOUR ORDER.</em></h2>
              <p className="payment-copy">
                Transfer the exact order amount to the Haven account below. Keep your transfer receipt.
              </p>

              <div className="bank-card">
                <div><span>BANK</span><strong>{PAYMENT_ACCOUNT.bank}</strong></div>
                <div><span>ACCOUNT NAME</span><strong>{PAYMENT_ACCOUNT.accountName}</strong></div>
                <div>
                  <span>ACCOUNT NUMBER</span>
                  <strong className="account-number">{PAYMENT_ACCOUNT.accountNumber}</strong>
                </div>
                <button type="button" className="copy-account" onClick={copyAccountNumber}>
                  {copied ? "COPIED ✓" : "COPY ACCOUNT NUMBER"}
                </button>
              </div>

              <div className="payment-amount">
                <span>AMOUNT TO TRANSFER</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <button type="button" className="primary-btn" onClick={markPaymentSubmitted}>
                I'VE MADE THE PAYMENT ↗
              </button>
            </div>

            <aside className="checkout-summary">
              <p className="red-kicker">ORDER</p>
              <div className="order-number">{orderId}</div>
              {cart.map((item) => (
                <div className="checkout-item" key={item.key}>
                  <img src={item.image} alt={item.name} />
                  <div><strong>{item.name}</strong><span>{item.color} / {item.size} × {item.quantity}</span></div>
                  <b>{formatPrice(item.price * item.quantity)}</b>
                </div>
              ))}
              <div className="checkout-total"><span>{totalItems} ITEMS</span><strong>{formatPrice(total)}</strong></div>
            </aside>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page checkout-page">
      <div className="section">
        <div className="section-label">01 / CHECKOUT</div>
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={submitOrder}>
            <p className="red-kicker">DELIVERY DETAILS</p>
            <h2>WHERE SHOULD<br /><em>WE SEND IT?</em></h2>
            <label>FULL NAME<input required name="name" value={form.name} onChange={update} placeholder="Your name" /></label>
            <label>EMAIL<input required type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" /></label>
            <label>PHONE NUMBER<input required name="phone" value={form.phone} onChange={update} placeholder="0800 000 0000" /></label>
            <label>DELIVERY ADDRESS<textarea required name="address" value={form.address} onChange={update} rows="4" placeholder="House number, street, area" /></label>
            <label>CITY / STATE<input required name="city" value={form.city} onChange={update} placeholder="Lagos, Nigeria" /></label>

            {error && (
           <p style={{ color: "red", marginBottom: "20px" }}>
           {error}
           </p>
            )}
            <div className="payment-method-note">
              <span>PAYMENT METHOD</span>
              <strong>🏦 BANK TRANSFER</strong>
              <p>Your Haven account details will appear on the next step.</p>
            </div>

          <button className="primary-btn full-btn" type="submit" disabled={submitting}
          >
            {submitting ? "CREATING ORDER..." : "CONTINUE TO PAYMENT ↗"}
           </button>
          </form>

          <aside className="checkout-summary">
            <p className="red-kicker">YOUR ORDER</p>
            {cart.map((item) => (
              <div className="checkout-item" key={item.key}>
                <img src={item.image} alt={item.name} />
                <div><strong>{item.name}</strong><span>{item.color} / {item.size} × {item.quantity}</span></div>
                <b>{formatPrice(item.price * item.quantity)}</b>
              </div>
            ))}
            <div className="checkout-total"><span>{totalItems} ITEMS</span><strong>{formatPrice(total)}</strong></div>
            <p className="summary-note">Your payment is only marked as received after verification by the backend/payment provider.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
