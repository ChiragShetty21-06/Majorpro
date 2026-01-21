import React from 'react';

export function RadioGroup({ children, className = '', ...props }) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function RadioGroupItem({ children, value, ...props }) {
  return (
    <label className="flex items-center space-x-2">
      <input type="radio" value={value} className="form-radio" {...props} />
      <span>{children}</span>
    </label>
  );
}