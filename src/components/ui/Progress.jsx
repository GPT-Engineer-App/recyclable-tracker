import React from 'react';

const Progress = ({ value, max, className }) => {
  return (
    <progress value={value} max={max} className={`w-full ${className}`}>
      {value}%
    </progress>
  );
};

export default Progress;