import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const BoundingBoxSelector = () => {
  const [detections, setDetections] = useState([]);
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
      drawBoundingBoxes(predictions);
    }
  };

  const drawBoundingBoxes = (predictions) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    predictions.forEach(prediction => {
      ctx.beginPath();
      ctx.rect(...prediction.bbox);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      ctx.fillStyle = 'red';
      ctx.stroke();
      ctx.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        prediction.bbox[0],
        prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
      );
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Live Stream Detections</h3>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
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