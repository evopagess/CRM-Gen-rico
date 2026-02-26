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
        'inline-flex items-center rounded-full px-3 py-1 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ring-1 ring-inset',
        {
          'bg-zinc-100 text-zinc-800 ring-zinc-200': variant === 'default',
          'bg-emerald-50 text-emerald-700 ring-emerald-200': variant === 'success',
          'bg-amber-50 text-amber-700 ring-amber-200': variant === 'warning',
          'bg-rose-50 text-rose-700 ring-rose-200': variant === 'danger',
          'bg-brand-50 text-brand-700 ring-brand-200': variant === 'info',
        },
        className
      )}
      {...props}
    />
  );
}
