import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Quality from "./pages/Quality";
import Locations from "./pages/Locations";
import Contact from "./pages/Contact";
import { CartProvider } from "./context/CartContext";
import AdminOrders from "./pages/AdminOrders";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";

function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/login" replace />}
          />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/orders"
            element={
              <AdminProtectedRoute>
                <AdminOrders />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </CartProvider>
  );
}

export default App;