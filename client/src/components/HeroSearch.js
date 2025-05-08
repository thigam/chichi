// client/src/components/HeroSearch.js
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'white',
    borderColor:    '#e5e7eb',   // tailwind gray-200
    boxShadow:      'none',
    minHeight:      '3rem',       // h-12
    borderRadius:   '0.375rem',   // rounded-md
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 0.5rem',         // px-2
  }),
  input: (base) => ({
    ...base,
    color:   '#374151',          // gray-700
    margin:  0,
    padding: 0,
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9ca3af',            // gray-400
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#bfdbfe' : 'white',  // blue-200
    color:           state.isSelected ? 'white' : '#1f2937', // gray-800
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.375rem',
    marginTop:   '0.25rem',
    zIndex:      9999,
  }),
};

export function HeroSearch({ onSearch }) {
  const [airports, setAirports]       = useState([]);
  const [origin, setOrigin]           = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate]               = useState('');

  useEffect(() => {
    fetch('/api/airports')
      .then(r => r.json())
      .then(rows => {
        setAirports(
          rows.map(a => ({
            value: a.code,
            label: `${a.code} — ${a.city}: ${a.name}`
          }))
        );
      })
      .catch(console.error);
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (!origin || !destination || !date) return;
    onSearch({
      origin:      origin.value,
      destination: destination.value,
      date
    });
  };

  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-3">Explore Africa's Skies</h2>
        <p className="mb-8 text-lg">
          Discover the best flight deals across the African continent with our comprehensive search engine.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg inline-flex overflow-visible mx-auto space-x-2 p-2"
        >
          <Select
            className="w-48"
            classNamePrefix="react-select"
            placeholder="From"
            options={airports}
            value={origin}
            onChange={setOrigin}
            styles={{selectStyles,menuPortal: base => ({ ...base, zIndex: 9999 }),}}
	    menuPortalTarget={document.body}
  menuPosition="fixed"
          />
          <Select
            className="w-48"
            classNamePrefix="react-select"
            placeholder="To"
            options={airports}
            value={destination}
            onChange={setDestination}
            styles={{selectStyles,menuPortal: base => ({ ...base, zIndex: 9999 }),}}
            menuPortalTarget={document.body}
  menuPosition="fixed"
          />
          <input
            type="date"
            className="p-4 text-gray-800 focus:outline-none"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-6">
            Search Flights
          </button>
        </form>
      </div>
    </section>
  );
}

