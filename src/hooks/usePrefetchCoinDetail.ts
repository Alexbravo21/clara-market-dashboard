import { useQueryClient } from '@tanstack/react-query';

import { apiRetry, apiRetryDelay, fetchCoinDetail, QUERY_KEYS } from '../api';
import type { ICoinDetail as ICoinDetailRaw } from '../types';

const FIVE_MINUTES_MS = 5 * 60_000;

/**
 * Returns a prefetch callback that speculatively loads coin detail into the cache.
 * Call it on row hover so that by the time the user clicks the data is already ready.
 * Uses the same query key and staleTime as {@link useCoinDetail} for cache sharing.
 * @returns A function that accepts a coin ID and triggers a background prefetch.
 */
export function usePrefetchCoinDetail(): (coinId: string) => void {
  const queryClient = useQueryClient();

  return (coinId: string) => {
    queryClient.prefetchQuery<ICoinDetailRaw>({
      queryKey: QUERY_KEYS.coinDetail(coinId),
      queryFn: () => fetchCoinDetail(coinId),
      staleTime: FIVE_MINUTES_MS,
      retry: apiRetry(2),
      retryDelay: apiRetryDelay,
    });
  };
}
