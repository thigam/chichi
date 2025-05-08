const express = require('express');
const cors = require('cors');
const app = express();
const flightRoutes = require('./routes/flightRoutes');
const airportRoutes = require('./routes/airportRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/airports', airportRoutes);
app.use('/api/flights', flightRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

