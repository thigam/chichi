import React from 'react';

// Header Component
export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-xl font-bold text-blue-600">Chichi</h1>
        <nav className="space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Flights</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Destinations</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Deals</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Help</a>
        </nav>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
      </div>
    </header>
  );
}
