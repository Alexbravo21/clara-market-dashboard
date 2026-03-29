import { useMemo, useState } from 'react';

import { Button, SkeletonTable, SparklineChart } from '../ui';
import { useSelectedCoin } from '../context';
import { useMarketCoins } from '../hooks';
import { CryptoName, PriceChange, SearchInput, SortableHeader } from '../components';
import type { ICoinMarket, ISortConfig, SortField } from '../types';
import { formatCompactUSD, formatUSD } from '../utils';
import { ApiError } from '../api';

const DEFAULT_SORT: ISortConfig = { field: 'market_cap_rank', direction: 'asc' };

function sortCoins(coins: ICoinMarket[], sortConfig: ISortConfig): ICoinMarket[] {
  return [...coins].sort((a, b) => {
    const fieldA = a[sortConfig.field];
    const fieldB = b[sortConfig.field];

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      const comparison = fieldA.localeCompare(fieldB);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    }

    const numA = fieldA as number;
    const numB = fieldB as number;
    return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
  });
}

function filterCoins(coins: ICoinMarket[], query: string): ICoinMarket[] {
  if (!query.trim()) return coins;
  const lowerQuery = query.toLowerCase();
  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(lowerQuery) ||
      coin.symbol.toLowerCase().includes(lowerQuery),
  );
}

/**
 * The main market overview table organism that handles fetching, sorting, filtering,
 * and rendering the top 20 cryptocurrencies.
 */
export function MarketTable() {
  const { data: coins, isLoading, error, refetch, isFetching } = useMarketCoins();
  const { selectCoin } = useSelectedCoin();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<ISortConfig>(DEFAULT_SORT);

  const handleSort = (field: SortField) => {
    setSortConfig((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' },
    );
  };

  const handleRowClick = (coinId: string) => {
    selectCoin(coinId);
  };

  const handleRowKeyDown = (event: React.KeyboardEvent, coinId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectCoin(coinId);
    }
  };

  const processedCoins = useMemo(() => {
    if (!coins) return [];
    const filtered = filterCoins(coins, searchQuery);
    return sortCoins(filtered, sortConfig);
  }, [coins, searchQuery, sortConfig]);

  const isRateLimit =
    error instanceof ApiError ? error.isRateLimit : (error?.message?.includes('429') ?? false);

  if (isLoading) return <SkeletonTable rows={10} columns={6} />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {isRateLimit ? 'Rate limit reached' : 'Failed to load data'}
        </p>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {isRateLimit
            ? 'CoinGecko API rate limit exceeded. Please wait a moment before retrying.'
            : 'An error occurred while fetching market data. Please try again.'}
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name or symbol..."
        />
        {isFetching && !isLoading && (
          <span className="text-xs text-gray-400 dark:text-gray-500" aria-live="polite">
            Refreshing...
          </span>
        )}
      </div>

      {processedCoins.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">No results found</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search query.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <SortableHeader
                    label="#"
                    field="market_cap_rank"
                    currentField={sortConfig.field}
                    direction={sortConfig.direction}
                    onSort={handleSort}
                    className="w-12"
                  />
                  <SortableHeader
                    label="Name"
                    field="name"
                    currentField={sortConfig.field}
                    direction={sortConfig.direction}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Price"
                    field="current_price"
                    currentField={sortConfig.field}
                    direction={sortConfig.direction}
                    onSort={handleSort}
                    className="text-right"
                  />
                  <SortableHeader
                    label="24h %"
                    field="price_change_percentage_24h"
                    currentField={sortConfig.field}
                    direction={sortConfig.direction}
                    onSort={handleSort}
                    className="text-right"
                  />
                  <SortableHeader
                    label="Market Cap"
                    field="market_cap"
                    currentField={sortConfig.field}
                    direction={sortConfig.direction}
                    onSort={handleSort}
                    className="text-right"
                  />
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    7d
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {processedCoins.map((coin) => (
                  <tr
                    key={coin.id}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer transition-colors hover:bg-blue-50 focus-visible:bg-blue-50 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
                    onClick={() => handleRowClick(coin.id)}
                    onKeyDown={(e) => handleRowKeyDown(e, coin.id)}
                    aria-label={`View details for ${coin.name}`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 tabular-nums">
                      {coin.market_cap_rank}
                    </td>
                    <td className="px-4 py-3">
                      <CryptoName name={coin.name} symbol={coin.symbol} imageUrl={coin.image} />
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 tabular-nums">
                      {formatUSD(coin.current_price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <PriceChange value={coin.price_change_percentage_24h} />
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700 dark:text-gray-300 tabular-nums">
                      {formatCompactUSD(coin.market_cap)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <SparklineChart
                          prices={coin.sparkline_in_7d.price}
                          positive={coin.price_change_percentage_24h >= 0}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
