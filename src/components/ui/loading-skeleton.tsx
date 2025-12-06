import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'table' | 'appointment';
  count?: number;
  className?: string;
}

export const LoadingSkeleton = ({ type = 'card', count = 3, className }: LoadingSkeletonProps) => {
  const items = Array.from({ length: count }, (_, i) => i);

  switch (type) {
    case 'appointment':
      return (
        <div className={`space-y-4 ${className}`}>
          {items.map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
                <div className="flex space-x-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'card':
      return (
        <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
          {items.map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className={`space-y-3 ${className}`}>
          {items.map((i) => (
            <div key={i} className="flex items-center space-x-4 p-3 border rounded">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );

    case 'table':
      return (
        <div className={`space-y-3 ${className}`}>
          {items.map((i) => (
            <div key={i} className="grid grid-cols-4 gap-4 p-3 border rounded">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className={`space-y-3 ${className}`}>
          {items.map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      );
  }
};