import React from 'react';

// Flight Card Component
export function FlightCard({ flight }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4 flex justify-between">
      <div>
        <div className="flex items-center mb-2">
          <span className="text-sm text-gray-500 mr-2">{flight.carrierName}</span>
          <span className="font-bold">{flight.flightNumber}</span>
        </div>
        <div className="flex space-x-6">
          <div>
            <p className="text-lg font-semibold">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-sm text-gray-500">{flight.originCode}</p>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mx-2">Direct</span>
          </div>
          <div>
            <p className="text-lg font-semibold">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-sm text-gray-500">{flight.destCode}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-blue-600">${flight.price}</p>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Select</button>
      </div>
    </div>
  );
}
