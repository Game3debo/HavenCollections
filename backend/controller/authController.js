const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check that both fields were provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find admin by email
    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const admin = result.rows[0];

    // Check password against the existing hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Make sure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables");

      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    // Create admin login token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [
        name,
        email.trim().toLowerCase(),
        hashedPassword,
      ]
    );

    return res.status(201).json({
      message: "Account created successfully",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("REGISTER USER ERROR:", error);

    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};

module.exports = {
  loginAdmin,
  registerUser,
};