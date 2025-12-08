// backend/index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 10000;

// ---------------- DATABASE CONNECTION ----------------

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test database connection on startup
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
})();

app.use(cors());
app.use(express.json());

// ---------------- ROOT ROUTE ----------------

app.get("/", (req, res) => {
  res.send("Inventory backend is running");
});

// ---------------- DATABASE TEST ROUTE ----------------

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({
      status: "ok",
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      database: "not connected",
      message: err.message,
    });
  }
});

// ---------------- SETUP ROUTE (RUN ONCE) ----------------

app.post("/api/setup", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        buying_price INTEGER NOT NULL,
        selling_price INTEGER NOT NULL,
        stock INTEGER NOT NULL
      );
    `);

    const countResult = await client.query("SELECT COUNT(*) FROM products;");
    const count = parseInt(countResult.rows[0].count, 10);

    if (count === 0) {
      await client.query(`
        INSERT INTO products (name, category, buying_price, selling_price, stock)
        VALUES
          ('Dell Inspiron Laptop 14"', 'Laptops', 52000, 62000, 8),
          ('HP Pavilion Laptop 15"', 'Laptops', 48000, 58000, 4),
          ('Samsung Galaxy A55', 'Mobiles', 26000, 30500, 12),
          ('Redmi Note 13 Pro', 'Mobiles', 19000, 22999, 3),
          ('Logitech Wireless Mouse M185', 'Accessories', 450, 799, 25),
          ('Dell Wireless Keyboard', 'Accessories', 900, 1499, 5),
          ('Office Chair Ergonomic', 'Furniture', 3200, 4499, 6),
          ('Gaming Chair High Back', 'Furniture', 7200, 9999, 2),
          ('HP LaserJet Printer', 'Printers', 8200, 10499, 7),
          ('A4 Paper Pack 500 Sheets', 'Stationery', 210, 349, 40);
      `);
    }

    await client.query("COMMIT");
    res.json({ success: true, message: "Setup completed successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({
      success: false,
      message: "Setup failed",
      error: err.message,
    });
  } finally {
    client.release();
  }
});

// ---------------- PRODUCTS API ----------------

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, buying_price, selling_price, stock
       FROM products
       ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: err.message,
    });
  }
});

// ---------------- START SERVER ----------------

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
