const { getFlights } = require('../models/flightModel');

const fetchFlights = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    const flights = await getFlights(origin, destination, date);
    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { fetchFlights };

