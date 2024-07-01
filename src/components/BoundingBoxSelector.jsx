import React, { useState } from 'react';

const BoundingBoxSelector = () => {
  const [mode, setMode] = useState('square'); // Modes: square, circle, waypoint

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Select Bounding Box Mode</h2>
      <div className="mb-4">
        <button onClick={() => handleModeChange('square')} className={`mr-2 ${mode === 'square' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Square</button>
        <button onClick={() => handleModeChange('circle')} className={`mr-2 ${mode === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Circle</button>
        <button onClick={() => handleModeChange('waypoint')} className={`mr-2 ${mode === 'waypoint' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Waypoint</button>
      </div>
      <div>
        {mode === 'square' && <p>Click and drag to create a square bounding box.</p>}
        {mode === 'circle' && <p>Click and drag to create a circular bounding box.</p>}
        {mode === 'waypoint' && <p>Click to create waypoints and form a custom bounding box.</p>}
      </div>
    </div>
  );
};

export default BoundingBoxSelector;