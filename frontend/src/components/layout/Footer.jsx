import React from 'react';

/**
 * Footer Component
 */
export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-gray-600">
          <p>&copy; 2024 Rocket Health. Professional consultation summary generator for healthcare providers.</p>
          <p className="mt-2">
            Built with security and privacy in mind. All data is processed securely and not stored permanently.
          </p>
        </div>
      </div>
    </footer>
  );
};
