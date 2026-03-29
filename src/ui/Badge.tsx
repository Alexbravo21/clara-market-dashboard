interface IBadgeProps {
  value: number;
  className?: string;
}

/**
 * Displays a percentage value color-coded green for positive and red for negative.
 */
export function Badge({ value, className = '' }: IBadgeProps) {
  const isPositive = value >= 0;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
        isPositive
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      } ${className}`}
    >
      {isPositive ? '+' : ''}
      {value.toFixed(2)}%
    </span>
  );
}
