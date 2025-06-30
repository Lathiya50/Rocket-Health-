import React, { forwardRef } from 'react';

/**
 * Input component
 */
export const Input = forwardRef(({ 
  label, 
  error, 
  helperText,
  className = '', 
  required = false,
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-colors duration-200
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * Textarea component
 */
export const Textarea = forwardRef(({ 
  label, 
  error, 
  helperText,
  className = '', 
  required = false,
  rows = 4,
  ...props 
}, ref) => {
  const textareaClasses = `
    w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-colors duration-200 resize-vertical
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

/**
 * Select component
 */
export const Select = forwardRef(({ 
  label, 
  error, 
  helperText,
  options = [],
  placeholder,
  className = '', 
  required = false,
  ...props 
}, ref) => {
  const selectClasses = `
    w-full px-3 py-2 border rounded-lg bg-white text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-colors duration-200
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
