import React, { useState } from 'react';
import BoundingBoxCanvas from '../components/BoundingBoxCanvas';

const Index = () => {
  const [items, setItems] = useState([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setItems(prevItems => [
        ...prevItems,
        { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Container Detection App</h1>
      <p className="text-lg mb-4">This application helps in detecting, identifying, tracking, and counting various types of containers such as aluminium cans, HDPE2 plastic bottles, PET1 plastic bottles, glass bottles, and milk cartons.</p>
      <p className="text-lg">Use the navigation bar to explore different features of the app.</p>
    <BoundingBoxCanvas items={items} />
    </div>
  );
};

export default Index;