import React, { forwardRef } from 'react';

/**
 * Reusable Form Input with label, icons, helper text, and error handling.
 */
export const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  rightElement,
  className = '',
  id,
  type = 'text',
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-content-dark mb-1.5">
          {label} {required && <span className="text-state-error">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-subtle">
        {LeftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-content-muted">
            <LeftIcon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-content-dark placeholder-content-placeholder transition-colors focus:outline-none focus:ring-2 disabled:bg-surface-muted disabled:cursor-not-allowed ${
            LeftIcon ? 'pl-9' : ''
          } ${RightIcon || rightElement ? 'pr-10' : ''} ${
            error
              ? 'border-state-error focus:border-state-error focus:ring-state-error/20'
              : 'border-surface-border focus:border-brand-500 focus:ring-brand-500/20'
          } ${className}`}
          {...props}
        />
        {rightElement ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        ) : RightIcon ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-content-muted">
            <RightIcon className="h-4 w-4" />
          </div>
        ) : null}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-state-error font-medium">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-content-muted">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
