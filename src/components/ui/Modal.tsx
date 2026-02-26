import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-zinc-950/70 p-0 sm:p-4 backdrop-blur-md transition-all">
      <div
        className={cn("bg-white rounded-t-[2rem] sm:rounded-2xl shadow-premium w-full sm:max-w-md max-h-[95vh] sm:max-h-[85vh] flex flex-col overflow-hidden border border-white/20 shadow-brand-500/10", className)}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-white/70 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-2xl font-black text-zinc-900 tracking-tighter italic uppercase">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center text-brand-600 font-black uppercase tracking-tighter italic group-hover:translate-x-2 transition-transform duration-300 hover:text-brand-700"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
