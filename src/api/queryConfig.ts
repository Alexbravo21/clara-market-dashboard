import { ApiError } from './coingecko';

const HTTP_TOO_MANY_REQUESTS = 429;
const MAX_RETRY_DELAY_MS = 30_000;

/**
 * Standard retry policy for CoinGecko queries.
 * Never retries on rate-limit (429) errors; retries up to `maxAttempts` times otherwise.
 * @param maxAttempts - Maximum number of retry attempts for non-rate-limit errors.
 * @returns A retry function compatible with TanStack Query's `retry` option.
 */
export function apiRetry(maxAttempts: number) {
  return (failureCount: number, error: Error): boolean => {
    if (error instanceof ApiError && error.statusCode === HTTP_TOO_MANY_REQUESTS) {
      return false;
    }
    return failureCount < maxAttempts;
  };
}

/**
 * Exponential backoff delay for CoinGecko query retries.
 * Doubles the wait time on each attempt, capped at 30 seconds.
 * @param attempt - The current retry attempt index (0-based).
 * @returns Delay in milliseconds before the next retry.
 */
export function apiRetryDelay(attempt: number): number {
  return Math.min(1_000 * 2 ** attempt, MAX_RETRY_DELAY_MS);
}
