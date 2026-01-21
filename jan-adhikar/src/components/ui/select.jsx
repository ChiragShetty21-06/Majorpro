import React from 'react';

export function Select({ children, className = '', onValueChange, ...props }) {
  // Support both `onChange` (native) and `onValueChange` (app convention).
  const handleChange = (e) => {
    if (typeof onValueChange === 'function') onValueChange(e.target.value);
    if (typeof props.onChange === 'function') props.onChange(e);
  };

  return (
    <select
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
      onChange={handleChange}
      value={props.value}
    >
      {children}
    </select>
  );
}

export function SelectContent({ children, ...props }) {
  return <>{children}</>;
}

export function SelectItem({ children, value, ...props }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}

export function SelectTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SelectValue({ children, ...props }) {
  return <span {...props}>{children}</span>;
}