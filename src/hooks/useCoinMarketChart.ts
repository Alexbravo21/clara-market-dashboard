import { useQuery } from '@tanstack/react-query';

import { apiRetry, apiRetryDelay, fetchCoinMarketChart, QUERY_KEYS } from '../api';
import type { IPriceChartPoint } from '../domain/coin';
import { mapPriceChartPoints } from '../domain/coin';
import type { IMarketChartData } from '../types';

// Price history is relatively stable within a session; 5-minute stale + cache window.
const FIVE_MINUTES_MS = 5 * 60_000;

/**
 * Fetches and caches the 7-day price history chart data for a specific coin.
 * Returns data transformed to {@link IPriceChartPoint}[] via the `select` option.
 * @param coinId - The CoinGecko coin ID, or null to skip fetching.
 * @returns React Query result with IPriceChartPoint[] ready for chart rendering.
 */
export function useCoinMarketChart(coinId: string | null) {
  return useQuery<IMarketChartData, Error, IPriceChartPoint[]>({
    queryKey: QUERY_KEYS.coinMarketChart(coinId ?? ''),
    queryFn: () => fetchCoinMarketChart(coinId!),
    select: mapPriceChartPoints,
    enabled: !!coinId,
    staleTime: FIVE_MINUTES_MS,
    gcTime: FIVE_MINUTES_MS,
    retry: apiRetry(2),
    retryDelay: apiRetryDelay,
  });
}
