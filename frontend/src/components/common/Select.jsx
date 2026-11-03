import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable Select Dropdown Component
 */
export const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  required = false,
  placeholder = 'Select an option',
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-content-dark mb-1.5">
          {label} {required && <span className="text-state-error">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-subtle">
        <select
          ref={ref}
          id={selectId}
          className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-content-dark transition-colors focus:outline-none focus:ring-2 disabled:bg-surface-muted disabled:cursor-not-allowed ${
            error
              ? 'border-state-error focus:border-state-error focus:ring-state-error/20'
              : 'border-surface-border focus:border-brand-500 focus:ring-brand-500/20'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-content-muted">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-state-error font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-content-muted">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
