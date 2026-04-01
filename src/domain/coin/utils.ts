import { formatDate, formatCurrency, formatCompactCurrency } from '../../utils';
import type { Currency } from '../currency';

/**
 * Formats a coin price as a currency string (e.g. $1,234.56, €1,234.56).
 * @param price - The coin price in the given currency.
 * @param currency - The ISO currency code; defaults to 'usd'.
 * @returns Formatted currency string.
 */
export function formatCoinPrice(price: number, currency: Currency = 'usd'): string {
  return formatCurrency(price, currency);
}

/**
 * Formats a market cap value as a compact currency string (e.g. $1.2T, €340B).
 * @param marketCap - The market cap value.
 * @param currency - The ISO currency code; defaults to 'usd'.
 * @returns Compact currency string.
 */
export function formatMarketCap(marketCap: number, currency: Currency = 'usd'): string {
  return formatCompactCurrency(marketCap, currency);
}

/**
 * Formats an ISO date string from the coin domain to a short human-readable date.
 * @param isoString - An ISO 8601 date string (e.g. all-time high date).
 * @returns Formatted date string (e.g. 'Jan 1, 2024').
 */
export function formatCoinDate(isoString: string): string {
  return formatDate(isoString);
}
