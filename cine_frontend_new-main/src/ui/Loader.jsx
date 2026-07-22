import { cn } from './Button';

export const Loader = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-primary border-t-transparent",
          sizes[size],
          className
        )}
      />
    </div>
  );
};
