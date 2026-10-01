const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderStatus,
  deleteAllOrders,
  verifyPayment,
  updateOrderStatus,
} = require("../controller/orderController");

const protectAdmin = require("../middleware/authMiddleware");

// CUSTOMER
// Create a new order
router.post("/", createOrder);

// CUSTOMER
// Check payment/order status for one specific order
router.get("/:id/status", getOrderStatus);

// ADMIN
// Get all orders
router.get("/", protectAdmin, getOrders);

// ADMIN
// Delete all orders
router.delete("/", protectAdmin, deleteAllOrders);

// ADMIN
// Verify payment
router.patch("/:id/payment", protectAdmin, verifyPayment);

// ADMIN
// Update delivery/order status
router.patch(
  "/:orderId/status",
  protectAdmin,
  updateOrderStatus
);

module.exports = router;