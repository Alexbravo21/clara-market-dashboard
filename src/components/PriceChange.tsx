import { Badge } from '../ui';

interface IPriceChangeProps {
  value: number;
}

/**
 * Displays a 24-hour price change percentage as a colored badge.
 */
export function PriceChange({ value }: IPriceChangeProps) {
  return <Badge value={value} aria-label={`24 hour price change: ${value.toFixed(2)}%`} />;
}
