import React, { useState } from 'react';

const Settings = () => {
  const [containerType, setContainerType] = useState('aluminium');
  const [sensitivity, setSensitivity] = useState(0.5);
  const [yolov5Sensitivity, setYolov5Sensitivity] = useState(0.5); // Placeholder for YOLOv5 sensitivity
  const [deepSortTracking, setDeepSortTracking] = useState(false); // Placeholder for DeepSORT tracking
  const [error, setError] = useState(null); // Placeholder for error handling

  const handleContainerTypeChange = (e) => {
    setContainerType(e.target.value);
  };

  const handleSensitivityChange = (e) => {
    setSensitivity(e.target.value);
  };

  const handleYolov5SensitivityChange = (e) => {
    setYolov5Sensitivity(e.target.value);
  };

  const handleDeepSortTrackingChange = (e) => {
    setDeepSortTracking(e.target.checked);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Settings</h1>
      <p className="text-lg mb-4">Adjust the settings for the container detection application.</p>
      
      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">Select Container Type:</label>
        <select value={containerType} onChange={handleContainerTypeChange} className="p-2 border rounded">
          <option value="aluminium">Aluminium Cans</option>
          <option value="hdpe2">HDPE2 Plastic Bottles</option>
          <option value="pet1">PET1 Plastic Bottles</option>
          <option value="glass">Glass Bottles</option>
          <option value="milk">Milk Cartons</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">Detection Sensitivity:</label>
        <input type="range" min="0" max="1" step="0.1" value={sensitivity} onChange={handleSensitivityChange} className="w-full" />
        <p className="text-lg mt-2">Current Sensitivity: {sensitivity}</p>
      </div>

      {/* Placeholder for YOLOv5 Sensitivity */}
      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">YOLOv5 Sensitivity:</label>
        <input type="range" min="0" max="1" step="0.1" value={yolov5Sensitivity} onChange={handleYolov5SensitivityChange} className="w-full" />
        <p className="text-lg mt-2">Current YOLOv5 Sensitivity: {yolov5Sensitivity}</p>
      </div>

      {/* Placeholder for DeepSORT Tracking */}
      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">Enable DeepSORT Tracking:</label>
        <input type="checkbox" checked={deepSortTracking} onChange={handleDeepSortTrackingChange} className="mr-2" />
        <span className="text-lg">DeepSORT Tracking is {deepSortTracking ? 'Enabled' : 'Disabled'}</span>
      </div>

      {/* Error handling and logging for placeholders */}
      <div className="mb-4">
        <p className="text-red-500">
          {error && <span>Error: {error.message}</span>}
        </p>
      </div>
    </div>
  );
};

export default Settings;