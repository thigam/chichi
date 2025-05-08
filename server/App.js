const express = require('express');
const app = express();
const flightRoutes = require('./routes/flightRoutes');

app.use(express.json());
app.use('/api/flights', flightRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

