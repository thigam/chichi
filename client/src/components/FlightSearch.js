import React, { useState } from 'react';

const FlightSearch = () => {
  const [flights, setFlights] = useState([]);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: ''
  });

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const searchFlights = async () => {
    const query = new URLSearchParams(searchParams).toString();
    const response = await fetch(`http://localhost:5000/api/flights?${query}`);
    const data = await response.json();
    setFlights(data);
  };

  return (
    <div>
      <h2>Search Flights</h2>
      <input type="text" name="origin" placeholder="Origin (e.g., NBO)" onChange={handleChange} />
      <input type="text" name="destination" placeholder="Destination (e.g., JNB)" onChange={handleChange} />
      <input type="date" name="date" onChange={handleChange} />
      <button onClick={searchFlights}>Search</button>
      <ul>
        {flights.map(flight => (
          <li key={flight.flight_id}>
            {flight.flight_number} from {flight.departure_airport} to {flight.arrival_airport} departs at {flight.departure_time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightSearch;

