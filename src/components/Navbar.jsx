import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Container Detection App</div>
        <div className="space-x-4">
          <Link to="/" className="text-white">Home</Link>
          <Link to="/object-detection" className="text-white">Object Detection</Link>
          <Link to="/training-mode" className="text-white">Training Mode</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;