import { useQuery } from '@tanstack/react-query';

import { apiRetry, fetchCoinDetail, QUERY_KEYS } from '../api';
import type { ICoinDetailView } from '../domain';
import { mapCoinDetailToView } from '../domain';
import type { ICoinDetail } from '../types';

/**
 * Fetches and caches detailed information for a specific coin by ID.
 * Returns data mapped to the clean ICoinDetailView domain model.
 * @param coinId - The CoinGecko coin ID, or null to skip fetching.
 * @returns React Query result with ICoinDetailView as the data type.
 */
export function useCoinDetail(coinId: string | null) {
  return useQuery<ICoinDetail, Error, ICoinDetailView>({
    queryKey: QUERY_KEYS.coinDetail(coinId ?? ''),
    queryFn: () => fetchCoinDetail(coinId!),
    select: mapCoinDetailToView,
    enabled: !!coinId,
    staleTime: 5 * 60_000,
    retry: apiRetry(2),
  });
}
