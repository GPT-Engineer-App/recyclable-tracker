import React from 'react';
import BoundingBoxSelector from '../components/BoundingBoxSelector.jsx';

const ObjectDetection = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Object Detection</h1>
      <p className="text-lg mb-4">Use this tab to start the object detection process.</p>
      <p className="text-lg">Select an area by clicking and dragging to create a bounding box or use waypoints to create a custom shape.</p>
    <BoundingBoxSelector />
    </div>
  );
};

export default ObjectDetection;