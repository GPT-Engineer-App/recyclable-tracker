import React from 'react';

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Container Detection App</h1>
      <p className="text-lg mb-4">This application helps in detecting, identifying, tracking, and counting various types of containers such as aluminium cans, HDPE2 plastic bottles, PET1 plastic bottles, glass bottles, and milk cartons.</p>
      <p className="text-lg">Use the navigation bar to explore different features of the app.</p>
      
      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">How to Use the Application</h2>
        <ol className="list-decimal list-inside text-lg">
          <li>Select the type of container you want to detect from the settings tab.</li>
          <li>Use the object detection tab to start the detection process.</li>
          <li>To select an area, you can:
            <ul className="list-disc list-inside ml-4">
              <li>Click and drag to create a square bounding box.</li>
              <li>Click and drag to create a circular bounding box.</li>
              <li>Use waypoints to create a custom-shaped bounding box.</li>
            </ul>
          </li>
          <li>Review the detected containers and their counts.</li>
          <li>Adjust settings as needed for better accuracy.</li>
        </ol>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Detailed Instructions</h2>
        {/* Detailed instructions will be added here */}
      </div>
    </div>
  );
};

export default Index;