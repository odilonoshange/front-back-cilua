import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from './Button';

export const Modal = ({ isOpen, onClose, title, children, className }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className={cn(
        "relative z-50 w-full max-w-lg rounded-xl border border-white/10 bg-surface p-6 shadow-xl",
        className
      )}>
        <div className="flex items-center justify-between mb-5">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-white/10 hover:text-text transition-colors ml-auto"
          >
            <X size={20} />
          </button>
        </div>
        
        <div>{children}</div>
      </div>
    </div>
  );
};
