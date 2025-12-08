// backend/db.js
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Database will not connect.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("Unexpected DB error", err);
  process.exit(1);
});

module.exports = pool;
