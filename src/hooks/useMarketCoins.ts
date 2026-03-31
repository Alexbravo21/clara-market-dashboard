import { useQuery } from '@tanstack/react-query';

import { apiRetry, fetchMarketCoins, QUERY_KEYS } from '../api';
import type { ICoin } from '../domain/coin';
import { mapCoin } from '../domain/coin';
import type { ICoinMarket } from '../types';

const SIXTY_SECONDS_MS = 60_000;

/**
 * Fetches and caches the top 20 cryptocurrencies, auto-refreshing every 60 seconds.
 * Returns data mapped to the clean ICoinRow domain model.
 * @returns React Query result with ICoinRow[] as the data type.
 */
export function useMarketCoins() {
  return useQuery<ICoinMarket[], Error, ICoin[]>({
    queryKey: QUERY_KEYS.marketCoins(),
    queryFn: fetchMarketCoins,
    select: (rawCoins) => rawCoins.map(mapCoin),
    refetchInterval: SIXTY_SECONDS_MS,
    staleTime: SIXTY_SECONDS_MS,
    retry: apiRetry(3),
  });
}
