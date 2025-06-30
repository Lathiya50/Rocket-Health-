import React from 'react';

/**
 * Reusable Card component
 */
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Header component
 */
export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card Content component
 */
export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card Footer component
 */
export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
