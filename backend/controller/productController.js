const pool = require("../config/db");

const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      product_id,
      name,
      category,
      description,
      price,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products
      (product_id, name, category, description, price)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        product_id,
        name,
        category,
        description,
        price,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
};