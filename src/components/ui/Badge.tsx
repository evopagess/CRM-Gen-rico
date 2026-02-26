import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  onClick?: () => void;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500',
        {
          'bg-slate-100 text-slate-800': variant === 'default',
          'bg-emerald-100 text-emerald-800': variant === 'success',
          'bg-amber-100 text-amber-800': variant === 'warning',
          'bg-rose-100 text-rose-800': variant === 'danger',
          'bg-brand-100 text-brand-800': variant === 'info',
        },
        className
      )}
      {...props}
    />
  );
}
