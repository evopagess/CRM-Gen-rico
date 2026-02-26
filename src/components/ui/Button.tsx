import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-brand-600 text-white hover:bg-brand-700 shadow-premium shadow-brand-200/50': variant === 'primary',
            'bg-slate-100 text-slate-900 hover:bg-slate-200': variant === 'secondary',
            'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm': variant === 'outline',
            'hover:bg-slate-100 text-slate-700 hover:text-slate-900': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 shadow-sm': variant === 'danger',
            'h-9 px-4 text-xs': size === 'sm',
            'h-11 px-5 py-2 text-sm': size === 'md',
            'h-14 px-8 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
