/**
 * Centralized query key factory for all TanStack Query caches.
 * Keeping keys in one place ensures consistent cache access and invalidation across the app.
 */
export const QUERY_KEYS = {
  /**
   * Key for the top-20 market coins list.
   * @example queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketCoins() })
   */
  marketCoins: () => ['marketCoins'] as const,

  /**
   * Key for a single coin's detail data.
   * @param id - The CoinGecko coin ID.
   */
  coinDetail: (id: string) => ['coinDetail', id] as const,

  /**
   * Key for a single coin's 7-day price chart data.
   * @param id - The CoinGecko coin ID.
   */
  coinMarketChart: (id: string) => ['coinMarketChart', id] as const,
} as const;
