import { useQuery } from '@tanstack/react-query';

import { apiRetry, apiRetryDelay, fetchMarketCoins, QUERY_KEYS } from '../api';
import type { ICoin } from '../domain/coin';
import { mapCoin } from '../domain/coin';
import type { Currency } from '../domain/currency';
import type { ICoinMarket } from '../types';

// Market data is moderately volatile: stale after 60 s, kept in cache for 5 min.
const SIXTY_SECONDS_MS = 60_000;
const FIVE_MINUTES_MS = 5 * 60_000;

/**
 * Fetches and caches the top 20 cryptocurrencies for a given currency, auto-refreshing every 60 seconds.
 * Each currency has its own cache entry — switching back to a previously loaded currency will use
 * cached data without triggering a new network request.
 * @param currency - The currency to price coins in.
 * @returns React Query result with ICoin[] as the data type.
 */
export function useMarketCoins(currency: Currency) {
  return useQuery<ICoinMarket[], Error, ICoin[]>({
    queryKey: QUERY_KEYS.marketCoins(currency),
    queryFn: () => fetchMarketCoins(currency),
    select: (rawCoins) => rawCoins.map(mapCoin),
    refetchInterval: SIXTY_SECONDS_MS,
    staleTime: SIXTY_SECONDS_MS,
    gcTime: FIVE_MINUTES_MS,
    retry: apiRetry(3),
    retryDelay: apiRetryDelay,
  });
}
