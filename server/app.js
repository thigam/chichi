const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const flightRoutes = require('./routes/flightRoutes');
const airportRoutes = require('./routes/airportRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/airports', airportRoutes);
app.use('/api/flights', flightRoutes);

// ─── Serve React’s build as static assets ─────────────────────────────────────
app.use(
  express.static(
    path.join(__dirname, '../client/build')
  )
);

// ─── Catch-all to return React’s index.html for any non-API route ─────────────
app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../client/build', 'index.html')
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

