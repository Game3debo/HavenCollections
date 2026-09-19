const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  deleteAllOrders,
  verifyPayment,
  updateOrderStatus,
} = require("../controller/orderController");

const protectAdmin = require("../middleware/authMiddleware");


router.post("/", createOrder);

router.get("/", getOrders);

router.delete("/", deleteAllOrders);

router.patch("/:id/payment",  protectAdmin, verifyPayment);

router.patch(
  "/:orderId/status",
  protectAdmin,
  updateOrderStatus
);
module.exports = router;

