import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const BoundingBoxSelector = () => {
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

  return (
    <div className="container mx-auto p-4">
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