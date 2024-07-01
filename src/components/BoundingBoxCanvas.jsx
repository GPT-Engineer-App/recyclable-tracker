import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Line, Text } from 'react-konva';

const BoundingBoxCanvas = ({ items }) => {
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [currentBox, setCurrentBox] = useState([]);
  const [counts, setCounts] = useState({});
  const stageRef = useRef(null);

  const handleMouseDown = (e) => {
    const stage = stageRef.current.getStage();
    const point = stage.getPointerPosition();
    setCurrentBox([...currentBox, point]);
  };

  const handleMouseUp = () => {
    if (currentBox.length > 1) {
      const newBox = [...currentBox, currentBox[0]]; // Close the shape
      setBoundingBoxes([...boundingBoxes, newBox]);
      setCurrentBox([]);
    }
  };

  const handleMouseMove = (e) => {
    if (currentBox.length > 0) {
      const stage = stageRef.current.getStage();
      const point = stage.getPointerPosition();
      setCurrentBox([...currentBox.slice(0, -1), point]);
    }
  };

  const isPointInPolygon = (point, vs) => {
    const x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i].x, yi = vs[i].y;
      const xj = vs[j].x, yj = vs[j].y;
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const updateCounts = () => {
    const newCounts = {};
    boundingBoxes.forEach((box, index) => {
      newCounts[index] = items.filter(item => isPointInPolygon(item, box)).length;
    });
    setCounts(newCounts);
  };

  React.useEffect(() => {
    const interval = setInterval(updateCounts, 1000);
    return () => clearInterval(interval);
  }, [boundingBoxes, items]);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={stageRef}
    >
      <Layer>
        {boundingBoxes.map((box, i) => (
          <React.Fragment key={i}>
            <Line
              points={box.flatMap(p => [p.x, p.y])}
              closed
              stroke="red"
            />
            <Text
              x={box[0].x}
              y={box[0].y - 20}
              text={`Count: ${counts[i] || 0}`}
              fontSize={18}
              fill="black"
            />
          </React.Fragment>
        ))}
        {currentBox.length > 0 && (
          <Line
            points={currentBox.flatMap(p => [p.x, p.y])}
            stroke="blue"
          />
        )}
      </Layer>
    </Stage>
  );
};

export default BoundingBoxCanvas;