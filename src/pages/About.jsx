import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">About This App</h1>
      <p className="text-lg mb-4">The Container Detection App is designed to help in detecting, identifying, tracking, and counting various types of containers using advanced machine learning models like YOLOv5 for object detection and DeepSORT for tracking.</p>
      <p className="text-lg">This app is useful for recycling centers, waste management facilities, and other organizations that need to keep track of container counts.</p>
    </div>
  );
};

export default About;