const pool = require("../config/db");
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
router.post("/push-subscription", protectAdmin, async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription) {
      return res.status(400).json({
        message: "Push subscription is required",
      });
    }

    await pool.query(
      `
      INSERT INTO push_subscriptions (subscription)
      VALUES ($1)
      `,
      [JSON.stringify(subscription)]
    );

    res.status(201).json({
      message: "Push subscription saved successfully",
    });
  } catch (error) {
    console.error("SAVE PUSH SUBSCRIPTION ERROR:", error);

    res.status(500).json({
      message: "Failed to save push subscription",
    });
  }
});

module.exports = router;