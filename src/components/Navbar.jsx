import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Container Detection App</div>
        <div className="space-x-4">
          <Link to="/" className="text-white">Home</Link>
          <Link to="/about" className="text-white">About</Link>
          <Link to="/contact" className="text-white">Contact</Link>
          <Link to="/object-detection" className="text-white">Object Detection</Link>
          <Link to="/settings" className="text-white">Settings</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;