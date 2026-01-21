import React from 'react';

export function Input(props) {
  return (
    <input
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      {...props}
    />
  );
}

// Default export for compatibility
export default Input;