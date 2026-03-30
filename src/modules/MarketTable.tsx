import { Button, SkeletonTable, Table } from '../ui';
import { SearchInput } from '../components';
import type { ICoinRow } from '../domain';
import { COIN_COLUMNS } from '../domain';
import { useMarketController } from '../hooks';
import { ApiError } from '../api';

const EMPTY_STATE = (
  <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">No results found</p>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Try adjusting your search query.
    </p>
  </div>
);

interface IMarketTableProps {
  onSelectCoin: (id: string) => void;
}

/**
 * The main market overview table organism that handles fetching, sorting, filtering,
 * and rendering the top 20 cryptocurrencies.
 * @param props.onSelectCoin - Callback invoked when the user selects a coin row.
 */
export function MarketTable({ onSelectCoin }: IMarketTableProps) {
  const {
    processedCoins,
    sortState,
    filterQuery,
    handleSort,
    setFilterQuery,
    handleRowClick,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useMarketController(onSelectCoin);

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
          value={filterQuery}
          onChange={setFilterQuery}
          placeholder="Search by name or symbol..."
        />
        {isFetching && !isLoading && (
          <span className="text-xs text-gray-400 dark:text-gray-500" aria-live="polite">
            Refreshing...
          </span>
        )}
      </div>

      <Table<ICoinRow>
        data={processedCoins}
        columns={COIN_COLUMNS}
        rowKey={(row) => row.id}
        sortState={sortState}
        onSort={handleSort}
        onRowClick={handleRowClick}
        ariaRowLabel={(row) => `View details for ${row.name}`}
        emptyState={EMPTY_STATE}
      />
    </div>
  );
}
