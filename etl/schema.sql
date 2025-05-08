-- Enable PostGIS extension if you plan to use geographic queries (optional)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the Airlines table
CREATE TABLE airlines (
  airline_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10) UNIQUE,
  country VARCHAR(100),
  contact_info TEXT
);

-- Create the Airports table
CREATE TABLE airports (
  airport_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100),
  location GEOGRAPHY(Point, 4326)  -- Uses PostGIS for geospatial data
);

-- Create the Flights table
CREATE TABLE flights (
  flight_id SERIAL PRIMARY KEY,
  flight_number VARCHAR(50) NOT NULL,
  airline_id INTEGER REFERENCES airlines(airline_id),
  departure_airport_id INTEGER REFERENCES airports(airport_id),
  arrival_airport_id INTEGER REFERENCES airports(airport_id),
  departure_time TIMESTAMP,
  arrival_time TIMESTAMP,
  price NUMERIC,
  UNIQUE (flight_number, departure_time)
);

