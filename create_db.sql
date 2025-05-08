-- 1) Create the database
DROP DATABASE IF EXISTS flight_booking;
CREATE DATABASE flight_booking
  WITH OWNER = CURRENT_USER
       ENCODING = 'UTF8'
       LC_COLLATE = 'en_US.utf8'
       LC_CTYPE   = 'en_US.utf8'
       TEMPLATE    = template0;
\c flight_booking

-- 2) Enable PostGIS (for airports.location geography)
CREATE EXTENSION IF NOT EXISTS postgis;

BEGIN;

-- 3) Airlines
CREATE TABLE public.airlines (
  airline_id   SERIAL PRIMARY KEY,
  name         VARCHAR(255)  NOT NULL,
  code         VARCHAR(10)   NOT NULL,
  country      VARCHAR(100)  NOT NULL,
  contact_info TEXT
);

-- 4) Airports
CREATE TABLE public.airports (
  airport_id SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  code       VARCHAR(10)  NOT NULL,
  city       VARCHAR(100),
  country    VARCHAR(100),
  location   geography(Point,4326)
);

-- 5) Flights
CREATE TABLE public.flights (
  flight_id            SERIAL PRIMARY KEY,
  flight_number        VARCHAR(50) NOT NULL,
  airline_id           INT NOT NULL
    REFERENCES public.airlines(airline_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  departure_airport_id INT NOT NULL
    REFERENCES public.airports(airport_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  arrival_airport_id   INT NOT NULL
    REFERENCES public.airports(airport_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  departure_time       TIMESTAMP WITHOUT TIME ZONE,
  arrival_time         TIMESTAMP WITHOUT TIME ZONE,
  price                NUMERIC(10,2) NOT NULL CHECK (price >= 0)
);

-- 6) Users
CREATE TABLE public.users (
  user_id    SERIAL PRIMARY KEY,
  passport   VARCHAR(50)  NOT NULL UNIQUE,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

-- 7) Seat‐type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seat_type') THEN
    CREATE TYPE public.seat_type AS ENUM ('window', 'aisle');
  END IF;
END;
$$;

-- 8) Seats
CREATE TABLE public.seats (
  flight_id   INT               NOT NULL
    REFERENCES public.flights(flight_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
  seat_label  VARCHAR(5)        NOT NULL,    -- e.g. '12A'
  seat_type   public.seat_type  NOT NULL,
  price       NUMERIC(10,2)     NOT NULL CHECK (price > 0),
  available   BOOLEAN           NOT NULL DEFAULT TRUE,
  PRIMARY KEY (flight_id, seat_label)
);

-- 8a) Trigger to auto‐calculate seat.price
CREATE OR REPLACE FUNCTION public.calc_seat_price() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (NEW.price IS NULL OR NEW.price <= 0) THEN
    SELECT f.price
      INTO NEW.price
      FROM public.flights AS f
     WHERE f.flight_id = NEW.flight_id;

    IF NEW.seat_type = 'window' THEN
      NEW.price := ROUND(NEW.price * 1.03, 2);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_seat_price
  BEFORE INSERT OR UPDATE ON public.seats
  FOR EACH ROW
  EXECUTE FUNCTION public.calc_seat_price();

-- 9) Bookings
CREATE TABLE public.bookings (
  booking_id   SERIAL PRIMARY KEY,
  user_id      INT               NOT NULL
    REFERENCES public.users(user_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  flight_id    INT               NOT NULL,
  seat_label   VARCHAR(5)        NOT NULL,
  booked_at    TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  total_price  NUMERIC(10,2)     NOT NULL CHECK (total_price >= 0),
  status       VARCHAR(20)       NOT NULL DEFAULT 'confirmed',
  FOREIGN KEY (flight_id, seat_label)
    REFERENCES public.seats(flight_id, seat_label)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
);

-- 9a) Trigger to snapshot seat.price → booking.total_price
CREATE OR REPLACE FUNCTION public.set_booking_total_price() RETURNS TRIGGER AS $$
BEGIN
  SELECT s.price
    INTO NEW.total_price
    FROM public.seats AS s
   WHERE s.flight_id  = NEW.flight_id
     AND s.seat_label = NEW.seat_label;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_booking_price
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_booking_total_price();

COMMIT;

