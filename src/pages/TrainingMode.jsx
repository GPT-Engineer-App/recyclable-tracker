import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const TrainingMode = () => {
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

  const saveData = () => {
    const data = detections.map(detection => ({
      class: detection.class,
      score: detection.score,
      bbox: detection.bbox
    }));
    // Save data to local storage or send to server
    console.log('Saved data:', data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Training Mode</h1>
      <p className="text-lg mb-4">Hold up a container and the app will detect it, add a bounding box, and track it as you move it around.</p>
      <div className="my-4">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: 'environment'
          }}
        />
        <canvas
          ref={canvasRef}
          width="1280"
          height="720"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
      <button onClick={saveData} className="mt-4 p-2 bg-blue-500 text-white rounded">Save Data</button>
    </div>
  );
};

export default TrainingMode;