import React from 'react';

const Button = ({ onClick, children, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 bg-blue-500 text-white rounded ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;