import React from 'react';

/**
 * Universal FormField wrapper for textareas, custom toggles, etc.
 */
export const FormField = ({
  label,
  error,
  helperText,
  required = false,
  children,
  className = '',
  id,
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-content-dark mb-1.5">
          {label} {required && <span className="text-state-error">*</span>}
        </label>
      )}
      {children}
      {error && <p className="mt-1.5 text-xs text-state-error font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-content-muted">{helperText}</p>}
    </div>
  );
};

export default FormField;
