import { cn } from './Button';

export const Card = ({ className, children, ...props }) => (
  <div className={cn('overflow-hidden border border-white/10 bg-surface text-text', className)} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-5', className)} {...props}>{children}</div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-xl font-bold leading-tight tracking-tight', className)} {...props}>{children}</h3>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-5 pt-0', className)} {...props}>{children}</div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('flex items-center p-5 pt-0', className)} {...props}>{children}</div>
);
