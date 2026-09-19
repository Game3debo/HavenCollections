const pool = require("../config/db");

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
      items
    } = req.body;

    if (!customer_name || !email || !phone || !address || !city || !total) {
      return res.status(400).json({
        message: "Please provide all customer and order details"
      });
    }

    if (!items || !items.length) {
      return res.status(400).json({
        message: "Order must contain at least one item"
      });
    }

    await client.query("BEGIN");

    const orderResult = await client.query(
      `INSERT INTO orders
      (customer_name, email, phone, address, city, total)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        customer_name,
        email,
        phone,
        address,
        city,
        total
      ]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items
        (order_id, product_id, product_name, color, size, quantity, price)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          order.id,
          item.product_id,
          item.product_name,
          item.color,
          item.size,
          item.quantity,
          item.price
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order created successfully",
      order
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });

  } finally {
    client.release();
  }
};


const getOrders = async (req, res) => {
  try {
    const ordersResult = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
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
        items: itemsResult.rows
      });
    }

    res.json(orders);

  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};
const deleteAllOrders = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete the order items first
    await client.query("DELETE FROM order_items");

    // Then delete the orders
    await client.query("DELETE FROM orders");

    await client.query("COMMIT");

    res.json({
      message: "All orders deleted successfully",
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("DELETE ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to delete orders",
      error: error.message,
    });

  } finally {
    client.release();
  }
};
const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE orders
       SET payment_status = 'PAID'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Payment verified successfully",
      order: result.rows[0],
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    res.status(500).json({
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};
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
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order status updated successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    res.status(500).json({
      message: "Failed to update order status",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  deleteAllOrders,
  verifyPayment,
  updateOrderStatus,
};
