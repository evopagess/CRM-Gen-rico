import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, rightElement, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-0.5 uppercase tracking-tighter italic">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'flex h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm transition-all placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 shadow-sm font-medium',
              error && 'border-red-500 focus:ring-red-500',
              rightElement && 'pr-12',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {helperText && !error && <p className="mt-2 text-xs text-zinc-400 ml-1 font-bold italic opacity-60 uppercase tracking-tighter">{helperText}</p>}
        {error && <p className="mt-2 text-xs text-rose-500 ml-1 font-black uppercase tracking-widest">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
