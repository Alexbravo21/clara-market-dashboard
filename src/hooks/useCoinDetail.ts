import { useQuery } from '@tanstack/react-query';

import { fetchCoinDetail } from '../api';
import type { ICoinDetailView } from '../domain';
import { mapCoinDetailToView } from '../domain';
import type { ICoinDetail } from '../types';

/**
 * Fetches and caches detailed information for a specific coin by ID.
 * Returns data mapped to the clean ICoinDetailView domain model.
 */
export function useCoinDetail(coinId: string | null) {
  return useQuery<ICoinDetail, Error, ICoinDetailView>({
    queryKey: ['coinDetail', coinId],
    queryFn: () => fetchCoinDetail(coinId!),
    select: mapCoinDetailToView,
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
