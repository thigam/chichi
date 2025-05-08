const express = require('express');
const router = express.Router();
const { fetchFlights } = require('../controllers/flightController');

router.get('/', fetchFlights);

module.exports = router;

