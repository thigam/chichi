// server/routes/airportRoutes.js
const express = require('express');
const pool    = require('../db');
const router  = express.Router();

router.get('/', async (req, res) => {
  try {
    // Now also select `city`
    const { rows } = await pool.query(`
      SELECT code, name, city
      FROM airports
      ORDER BY code
    `);
    res.json(rows);
  } catch (err) {
    console.error('[/api/airports] error:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

