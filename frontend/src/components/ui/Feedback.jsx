import React from 'react';

export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`${sizes[size]} spinner ${className}`}></div>
  );
};

export const LoadingOverlay = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 max-w-sm mx-4">
        <LoadingSpinner size="large" />
        <p className="text-gray-700 font-medium text-center">{message}</p>
      </div>
    </div>
  );
};
