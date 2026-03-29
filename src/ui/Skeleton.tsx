interface ISkeletonProps {
  className?: string;
}

/**
 * An animated placeholder that represents loading content.
 */
export function Skeleton({ className = '' }: ISkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
      aria-hidden="true"
    />
  );
}

interface ISkeletonTableProps {
  rows?: number;
  columns?: number;
}

/**
 * Renders a skeleton placeholder for a table with the given row and column count.
 */
export function SkeletonTable({ rows = 10, columns = 6 }: ISkeletonTableProps) {
  return (
    <div role="status" aria-label="Loading market data">
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton key={columnIndex} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
