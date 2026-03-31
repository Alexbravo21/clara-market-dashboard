import { useQuery } from '@tanstack/react-query';

import { apiRetry, fetchCoinDetail, QUERY_KEYS } from '../api';
import type { ICoinDetail } from '../domain/coin';
import { mapCoinDetail } from '../domain/coin';
import type { ICoinDetail as ICoinDetailRaw } from '../types';

/**
 * Fetches and caches detailed information for a specific coin by ID.
 * Returns data mapped to the clean ICoinDetailView domain model.
 * @param coinId - The CoinGecko coin ID, or null to skip fetching.
 * @returns React Query result with ICoinDetailView as the data type.
 */
export function useCoinDetail(coinId: string | null) {
  return useQuery<ICoinDetailRaw, Error, ICoinDetail>({
    queryKey: QUERY_KEYS.coinDetail(coinId ?? ''),
    queryFn: () => fetchCoinDetail(coinId!),
    select: mapCoinDetail,
    enabled: !!coinId,
    staleTime: 5 * 60_000,
    retry: apiRetry(2),
  });
}
