// client/src/App.js
import React, { useState } from 'react'
import { Header }      from './components/Header'
import { HeroSearch }  from './components/HeroSearch'
import { FlightCard }  from './components/FlightCard'
import { Footer }      from './components/Footer'

export default function App() {
  const [flights, setFlights] = useState([])

  const handleSearch = async ({ origin, destination, date }) => {
    try {
      const res  = await fetch(`/api/flights?origin=${origin}&destination=${destination}&date=${date}`)
      const data = await res.json()
      setFlights(data)
    } catch (err) {
      console.error(err)
      setFlights([])
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* This is your big blue hero + search bar */}
      <HeroSearch onSearch={handleSearch} />

      <main className="container mx-auto flex-1 p-6">
        {flights.length === 0 ? (
          <p className="text-center text-gray-600">No flights found for your criteria.</p>
        ) : (
          flights.map(f => (
            <FlightCard
              key={`${f.flight_number}-${f.departure_time}`}
              flight={{
                carrierName:   f.airline_code || f.airline_id,
                flightNumber:  f.flight_number,
                originCode:    f.departure_airport,
                destCode:      f.arrival_airport,
                departureTime: f.departure_time,
                arrivalTime:   f.arrival_time,
                price:         f.price
              }}
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  )
}

