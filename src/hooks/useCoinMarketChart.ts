import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { apiRetry, apiRetryDelay, fetchCoinMarketChart, QUERY_KEYS } from '../api';
import type { IPriceChartPoint } from '../domain/coin';
import { mapPriceChartPoints } from '../domain/coin';
import type { Currency } from '../domain/currency';
import type { IMarketChartData } from '../types';

// Price history is relatively stable within a session; 5-minute stale + cache window.
const FIVE_MINUTES_MS = 5 * 60_000;

/**
 * Fetches and caches the 7-day price history chart data for a specific coin, scoped by currency.
 * Returns data transformed to {@link IPriceChartPoint}[] via the `select` option.
 * @param coinId - The CoinGecko coin ID, or null to skip fetching.
 * @param currency - The currency to price history in.
 * @returns React Query result with IPriceChartPoint[] ready for chart rendering.
 */
export function useCoinMarketChart(coinId: string | null, currency: Currency) {
  const select = useCallback(
    (raw: IMarketChartData) => mapPriceChartPoints(raw),
    // mapPriceChartPoints is currency-agnostic; currency only affects the API call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return useQuery<IMarketChartData, Error, IPriceChartPoint[]>({
    queryKey: QUERY_KEYS.coinMarketChart(coinId ?? '', currency),
    queryFn: () => fetchCoinMarketChart(coinId!, currency),
    select,
    enabled: !!coinId,
    staleTime: FIVE_MINUTES_MS,
    gcTime: FIVE_MINUTES_MS,
    retry: apiRetry(2),
    retryDelay: apiRetryDelay,
  });
}
