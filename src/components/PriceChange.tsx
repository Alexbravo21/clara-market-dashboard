import { Badge } from '../ui';

interface IPriceChangeProps {
  value: number | null | undefined;
}

const NoPrice = () => (
  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
    No data
  </span>
);

/**
 * Displays a 24-hour price change percentage as a colored badge.
 * Renders a neutral fallback when the value is unavailable.
 */
export function PriceChange({ value }: IPriceChangeProps) {
  return value ? (
    <Badge value={value} aria-label={`24 hour price change: ${value.toFixed(2)}%`} />
  ) : (
    <NoPrice />
  );
}
