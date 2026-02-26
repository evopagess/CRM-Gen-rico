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
          'inline-flex items-center justify-center rounded-2xl font-semibold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-brand-600 text-white hover:bg-brand-700 shadow-premium shadow-brand-500/25': variant === 'primary',
            'bg-zinc-100 text-zinc-900 hover:bg-zinc-200': variant === 'secondary',
            'border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 shadow-sm': variant === 'outline',
            'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900': variant === 'ghost',
            'bg-rose-600 text-white hover:bg-rose-700 shadow-sm': variant === 'danger',
            'h-10 px-5 text-xs': size === 'sm',
            'h-12 px-6 py-2 text-sm': size === 'md',
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
