
// src/components/ui/Skeleton.tsx
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${variantClasses[variant]} ${className}`} />
  );
}
export * from './Skeleton';