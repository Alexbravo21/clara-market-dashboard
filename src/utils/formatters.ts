const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const COMPACT_USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

const PERCENT_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'always',
});

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

/**
 * Formats a number as a USD currency string (e.g. $1,234.56).
 * @param value - The numeric value to format.
 * @returns Formatted USD string.
 */
export function formatUSD(value: number): string {
  return USD_FORMATTER.format(value);
}

/**
 * Formats a large number as a compact USD string (e.g. $1.2T, $340B).
 * @param value - The numeric value to format.
 * @returns Compact USD string.
 */
export function formatCompactUSD(value: number): string {
  return COMPACT_USD_FORMATTER.format(value);
}

/**
 * Formats a decimal as a percentage with sign (e.g. +1.23%, -0.45%).
 * @param value - The value in percent units (e.g. 1.23 for 1.23%).
 * @returns Signed percentage string.
 */
export function formatPercent(value: number): string {
  return PERCENT_FORMATTER.format(value / 100);
}

/**
 * Formats an ISO date string to a short human-readable date.
 * @param isoString - An ISO 8601 date string.
 * @returns Formatted date string (e.g. 'Jan 1, 2024').
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return DATE_FORMATTER.format(date);
}

/**
 * Truncates a string to the given length, appending ellipsis if truncated.
 * @param text - The source string.
 * @param maxLength - Maximum number of characters before truncation.
 * @returns The original string if within limit, otherwise a truncated string with '...'.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
