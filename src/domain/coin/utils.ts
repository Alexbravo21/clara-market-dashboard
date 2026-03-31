import { formatCompactUSD, formatDate, formatUSD } from '../../utils';

/**
 * Formats a coin price as a USD currency string (e.g. $1,234.56).
 * @param price - The coin price in USD.
 * @returns Formatted USD string.
 */
export function formatCoinPrice(price: number): string {
  return formatUSD(price);
}

/**
 * Formats a market cap value as a compact USD string (e.g. $1.2T, $340B).
 * @param marketCap - The market cap value in USD.
 * @returns Compact USD string.
 */
export function formatMarketCap(marketCap: number): string {
  return formatCompactUSD(marketCap);
}

/**
 * Formats an ISO date string from the coin domain to a short human-readable date.
 * @param isoString - An ISO 8601 date string (e.g. all-time high date).
 * @returns Formatted date string (e.g. 'Jan 1, 2024').
 */
export function formatCoinDate(isoString: string): string {
  return formatDate(isoString);
}
