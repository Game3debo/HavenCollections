import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.removeItem("havenAdminToken");
  localStorage.removeItem("havenAdmin");

  navigate("/admin/login");
};

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

     const token = localStorage.getItem("havenAdminToken");

const response = await fetch(
  "https://haven-collections-blue.vercel.app/api/orders",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);
      setError("Unable to load orders. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };
  const verifyPayment = async (orderId) => {
  const confirmed = window.confirm(
    "Have you checked the Moniepoint transfer and confirmed that this payment was received?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const token = localStorage.getItem("havenAdminToken");

const response = await fetch(
  `https://haven-collections-blue.vercel.app/api/orders/${orderId}/payment`,
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify payment");
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? { ...order, payment_status: "PAID" }
          : order
      )
    );

    alert("Payment verified successfully.");

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    alert("Something went wrong while verifying payment.");
  }
};
  const clearAllOrders = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete ALL orders? This cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  try {
   const token = localStorage.getItem("havenAdminToken");

const response = await fetch(
  "https://haven-collections-blue.vercel.app/api/orders",
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
    if (!response.ok) {
      throw new Error("Failed to delete orders");
    }

    alert("All orders have been cleared.");

    setOrders([]);

  } catch (error) {
    console.error("CLEAR ORDERS ERROR:", error);

    alert("Something went wrong while clearing orders.");
  }
};
 const updateStatus = async (orderId, status) => {
  try {
    const token = localStorage.getItem("havenAdminToken");

    const response = await fetch(
      `https://haven-collections-blue.vercel.app/api/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update status");
    }

    alert("Order status updated successfully!");

    fetchOrders();
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    alert(error.message || "Something went wrong.");
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return `₦${Number(price || 0).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>
          Loading orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.error}>
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button onClick={fetchOrders} style={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          
          <p style={styles.smallTitle}>HAVEN ADMIN</p>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>
            View and manage customer orders.
          </p>
          <button onClick={handleLogout}>
  LOGOUT
</button>
        </div>

       <div style={styles.buttonGroup}>

  <button onClick={fetchOrders} style={styles.refreshButton}>
    ↻ Refresh Orders
  </button>

  <button onClick={clearAllOrders} style={styles.clearButton}>
    🗑 Clear All Orders
  </button>

</div>
      </div>

      <div style={styles.summary}>
        <div style={styles.summaryCard}>
          <span>Total Orders: </span>
          <strong>{orders.length}</strong>
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <h2>No orders yet</h2>
          <p>Customer orders will appear here once they place an order.</p>
        </div>
      ) : (
        <div style={styles.ordersContainer}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={{ marginTop: "15px" }}>
  <strong>Order Status:</strong>

  <select
    value={order.status || "Payment Pending"}
    onChange={(e) =>
      updateStatus(order.id, e.target.value)
    }
    style={{
      marginLeft: "10px",
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ddd",
    }}
  >
    <option value="Payment Pending">
      Payment Pending
    </option>

    <option value="Payment Confirmed">
      Payment Confirmed
    </option>

    <option value="Processing">
      Processing
    </option>

    <option value="Shipped">
      Shipped
    </option>

    <option value="Delivered">
      Delivered
    </option>
  </select>
</div>
              {/* ORDER HEADER */}
              <div style={styles.orderHeader}>
                <div>
                  <span style={styles.orderLabel}>ORDER</span>
                  <h2 style={styles.orderId}>
                    #{order.id}
                  </h2>
                </div>

                <div style={styles.date}>
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "Date unavailable"}
                </div>
              </div>

              {/* CUSTOMER INFORMATION */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  Customer Information
                </h3>

                <div style={styles.infoGrid}>
                  <div>
                    <span style={styles.label}>Name</span>
                    <p>{order.customer_name || "—"}</p>
                  </div>

                  <div>
                    <span style={styles.label}>Email</span>
                    <p>{order.email || "—"}</p>
                  </div>

                  <div>
                    <span style={styles.label}>Phone</span>
                    <p>{order.phone || "—"}</p>
                  </div>
                </div>
              </div>

              {/* DELIVERY INFORMATION */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  Delivery Information
                </h3>

                <div style={styles.infoGrid}>
                  <div>
                    <span style={styles.label}>Address</span>
                    <p>{order.address || "—"}</p>
                  </div>

                  <div>
                    <span style={styles.label}>City</span>
                    <p>{order.city || "—"}</p>
                  </div>
                </div>
              </div>

              {/* PRODUCTS */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  Order Items
                </h3>

                {order.items && order.items.length > 0 ? (
                  <div style={styles.itemsContainer}>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        style={styles.item}
                      >
                        <div style={styles.itemMain}>
                          <h4>
                            {item.product_name || "Product"}
                          </h4>

                          <p>
                            Product ID:{" "}
                            {item.product_id || "—"}
                          </p>
                        </div>

                        <div style={styles.itemDetails}>
                          <div>
                            <span style={styles.label}>
                              Color
                            </span>
                            <strong>
                              {item.color || "—"}
                            </strong>
                          </div>

                          <div>
                            <span style={styles.label}>
                              Size
                            </span>
                            <strong>
                              {item.size || "—"}
                            </strong>
                          </div>

                          <div>
                            <span style={styles.label}>
                              Quantity
                            </span>
                            <strong>
                              {item.quantity || 0}
                            </strong>
                          </div>

                          <div>
                            <span style={styles.label}>
                              Price
                            </span>
                            <strong>
                              {formatPrice(item.price)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No items found for this order.</p>
                )}
              </div>

              {/* TOTAL */}
              <div style={styles.totalSection}>
                <span>Total Amount</span>

                <strong>
                  {formatPrice(order.total)}
                </strong>
              </div>
              {/* PAYMENT STATUS */}
<div style={styles.paymentSection}>
  <div>
    <span style={styles.label}>Payment Status</span>

    <strong
      style={{
        color:
          order.payment_status === "PAID"
            ? "green"
            : "#d71920",
      }}
    >
      {order.payment_status === "PAID"
        ? "✓ PAID"
        : "PENDING VERIFICATION"}
    </strong>
  </div>

  {order.payment_status !== "PAID" && (
    <button
      onClick={() => verifyPayment(order.id)}
      style={styles.verifyButton}
    >
      VERIFY PAYMENT
    </button>
  )}
</div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f7",
    padding: "40px 6%",
    fontFamily: "Arial, sans-serif",
    color: "#111",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "35px",
    flexWrap: "wrap",
  },

  smallTitle: {
    color: "#d71920",
    fontWeight: "700",
    letterSpacing: "2px",
    marginBottom: "8px",
  },

  title: {
    fontSize: "42px",
    margin: "0",
  },

  subtitle: {
    color: "#666",
    marginTop: "8px",
  },

  refreshButton: {
    border: "none",
    background: "#d71920",
    color: "#fff",
    padding: "13px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  summary: {
    marginBottom: "25px",
  },

  summaryCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "220px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.06)",
  },
  ordersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },

  orderCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.07)",
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    paddingBottom: "20px",
    marginBottom: "20px",
    gap: "15px",
    flexWrap: "wrap",
  },

  orderLabel: {
    fontSize: "12px",
    color: "#888",
    letterSpacing: "1px",
  },

  orderId: {
    margin: "5px 0 0",
    fontSize: "25px",
  },

  date: {
    color: "#777",
    fontSize: "14px",
  },

  section: {
    marginBottom: "25px",
  },

  sectionTitle: {
    fontSize: "17px",
    marginBottom: "15px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },

  label: {
    display: "block",
    fontSize: "12px",
    color: "#888",
    marginBottom: "5px",
  },

  infoGridP: {
    margin: 0,
  },

  item: {
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "18px",
    marginBottom: "12px",
  },

  itemMain: {
    marginBottom: "15px",
  },

  itemMainH4: {
    margin: 0,
  },

  itemMainP: {
    color: "#888",
    fontSize: "13px",
  },

  itemDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "15px",
  },

  totalSection: {
    borderTop: "2px solid #111",
    paddingTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "18px",
    marginTop: "20px",
  },

  empty: {
    background: "#fff",
    padding: "60px 20px",
    textAlign: "center",
    borderRadius: "16px",
  },

  loading: {
    textAlign: "center",
    padding: "100px 20px",
    fontSize: "20px",
  },

  error: {
    background: "#fff",
    padding: "50px",
    textAlign: "center",
    borderRadius: "16px",
  },

  retryButton: {
    marginTop: "15px",
    background: "#111",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  buttonGroup: {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
},

clearButton: {
  border: "none",
  background: "#111",
  color: "#fff",
  padding: "13px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
},
paymentSection: {
  marginTop: "20px",
  paddingTop: "20px",
  borderTop: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap",
},
verifyButton: {
  border: "none",
  background: "#d71920",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
},
};