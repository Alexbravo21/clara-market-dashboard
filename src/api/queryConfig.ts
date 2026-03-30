import { ApiError } from './coingecko';

const HTTP_TOO_MANY_REQUESTS = 429;

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
