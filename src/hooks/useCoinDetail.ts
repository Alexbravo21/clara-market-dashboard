import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { apiRetry, apiRetryDelay, fetchCoinDetail, QUERY_KEYS } from '../api';
import type { ICoinDetail } from '../domain/coin';
import { mapCoinDetail } from '../domain/coin';
import type { Currency } from '../domain/currency';
import type { ICoinDetail as ICoinDetailRaw } from '../types';

// Coin detail changes infrequently; 5-minute stale + cache window is appropriate.
const FIVE_MINUTES_MS = 5 * 60_000;

/**
 * Fetches and caches detailed information for a specific coin by ID.
 * The detail endpoint returns market data for all currencies, so the query key does
 * not include currency — only the `select` transformer changes when currency changes.
 * @param coinId - The CoinGecko coin ID, or null to skip fetching.
 * @param currency - The currency to extract from the response's market_data.
 * @returns React Query result with ICoinDetail as the data type.
 */
export function useCoinDetail(coinId: string | null, currency: Currency) {
  const select = useCallback(
    (raw: ICoinDetailRaw) => mapCoinDetail(raw, currency),
    [currency],
  );

  return useQuery<ICoinDetailRaw, Error, ICoinDetail>({
    queryKey: QUERY_KEYS.coinDetail(coinId ?? ''),
    queryFn: () => fetchCoinDetail(coinId!),
    select,
    enabled: !!coinId,
    staleTime: FIVE_MINUTES_MS,
    gcTime: FIVE_MINUTES_MS,
    retry: apiRetry(2),
    retryDelay: apiRetryDelay,
  });
}
