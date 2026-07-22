import { cn } from './Button';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-muted">
          <Icon size={32} />
        </div>
      )}
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
