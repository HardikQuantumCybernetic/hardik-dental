import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave';
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className,
  variant = 'text',
  animation = 'pulse',
  lines = 1
}) => {
  const baseClasses = cn(
    'bg-gradient-to-r from-dental-gray-light via-white to-dental-gray-light bg-[length:200%_100%]',
    {
      'animate-pulse': animation === 'pulse',
      'animate-[wave_1.6s_ease-in-out_infinite]': animation === 'wave'
    }
  );

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 ? 'w-3/4' : 'w-full',
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} />
  );
};

// Pre-built skeleton components
export const CardSkeleton: React.FC = () => (
  <div className="border border-dental-blue-light rounded-lg p-6 space-y-4 animate-pulse">
    <Skeleton variant="circular" className="w-12 h-12" />
    <div className="space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton lines={3} />
    </div>
    <Skeleton variant="rectangular" className="h-10 w-full" />
  </div>
);

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 border border-dental-blue-light rounded-lg">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

export const AppointmentSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);

export default Skeleton;