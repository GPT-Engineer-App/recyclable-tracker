import React, { useState } from 'react';
import BoundingBoxSelector from '../components/BoundingBoxSelector.jsx';
import Webcam from 'react-webcam';

const ObjectDetection = () => {
  const [cameraFacingMode, setCameraFacingMode] = useState('user');

  const handleCameraChange = (e) => {
    setCameraFacingMode(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Object Detection</h1>
      <p className="text-lg mb-4">Use this tab to start the object detection process.</p>
      <p className="text-lg">Select an area by clicking and dragging to create a bounding box or use waypoints to create a custom shape.</p>
      <div className="my-4">
        <label className="block text-lg font-bold mb-2">Select Camera:</label>
        <select value={cameraFacingMode} onChange={handleCameraChange} className="p-2 border rounded">
          <option value="user">Front Camera</option>
          <option value="environment">Back Camera</option>
        </select>
      </div>

      <div className="my-4">
        <Webcam
          audio={false}
          height={480}
          screenshotFormat="image/jpeg"
          width={640}
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: cameraFacingMode
          }}
        />
      </div>
      <BoundingBoxSelector />
    </div>
  );
};

export default ObjectDetection;