// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Inventory backend is running");
});

// ---------- DB INIT (table create) ----------
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        buying_price NUMERIC NOT NULL,
        selling_price NUMERIC NOT NULL,
        stock INTEGER NOT NULL
      );
    `);
    console.log("DB init ok (products table ready)");
  } catch (err) {
    console.error("Error during DB init:", err);
  }
}
initDb();

// ---------- API: PRODUCTS ----------

// GET all products
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, category, buying_price, selling_price, stock FROM products ORDER BY id;"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// (Optional) Add product – future use
app.post("/api/products", async (req, res) => {
  try {
    const { name, category, buyingPrice, sellingPrice, stock } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await pool.query(
      `
      INSERT INTO products (name, category, buying_price, selling_price, stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, category, buying_price, selling_price, stock;
    `,
      [name, category, buyingPrice, sellingPrice, stock]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Error creating product" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
