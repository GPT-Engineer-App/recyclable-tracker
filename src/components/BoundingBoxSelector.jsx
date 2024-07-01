import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const BoundingBoxSelector = () => {
  const [mode, setMode] = useState('square');
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

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setScreenshot(imageSrc);
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

    if (mode === 'square') {
      setBoundingBoxes([...boundingBoxes, { x, y, width: 100, height: 100, type: 'square' }]);
    } else if (mode === 'circle') {
      setBoundingBoxes([...boundingBoxes, { x, y, radius: 50, type: 'circle' }]);
    } else if (mode === 'waypoint') {
      setBoundingBoxes([...boundingBoxes, { x, y, type: 'waypoint' }]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the webcam feed onto the canvas
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      ctx.drawImage(webcamRef.current.video, 0, 0, canvas.width, canvas.height);
    }

    // Draw bounding boxes
    boundingBoxes.forEach((box) => {
      if (box.type === 'square') {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(box.x, box.y, box.width, box.height);
      } else if (box.type === 'circle') {
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(box.x, box.y, box.radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (box.type === 'waypoint') {
        ctx.fillStyle = 'green';
        ctx.fillRect(box.x - 5, y - 5, 10, 10);
      }
    });

    // Draw object detections
    detections.forEach((detection) => {
      const [x, y, width, height] = detection.bbox;
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = 'yellow';
      ctx.font = '16px Arial';
      ctx.fillText(`${detection.class} - ${Math.round(detection.score * 100)}%`, x, y > 10 ? y - 5 : 10);
    });
  }, [boundingBoxes, detections]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Bounding Box Selector</h2>
      <div className="mb-4">
        <button onClick={() => handleModeChange('square')} className={`mr-2 px-4 py-2 rounded ${mode === 'square' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Square</button>
        <button onClick={() => handleModeChange('circle')} className={`mr-2 px-4 py-2 rounded ${mode === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Circle</button>
        <button onClick={() => handleModeChange('waypoint')} className={`mr-2 px-4 py-2 rounded ${mode === 'waypoint' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Waypoint</button>
      </div>
      <div className="mt-4">
        <button onClick={capture} className="bg-green-500 text-white p-2 rounded mr-2">Capture Image</button>
        <button onClick={handleBoundingBox} className="bg-yellow-500 text-white p-2 rounded mr-2">Add Bounding Boxes</button>
        <button onClick={analyzeScreenshot} className="bg-red-500 text-white p-2 rounded mr-2">Analyze Screenshot</button>
        <button onClick={transferBoundingBoxes} className="bg-blue-500 text-white p-2 rounded">Transfer Bounding Boxes</button>
      </div>
      
      <div className="mt-4">
        <p>Current mode: {mode === 'square' ? 'Square' : mode === 'circle' ? 'Circle' : 'Waypoint'}</p>
        <p>{mode === 'square' || mode === 'circle' ? 'Click to create a bounding box.' : 'Click to create waypoints.'}</p>
      </div>
      
      <div className="mt-4 relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          width={640}
          height={480}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user"
          }}
          style={{ display: 'none' }}
        />
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={480} 
          onClick={handleCanvasClick} 
          className="border mt-4"
        />
      </div>

      {screenshot && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Screenshot</h3>
          <img src={screenshot} alt="Screenshot" className="border" />
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Detections</h3>
        <p>Total Objects Detected: {detections.length}</p>
      </div>
    </div>
  );
};

export default BoundingBoxSelector;
