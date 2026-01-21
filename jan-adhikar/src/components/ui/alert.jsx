import React from 'react';

export function Alert({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <div
      className={`p-4 rounded-md border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ children, className = '', ...props }) {
  return (
    <div className={`mt-2 text-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

// Default export for compatibility
export default Alert;