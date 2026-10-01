import React, { useEffect, useState } from "react";

const API_URL = "https://havenbackend-eight.vercel.app/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("havenAdminToken");
  };

  const logout = () => {
    localStorage.removeItem("havenAdminToken");
    localStorage.removeItem("havenAdmin");
    window.location.href = "/admin/login";
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("havenAdminToken");
    localStorage.removeItem("havenAdmin");
    window.location.href = "/admin/login";
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${API_URL}/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);

      setError(
        error.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (orderId) => {
    setError("");
    setMessage("");

    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        `${API_URL}/orders/${orderId}/payment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to verify payment"
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          String(order.id) === String(orderId)
            ? {
                ...order,
                payment_status: "PAID",
                status: "Payment Confirmed",
              }
            : order
        )
      );

      setMessage(
        `Payment verified for order HVN-${orderId}.`
      );
    } catch (error) {
      console.error(
        "VERIFY PAYMENT ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to verify payment."
      );
    }
  };

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    setError("");
    setMessage("");

    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        `${API_URL}/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status"
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          String(order.id) === String(orderId)
            ? {
                ...order,
                status: status,
              }
            : order
        )
      );

      setMessage(
        `Order HVN-${orderId} updated to ${status}.`
      );
    } catch (error) {
      console.error(
        "UPDATE STATUS ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to update order status."
      );
    }
  };

  const deleteAllOrders = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL orders?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        `${API_URL}/orders`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete orders"
        );
      }

      setOrders([]);
      setMessage(
        "All orders have been deleted."
      );
    } catch (error) {
      console.error(
        "DELETE ORDERS ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to delete orders."
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Haven Orders
            </h1>

            <p style={styles.subtitle}>
              Manage customer orders,
              payments and deliveries.
            </p>
          </div>

          <div style={styles.headerButtons}>
            <button
              type="button"
              onClick={fetchOrders}
              style={styles.refreshButton}
            >
              REFRESH
            </button>

            <button
              type="button"
              onClick={logout}
              style={styles.logoutButton}
            >
              LOG OUT
            </button>
          </div>
        </header>

        <div style={styles.actions}>
          <strong>
            {orders.length}{" "}
            {orders.length === 1
              ? "Order"
              : "Orders"}
          </strong>

          {orders.length > 0 && (
            <button
              type="button"
              onClick={deleteAllOrders}
              style={styles.deleteButton}
            >
              DELETE ALL ORDERS
            </button>
          )}
        </div>

        {message && (
          <div style={styles.success}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div style={styles.empty}>
            <h2>No orders yet</h2>
            <p>
              Customer orders will appear here
              after checkout.
            </p>
          </div>
        ) : (
          <div style={styles.orders}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={styles.orderCard}
              >
                <div style={styles.orderHeader}>
                  <div>
                    <h2 style={styles.orderNumber}>
                      HVN-{order.id}
                    </h2>

                    <p style={styles.date}>
                      {order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleString()
                        : ""}
                    </p>
                  </div>

                  <div style={styles.statusArea}>
                    <span
                      style={{
                        ...styles.paymentBadge,
                        background:
                          order.payment_status ===
                          "PAID"
                            ? "#e8f8ed"
                            : "#fff4d6",
                        color:
                          order.payment_status ===
                          "PAID"
                            ? "#16803c"
                            : "#996c00",
                      }}
                    >
                      {order.payment_status ||
                        "PENDING"}
                    </span>

                    <span style={styles.statusBadge}>
                      {order.status ||
                        "Payment Pending"}
                    </span>
                  </div>
                </div>

                <div style={styles.section}>
                  <h3>
                    CUSTOMER
                  </h3>

                  <p>
                    <strong>
                      Name:
                    </strong>{" "}
                    {order.customer_name}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {order.email}
                  </p>

                  <p>
                    <strong>
                      Phone:
                    </strong>{" "}
                    {order.phone}
                  </p>
                </div>

                <div style={styles.section}>
                  <h3>
                    DELIVERY
                  </h3>

                  <p>
                    <strong>
                      Address:
                    </strong>{" "}
                    {order.address}
                  </p>

                  <p>
                    <strong>
                      City:
                    </strong>{" "}
                    {order.city}
                  </p>
                </div>

                <div style={styles.section}>
                  <h3>
                    ITEMS
                  </h3>

                  {order.items &&
                  order.items.length > 0 ? (
                    <div>
                      {order.items.map(
                        (item, index) => (
                          <div
                            key={`${order.id}-${index}`}
                            style={
                              styles.item
                            }
                          >
                            <div>
                              <strong>
                                {
                                  item.product_name
                                }
                              </strong>

                              <div
                                style={
                                  styles.itemDetails
                                }
                              >
                                {item.color && (
                                  <span>
                                    Color:{" "}
                                    {
                                      item.color
                                    }
                                  </span>
                                )}

                                {item.size && (
                                  <span>
                                    Size:{" "}
                                    {
                                      item.size
                                    }
                                  </span>
                                )}

                                <span>
                                  Qty:{" "}
                                  {
                                    item.quantity
                                  }
                                </span>
                              </div>
                            </div>

                            <strong>
                              ₦
                              {Number(
                                item.price *
                                  item.quantity
                              ).toLocaleString()}
                            </strong>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p>
                      No items found.
                    </p>
                  )}
                </div>

                <div style={styles.total}>
                  <span>
                    TOTAL
                  </span>

                  <strong>
                    ₦
                    {Number(
                      order.total
                    ).toLocaleString()}
                  </strong>
                </div>

                <div style={styles.controls}>

                  {order.payment_status !==
                    "PAID" && (
                    <button
                      type="button"
                      onClick={() =>
                        verifyPayment(
                          order.id
                        )
                      }
                      style={
                        styles.verifyButton
                      }
                    >
                      VERIFY PAYMENT
                    </button>
                  )}

                  <select
                    value={
                      order.status ||
                      "Payment Pending"
                    }
                    onChange={(e) =>
                      updateOrderStatus(
                        order.id,
                        e.target.value
                      )
                    }
                    style={styles.select}
                  >
                    <option>
                      Payment Pending
                    </option>

                    <option>
                      Payment Confirmed
                    </option>

                    <option>
                      Processing
                    </option>

                    <option>
                      Shipped
                    </option>

                    <option>
                      Delivered
                    </option>
                  </select>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f7",
    fontFamily: "Arial, sans-serif",
    padding: "30px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
  },

  subtitle: {
    color: "#777",
    marginTop: "8px",
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
  },

  refreshButton: {
    border: "1px solid #ddd",
    background: "#fff",
    padding: "11px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  logoutButton: {
    border: "none",
    background: "#222",
    color: "#fff",
    padding: "11px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  actions: {
    background: "#fff",
    padding: "16px 20px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  deleteButton: {
    border: "none",
    background: "#d71920",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "700",
  },

  success: {
    background: "#e8f8ed",
    color: "#16803c",
    padding: "13px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  error: {
    background: "#fff0f0",
    color: "#d71920",
    padding: "13px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  empty: {
    background: "#fff",
    padding: "50px",
    borderRadius: "15px",
    textAlign: "center",
  },

  loading: {
    textAlign: "center",
    paddingTop: "100px",
    fontSize: "20px",
  },

  orders: {
    display: "grid",
    gap: "20px",
  },

  orderCard: {
    background: "#fff",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    borderBottom: "1px solid #eee",
    paddingBottom: "18px",
    marginBottom: "20px",
  },

  orderNumber: {
    margin: 0,
  },

  date: {
    color: "#888",
    fontSize: "13px",
  },

  statusArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "7px",
  },

  paymentBadge: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  statusBadge: {
    background: "#f1f1f1",
    color: "#444",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  section: {
    marginBottom: "22px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },

  itemDetails: {
    display: "flex",
    gap: "12px",
    color: "#777",
    fontSize: "13px",
    marginTop: "5px",
    flexWrap: "wrap",
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "20px",
    fontWeight: "700",
    paddingTop: "20px",
    borderTop: "2px solid #222",
  },

  controls: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  verifyButton: {
    border: "none",
    background: "#d71920",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  select: {
    padding: "11px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    minWidth: "190px",
  },
};