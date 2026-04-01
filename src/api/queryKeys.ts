/**
 * Centralized query key factory for all TanStack Query caches.
 * Keys follow a nested `['coins', scope, ...params]` structure for consistent
 * cache access and targeted invalidation (e.g. invalidate all coin queries at once).
 */
export const QUERY_KEYS = {
  /**
   * Key for the top-20 market coins list, scoped by currency.
   * @param currency - The vs_currency (e.g. 'usd').
   * @example queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketCoins('usd') })
   */
  marketCoins: (currency: string) => ['coins', 'market', currency] as const,

  /**
   * Key for a single coin's detail data.
   * @param id - The CoinGecko coin ID.
   */
  coinDetail: (id: string) => ['coins', 'detail', id] as const,

  /**
   * Key for a single coin's 7-day price chart data, scoped by currency.
   * @param id - The CoinGecko coin ID.
   * @param currency - The vs_currency (e.g. 'usd').
   */
  coinMarketChart: (id: string, currency: string) => ['coins', 'chart', id, currency] as const,
} as const;
