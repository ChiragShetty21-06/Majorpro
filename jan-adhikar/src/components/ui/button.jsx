import React from 'react';

export function Button({ children, asChild = false, className = '', ...props }) {
  const baseClass =
    'inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

  const combinedClass = `${baseClass} ${className}`.trim();

  // If `asChild` is used, clone the child element (usually a Link)
  // and apply the button classes to it so the anchor gets the same styles.
  if (asChild && React.isValidElement(children)) {
    const childClass = children.props.className ? `${children.props.className} ` : '';
    return React.cloneElement(children, { className: `${childClass}${combinedClass}`, ...props });
  }

  return (
    <button className={combinedClass} {...props}>
      {children}
    </button>
  );
}

// Default export for compatibility with imports expecting default
export default Button;