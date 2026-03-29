import { useQuery } from '@tanstack/react-query';

import { fetchCoinDetail } from '../api';
import type { ICoinDetail } from '../types';

/**
 * Fetches and caches detailed information for a specific coin by ID.
 */
export function useCoinDetail(coinId: string | null) {
  return useQuery<ICoinDetail, Error>({
    queryKey: ['coinDetail', coinId],
    queryFn: () => fetchCoinDetail(coinId!),
    enabled: !!coinId,
    staleTime: 5 * 60_000,
    retry: (failureCount, error) => {
      if (error.name === 'ApiError' && (error as { statusCode?: number }).statusCode === 429) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
