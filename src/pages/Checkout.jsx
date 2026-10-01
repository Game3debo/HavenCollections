import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../data/products";
import { useCart } from "../context/CartContext";

const API_URL = "https://havenbackend-eight.vercel.app/api";

const PAYMENT_ACCOUNT = {
  bank: "MONIEPOINT MICROFINANCE BANK",
  accountName: "CHIMA EJIMOFOR",
  accountNumber: "8101010478",
};

export default function Checkout() {
  const { cart, total, totalItems, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const [paymentStatus, setPaymentStatus] = useState("not_started");
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      paymentStatus !== "pending_verification" ||
      !orderId
    ) {
      return;
    }

    const numericOrderId = orderId.replace("HVN-", "");

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(
          `${API_URL}/orders/${numericOrderId}/status`
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data.payment_status === "PAID") {
          setPaymentStatus("paid");
        }
      } catch (error) {
        console.error(
          "PAYMENT STATUS CHECK ERROR:",
          error
        );
      }
    };

    checkPaymentStatus();

    const interval = setInterval(
      checkPaymentStatus,
      3000
    );

    return () => clearInterval(interval);
  }, [paymentStatus, orderId]);

  if (
    !cart.length &&
    paymentStatus === "not_started"
  ) {
    return (
      <section className="page empty-page">
        <h1>
          NOTHING TO
          <br />
          <em>CHECK OUT.</em>
        </h1>

        <Link
          className="primary-btn"
          to="/shop"
        >
          GO TO SHOP ↗
        </Link>
      </section>
    );
  }

  const update = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(
        PAYMENT_ACCOUNT.accountNumber
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error(
        "COPY ERROR:",
        error
      );

      setCopied(false);
    }
  };

  const submitOrder = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customer_name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            total: total,

            items: cart.map((item) => ({
              product_id: item.productId,
              product_name: item.name,
              color: item.color || null,
              size: item.size || null,
              quantity: item.quantity,
              price: item.price,
            })),
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create order"
        );
      }

      if (!data.order || !data.order.id) {
        throw new Error(
          "Order was created but no order ID was returned."
        );
      }

      const backendOrderId = data.order.id;

      setOrderId(`HVN-${backendOrderId}`);
      setPaymentStatus("awaiting_payment");
    } catch (error) {
      console.error(
        "CHECKOUT ERROR:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while creating your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const markPaymentSubmitted = () => {
    setPaymentStatus(
      "pending_verification"
    );

    clearCart();
  };

  /*
   * PAYMENT CONFIRMED
   */
  if (paymentStatus === "paid") {
    return (
      <section className="page section success-page">
        <span className="payment-success-icon">
          ✓
        </span>

        <p className="red-kicker">
          PAYMENT VERIFIED
        </p>

        <h2>
          PAYMENT
          <br />
          <em>CONFIRMED.</em>
        </h2>

        <p className="payment-copy">
          Your payment has been verified
          successfully. Your Haven order is now
          being processed.
        </p>

        <div className="payment-receipt-mini">
          <div>
            <span>ORDER NUMBER</span>
            <strong>{orderId}</strong>
          </div>

          <div>
            <span>AMOUNT</span>
            <strong>
              {formatPrice(total)}
            </strong>
          </div>
        </div>

        <Link
          className="primary-btn"
          to="/shop"
        >
          CONTINUE SHOPPING ↗
        </Link>
      </section>
    );
  }

  /*
   * PAYMENT PENDING
   */
  if (
    paymentStatus ===
    "pending_verification"
  ) {
    return (
      <section className="page section success-page">
        <span className="payment-pending-icon">
          ✓
        </span>

        <p className="red-kicker">
          PAYMENT SUBMITTED
        </p>

        <h2>
          PAYMENT
          <br />
          <em>PENDING.</em>
        </h2>

        <p className="payment-copy">
          Your payment has been submitted and
          is waiting for verification.
        </p>

        <div className="payment-receipt-mini">
          <div>
            <span>ORDER NUMBER</span>
            <strong>{orderId}</strong>
          </div>

          <div>
            <span>AMOUNT</span>
            <strong>
              {formatPrice(total)}
            </strong>
          </div>
        </div>

        <p className="payment-copy">
          Once your payment is verified, this
          page will update automatically.
        </p>

        <p className="payment-copy">
          Please keep your order number for
          reference.
        </p>
      </section>
    );
  }

  /*
   * PAYMENT DETAILS
   */
  if (
    paymentStatus ===
    "awaiting_payment"
  ) {
    return (
      <section className="page section">
        <div className="payment-layout">

          <div>
            <p className="red-kicker">
              ORDER CREATED
            </p>

            <h2>
              COMPLETE YOUR
              <br />
              <em>PAYMENT.</em>
            </h2>

            <p className="payment-copy">
              Your order has been created.
              Please transfer the exact amount
              below using the account details
              provided.
            </p>

            <div className="order-number">
              <span>
                ORDER NUMBER
              </span>
              <br />
              {orderId}
            </div>

            <div className="bank-card">

              <div>
                <span>BANK</span>

                <strong>
                  {PAYMENT_ACCOUNT.bank}
                </strong>
              </div>

              <div>
                <span>
                  ACCOUNT NAME
                </span>

                <strong>
                  {PAYMENT_ACCOUNT.accountName}
                </strong>
              </div>

              <div>
                <span>
                  ACCOUNT NUMBER
                </span>

                <strong className="account-number">
                  {PAYMENT_ACCOUNT.accountNumber}
                </strong>
              </div>

              <button
                type="button"
                className="copy-account"
                onClick={
                  copyAccountNumber
                }
              >
                {copied
                  ? "ACCOUNT NUMBER COPIED"
                  : "COPY ACCOUNT NUMBER"}
              </button>

            </div>

            <div className="payment-amount">
              <span>
                AMOUNT TO PAY
              </span>

              <strong>
                {formatPrice(total)}
              </strong>
            </div>

            <div className="payment-method-note">
              <span>
                PAYMENT METHOD
              </span>

              <strong>
                BANK TRANSFER
              </strong>

              <p>
                Transfer the exact amount to
                the account above. After making
                your payment, click the button
                below to submit your payment for
                verification.
              </p>
            </div>

            <br />

            <button
              type="button"
              className="primary-btn"
              onClick={
                markPaymentSubmitted
              }
            >
              I HAVE MADE THE PAYMENT ↗
            </button>

          </div>

        </div>
      </section>
    );
  }

  /*
   * CHECKOUT FORM
   */
  return (
    <section className="page checkout-page">

      <div className="checkout-header">
        <h1>
          CHECK
          <br />
          <em>OUT.</em>
        </h1>

        <p>
          {totalItems} item
          {totalItems !== 1
            ? "s"
            : ""}{" "}
          in your order
        </p>
      </div>

      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}

      <div className="checkout-layout">

        <form
          className="checkout-form"
          onSubmit={submitOrder}
        >
          <h2>
            DELIVERY DETAILS
          </h2>

          <div className="form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={update}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={update}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Delivery Address
            </label>

            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={update}
              placeholder="Enter your delivery address"
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">
              City
            </label>

            <input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={update}
              placeholder="Enter your city"
              required
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={submitting}
          >
            {submitting
              ? "CREATING ORDER..."
              : "CONTINUE TO PAYMENT ↗"}
          </button>
        </form>

        <aside className="checkout-summary">

          <h2>
            YOUR ORDER
          </h2>

          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.color}-${item.size}`}
              className="checkout-item"
            >
              <div>
                <strong>
                  {item.name}
                </strong>

                <span>
                  {item.color &&
                    `Color: ${item.color}`}
                </span>

                <span>
                  {item.size &&
                    `Size: ${item.size}`}
                </span>

                <span>
                  Qty: {item.quantity}
                </span>
              </div>

              <b>
                {formatPrice(
                  item.price *
                    item.quantity
                )}
              </b>
            </div>
          ))}

          <div className="checkout-total">
            <span>
              TOTAL
            </span>

            <strong>
              {formatPrice(total)}
            </strong>
          </div>

        </aside>

      </div>
    </section>
  );
}