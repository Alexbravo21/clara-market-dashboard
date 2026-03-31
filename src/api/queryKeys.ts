/**
 * Centralized query key factory for all TanStack Query caches.
 * Keys follow a nested `['coins', scope, ...params]` structure for consistent
 * cache access and targeted invalidation (e.g. invalidate all coin queries at once).
 */
export const QUERY_KEYS = {
  /**
   * Key for the top-20 market coins list.
   * @example queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketCoins() })
   */
  marketCoins: () => ['coins', 'market'] as const,

  /**
   * Key for a single coin's detail data.
   * @param id - The CoinGecko coin ID.
   */
  coinDetail: (id: string) => ['coins', 'detail', id] as const,

  /**
   * Key for a single coin's 7-day price chart data.
   * @param id - The CoinGecko coin ID.
   */
  coinMarketChart: (id: string) => ['coins', 'chart', id] as const,
} as const;
