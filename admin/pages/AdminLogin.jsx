import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://haven-collections-blue.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("havenAdminToken", data.token);
      localStorage.setItem(
        "havenAdmin",
        JSON.stringify(data.admin)
      );

      navigate("/admin/orders");

    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.logo}>
          HAVEN
        </div>

        <p style={styles.adminText}>
          ADMIN PORTAL
        </p>

        <h1 style={styles.title}>
          Welcome back
        </h1>

        <p style={styles.subtitle}>
          Sign in to manage Haven.
        </p>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div style={styles.inputGroup}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>

        </form>

        <p style={styles.footer}>
          Haven Admin
        </p>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#fff",
    padding: "45px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  },

  logo: {
    color: "#d71920",
    fontSize: "30px",
    fontWeight: "800",
    letterSpacing: "4px",
    textAlign: "center",
  },

  adminText: {
    textAlign: "center",
    fontSize: "11px",
    letterSpacing: "3px",
    color: "#888",
    marginTop: "8px",
  },

  title: {
    fontSize: "32px",
    marginTop: "30px",
    marginBottom: "8px",
  },

  subtitle: {
    color: "#777",
    marginBottom: "30px",
  },

  inputGroup: {
    marginBottom: "20px",
  },

  inputGroupLabel: {
    display: "block",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    marginTop: "8px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    width: "100%",
    border: "none",
    background: "#d71920",
    color: "#fff",
    padding: "15px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
    letterSpacing: "1px",
  },

  error: {
    background: "#fff0f0",
    color: "#d71920",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
  },

  footer: {
    textAlign: "center",
    color: "#aaa",
    fontSize: "12px",
    marginTop: "30px",
  },
};