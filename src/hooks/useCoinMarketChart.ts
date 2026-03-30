import { useQuery } from '@tanstack/react-query';

import { apiRetry, fetchCoinMarketChart, QUERY_KEYS } from '../api';
import type { IMarketChartData } from '../types';

/**
 * Fetches and caches the 7-day price history chart data for a specific coin.
 * @param coinId - The CoinGecko coin ID, or null to skip fetching.
 * @returns React Query result with IMarketChartData containing price point arrays.
 */
export function useCoinMarketChart(coinId: string | null) {
  return useQuery<IMarketChartData, Error>({
    queryKey: QUERY_KEYS.coinMarketChart(coinId ?? ''),
    queryFn: () => fetchCoinMarketChart(coinId!),
    enabled: !!coinId,
    staleTime: 5 * 60_000,
    retry: apiRetry(2),
  });
}
