const pool = require('../db');

const getFlights = async (origin, destination, date) => {
  const query = `
    SELECT f.*, da.name as departure_airport, aa.name as arrival_airport
    FROM flights f
    JOIN airports da ON f.departure_airport_id = da.airport_id
    JOIN airports aa ON f.arrival_airport_id = aa.airport_id
    WHERE da.code = $1 AND aa.code = $2 AND DATE(f.departure_time) = $3
  `;
  const values = [origin, destination, date];
  const { rows } = await pool.query(query, values);
  return rows;
};

module.exports = { getFlights };

