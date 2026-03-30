import { useQuery } from '@tanstack/react-query';

import { fetchMarketCoins } from '../api';
import type { ICoinRow } from '../domain';
import { mapCoinMarketToRow } from '../domain';
import type { ICoinMarket } from '../types';

const SIXTY_SECONDS_MS = 60_000;
const MARKET_COINS_QUERY_KEY = ['marketCoins'] as const;

/**
 * Fetches and caches the top 20 cryptocurrencies, auto-refreshing every 60 seconds.
 * Returns data mapped to the clean ICoinRow domain model.
 * @returns React Query result with ICoinRow[] as the data type.
 */
export function useMarketCoins() {
  return useQuery<ICoinMarket[], Error, ICoinRow[]>({
    queryKey: MARKET_COINS_QUERY_KEY,
    queryFn: fetchMarketCoins,
    select: (rawCoins) => rawCoins.map(mapCoinMarketToRow),
    refetchInterval: SIXTY_SECONDS_MS,
    staleTime: SIXTY_SECONDS_MS,
    retry: (failureCount, error) => {
      if (error.name === 'ApiError' && (error as { statusCode?: number }).statusCode === 429) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
