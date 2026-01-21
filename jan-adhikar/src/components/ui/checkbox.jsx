import React from 'react';

export function Checkbox({ children, className = '', ...props }) {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        className={`form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out ${className}`}
        {...props}
      />
      {children && <span className="text-sm">{children}</span>}
    </label>
  );
}