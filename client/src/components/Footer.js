import React from 'react';

// Footer Component
export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto grid grid-cols-4 gap-6">
        <div>
          <h4 className="font-bold mb-2">Chichi</h4>
          <p>Your trusted partner for exploring Africa through affordable and reliable air travel.</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Search Flights</a></li>
            <li><a href="#" className="hover:underline">Destinations</a></li>
            <li><a href="#" className="hover:underline">Travel Guides</a></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">About Us</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Our Story</a></li>
            <li><a href="#" className="hover:underline">Partners</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Connect With Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400">Facebook</a>
            <a href="#" className="hover:text-blue-400">Twitter</a>
            <a href="#" className="hover:text-blue-400">Instagram</a>
            <a href="#" className="hover:text-blue-400">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-6">
        © 2025 Chichi. All rights reserved.
      </div>
    </footer>
  );
}
