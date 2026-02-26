import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-0.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 shadow-sm',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {helperText && !error && <p className="mt-1.5 text-xs text-slate-500 ml-0.5">{helperText}</p>}
        {error && <p className="mt-1.5 text-xs text-red-500 ml-0.5 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
