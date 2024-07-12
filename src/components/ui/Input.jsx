import React from 'react';

const Input = ({ type, onChange, className, ...props }) => {
  return (
    <input
      type={type}
      onChange={onChange}
      className={`p-2 border rounded ${className}`}
      {...props}
    />
  );
};

export default Input;