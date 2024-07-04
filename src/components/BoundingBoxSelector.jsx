import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const BoundingBoxSelector = () => {
  const [screenshot, setScreenshot] = useState(null);
  const [detections, setDetections] = useState([]);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

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

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setBoundingBoxes([...boundingBoxes, { x, y, width: 100, height: 100, type: 'square' }]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boundingBoxes.forEach((box) => {
      if (box.type === 'square') {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(box.x, box.y, box.width, box.height);
      }
    });
  }, [boundingBoxes]);

  return (
    <div className="container mx-auto p-4">
      <div className="mt-4">
        <button onClick={capture} className="bg-green-500 text-white p-2">Capture Image</button>
        <button onClick={handleBoundingBox} className="bg-yellow-500 text-white p-2 ml-2">Add Bounding Boxes</button>
        <button onClick={analyzeScreenshot} className="bg-red-500 text-white p-2 ml-2">Analyze Screenshot</button>
        <button onClick={transferBoundingBoxes} className="bg-blue-500 text-white p-2 ml-2">Transfer Bounding Boxes</button>
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

      <canvas ref={canvasRef} width="640" height="480" onClick={handleCanvasClick} className="border mt-4"></canvas>
    </div>
  );
};

export default BoundingBoxSelector;