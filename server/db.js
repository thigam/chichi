// server/db.js
const { Pool } = require('pg');
require('dotenv').config(); // make sure it can read DATABASE_URL

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // you can also add ssl: { rejectUnauthorized: false } if needed in production
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;

