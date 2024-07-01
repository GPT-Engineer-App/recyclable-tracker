import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const BoundingBoxSelector = () => {
  const [mode, setMode] = useState('square'); // Modes: square, circle, waypoint
  const [screenshot, setScreenshot] = useState(null);
  const [detections, setDetections] = useState([]);
  const webcamRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      const model = await cocoSsd.load();
      return model;
    };

    loadModel().then((model) => {
      const interval = setInterval(() => {
        detectObjects(model);
      }, 1000);

      return () => clearInterval(interval);
    });
  }, []);

  const detectObjects = async (model) => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const predictions = await model.detect(video);
      setDetections(predictions);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setScreenshot(imageSrc);
    console.log(imageSrc); // This is where you would process the image for container detection
  };

  const handleBoundingBox = () => {
    // Logic to add bounding boxes to the screenshot
    console.log("Bounding boxes added to the screenshot");
  };

  const analyzeScreenshot = () => {
    // Logic to analyze the screenshot
    console.log("Screenshot analyzed");
  };

  const transferBoundingBoxes = () => {
    // Logic to transfer bounding boxes to the live stream
    console.log("Bounding boxes transferred to the live stream");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Select Bounding Box Mode</h2>
      <div className="mb-4">
        <button onClick={() => handleModeChange('square')} className={`mr-2 ${mode === 'square' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Square</button>
        <button onClick={() => handleModeChange('circle')} className={`mr-2 ${mode === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Circle</button>
        <button onClick={() => handleModeChange('waypoint')} className={`mr-2 ${mode === 'waypoint' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Waypoint</button>
      </div>
      <div className="mt-4">
        <button onClick={capture} className="bg-green-500 text-white p-2">Capture Image</button>
        <button onClick={handleBoundingBox} className="bg-yellow-500 text-white p-2 ml-2">Add Bounding Boxes</button>
        <button onClick={analyzeScreenshot} className="bg-red-500 text-white p-2 ml-2">Analyze Screenshot</button>
        <button onClick={transferBoundingBoxes} className="bg-blue-500 text-white p-2 ml-2">Transfer Bounding Boxes</button>
      </div>
      
      <div>
        {mode === 'square' && <p>Click and drag to create a square bounding box.</p>}
        {mode === 'circle' && <p>Click and drag to create a circular bounding box.</p>}
        {mode === 'waypoint' && <p>Click to create waypoints and form a custom bounding box.</p>}
      </div>
      
      {screenshot && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Screenshot</h3>
          <img src={screenshot} alt="Screenshot" />
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Live Stream Detections</h3>
        {detections.map((detection, index) => (
          <div key={index} className="mb-2">
            <p>{detection.class} - {Math.round(detection.score * 100)}%</p>
          </div>
        ))}
        <p>Total Objects Detected: {detections.length}</p>
      </div>
    </div>
  );
};

export default BoundingBoxSelector;