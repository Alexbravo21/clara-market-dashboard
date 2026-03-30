import { useQuery } from '@tanstack/react-query';

import { fetchCoinMarketChart } from '../api';
import type { IMarketChartData } from '../types';

/**
 * Fetches and caches the 7-day price history chart data for a specific coin.
 * @param coinId - The CoinGecko coin ID, or null to skip fetching.
 * @returns React Query result with IMarketChartData containing price point arrays.
 */
export function useCoinMarketChart(coinId: string | null) {
  return useQuery<IMarketChartData, Error>({
    queryKey: ['coinMarketChart', coinId],
    queryFn: () => fetchCoinMarketChart(coinId!),
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
