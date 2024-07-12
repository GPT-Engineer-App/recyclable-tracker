import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Progress from '@/components/common/Progress';

const TrainingMode = () => {
  const [detections, setDetections] = useState([]);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraSettings, setCameraSettings] = useState({
    width: 1280,
    height: 720,
    frameRate: 30
  });
  const [trainingData, setTrainingData] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [datasetSummary, setDatasetSummary] = useState({
    annotations: 0,
    metadata: 0,
    images: 0
  });

  useEffect(() => {
    const assessDeviceHardware = () => {
      const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
      const hardwareConcurrency = navigator.hardwareConcurrency || 4; // Default to 4 cores if not available

      if (memory >= 8 && hardwareConcurrency >= 8) {
        setCameraSettings({ width: 1920, height: 1080, frameRate: 60 });
      } else if (memory >= 4 && hardwareConcurrency >= 4) {
        setCameraSettings({ width: 1280, height: 720, frameRate: 30 });
      } else {
        setCameraSettings({ width: 640, height: 480, frameRate: 15 });
      }
    };

    assessDeviceHardware();
  }, []);

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
      persistDetections(predictions);
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

  const persistDetections = (predictions) => {
    const storedDetections = JSON.parse(localStorage.getItem('detections')) || {};
    predictions.forEach(prediction => {
      if (storedDetections[prediction.class]) {
        storedDetections[prediction.class] += 1;
      } else {
        storedDetections[prediction.class] = 1;
      }
    });
    localStorage.setItem('detections', JSON.stringify(storedDetections));
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

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
    setTrainingData(fileArray);
  };

  const processVideoFiles = async () => {
    // Process video files and extract frames for training
    // This is a placeholder function and should be implemented
    console.log('Processing video files:', trainingData);
  };

  const trainModel = async () => {
    setIsTraining(true);
    setTrainingProgress(0);

    await processVideoFiles();

    // Placeholder for training logic
    for (let i = 0; i <= 100; i++) {
      setTrainingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate training time
    }

    setIsTraining(false);
    console.log('Training complete');
  };

  const handleDatasetUpload = async (event) => {
    const files = event.target.files;
    const annotations = [];
    const metadata = [];
    const images = [];

    for (const file of files) {
      if (file.webkitRelativePath.includes('annotations') && file.name.endsWith('.json')) {
        annotations.push(file);
      } else if (file.webkitRelativePath.includes('metadata') && file.name.endsWith('.json')) {
        metadata.push(file);
      } else if (file.webkitRelativePath.includes('images') && file.name.endsWith('.jpg')) {
        images.push(file);
      }
    }

    setDatasetSummary({
      annotations: annotations.length,
      metadata: metadata.length,
      images: images.length
    });

    console.log('Annotations:', annotations);
    console.log('Metadata:', metadata);
    console.log('Images:', images);
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
          width={cameraSettings.width}
          height={cameraSettings.height}
          videoConstraints={{
            width: cameraSettings.width,
            height: cameraSettings.height,
            facingMode: 'environment',
            frameRate: cameraSettings.frameRate
          }}
        />
        <canvas
          ref={canvasRef}
          width={cameraSettings.width}
          height={cameraSettings.height}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
      <Button onClick={saveData} className="mt-4 p-2 bg-blue-500 text-white rounded">Save Data</Button>
      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Upload Training Data</h2>
        <Input type="file" multiple onChange={handleFileUpload} className="mb-4" />
        <Button onClick={trainModel} className="p-2 bg-green-500 text-white rounded" disabled={isTraining}>Start Training</Button>
        {isTraining && <Progress className="mt-4" value={trainingProgress} />}
      </div>
      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Upload Dataset</h2>
        <Input type="file" webkitdirectory="true" directory="true" multiple onChange={handleDatasetUpload} className="mb-4" />
        <div className="mt-4">
          <h3 className="text-2xl font-bold mb-2">Dataset Summary</h3>
          <p>Annotations: {datasetSummary.annotations}</p>
          <p>Metadata: {datasetSummary.metadata}</p>
          <p>Images: {datasetSummary.images}</p>
        </div>
      </div>
    </div>
  );
};

export default TrainingMode;