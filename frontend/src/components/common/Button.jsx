import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component with multiple variants, sizes and loading state.
 * Roman Hinglish: Standard button component with loading spinner support.
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500 shadow-sm active:bg-brand-700',
    secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100 focus:ring-brand-500 active:bg-brand-200',
    outline: 'border border-surface-border bg-white text-content-dark hover:bg-surface-muted focus:ring-brand-500 shadow-subtle active:bg-gray-100',
    ghost: 'text-content-secondary hover:text-content-dark hover:bg-surface-subtle focus:ring-gray-400',
    danger: 'bg-state-error text-white hover:bg-red-700 focus:ring-red-500 shadow-sm active:bg-red-800',
    dangerOutline: 'border border-red-200 bg-white text-state-error hover:bg-red-50 focus:ring-red-500',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : LeftIcon ? (
        <LeftIcon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
      {!isLoading && RightIcon ? <RightIcon className="w-4 h-4 shrink-0" /> : null}
    </button>
  );
};

export default Button;
