const pool = require("../config/db");
const webpush = require("web-push");


// ======================================================
// CREATE ORDER
// ======================================================
const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      customer_name,
      email,
      phone,
      address,
      city,
      total,
      items,
    } = req.body;

    // Validate customer information
    if (
      !customer_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      total === undefined ||
      total === null
    ) {
      return res.status(400).json({
        message: "Please provide all customer and order details",
      });
    }

    // Validate cart
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    await client.query("BEGIN");

    // Create the main order
    const orderResult = await client.query(
      `INSERT INTO orders
      (
        customer_name,
        email,
        phone,
        address,
        city,
        total
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        customer_name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        address.trim(),
        city.trim(),
        total,
      ]
    );

    const order = orderResult.rows[0];

    // Save every product in the order
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items
        (
          order_id,
          product_id,
          product_name,
          color,
          size,
          quantity,
          price
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          order.id,
          item.product_id,
          item.product_name,
          item.color || null,
          item.size || null,
          item.quantity,
          item.price,
        ]
      );
    }

    await client.query("COMMIT");

    // Send notification to all subscribed admin devices
try {
  const subscriptionsResult = await pool.query(
    "SELECT id, subscription FROM push_subscriptions"
  );

  const notificationPayload = JSON.stringify({
    title: "Haven - New Order 🔔",
    body: `New order #${order.id} has been placed by ${customer_name}.`,
  });

  for (const row of subscriptionsResult.rows) {
    try {
      await webpush.sendNotification(
        row.subscription,
        notificationPayload
      );
    } catch (pushError) {
      console.error(
        "PUSH NOTIFICATION ERROR:",
        pushError
      );

      // Remove expired/invalid subscriptions
      if (
        pushError.statusCode === 404 ||
        pushError.statusCode === 410
      ) {
        await pool.query(
          "DELETE FROM push_subscriptions WHERE id = $1",
          [row.id]
        );
      }
    }
  }
}

catch (notificationError) {
  console.error(
    "NOTIFICATION ERROR:",
    notificationError
  );
}

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("ORDER ERROR:", error);

    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });

  } finally {
    client.release();
  }
};


// ======================================================
// GET ALL ORDERS - ADMIN
// ======================================================
const getOrders = async (req, res) => {
  try {
    const ordersResult = await pool.query(
      `SELECT *
       FROM orders
       ORDER BY created_at DESC`
    );

    const orders = [];

    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `SELECT
          product_id,
          product_name,
          color,
          size,
          quantity,
          price
         FROM order_items
         WHERE order_id = $1`,
        [order.id]
      );

      orders.push({
        ...order,
        items: itemsResult.rows,
      });
    }

    return res.json(orders);

  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


// ======================================================
// GET ONE ORDER STATUS - CUSTOMER
// ======================================================
const getOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        id,
        payment_status,
        status
       FROM orders
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json(result.rows[0]);

  } catch (error) {
    console.error("GET ORDER STATUS ERROR:", error);

    return res.status(500).json({
      message: "Failed to check order status",
    });
  }
};


// ======================================================
// DELETE ALL ORDERS - ADMIN
// ======================================================
const deleteAllOrders = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete order items first
    await client.query("DELETE FROM order_items");

    // Then delete orders
    await client.query("DELETE FROM orders");

    await client.query("COMMIT");

    return res.json({
      message: "All orders deleted successfully",
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("DELETE ORDERS ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete orders",
      error: error.message,
    });

  } finally {
    client.release();
  }
};


// ======================================================
// VERIFY PAYMENT - ADMIN
// ======================================================
const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE orders
       SET
         payment_status = 'PAID',
         status = 'Payment Confirmed'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json({
      message: "Payment verified successfully",
      order: result.rows[0],
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};


// ======================================================
// UPDATE ORDER STATUS - ADMIN
// ======================================================
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Payment Pending",
      "Payment Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json({
      message: "Order status updated successfully",
      order: result.rows[0],
    });

  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return res.status(500).json({
      message: "Failed to update order status",
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================
module.exports = {
  createOrder,
  getOrders,
  getOrderStatus,
  deleteAllOrders,
  verifyPayment,
  updateOrderStatus,
};