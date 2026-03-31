import { Button, SkeletonTable, Table } from '../ui';
import { SearchInput } from '../components';
import type { ICoin } from '../domain/coin';
import { COIN_COLUMNS } from '../domain';
import type { ITableControllerState, IPageState } from '../hooks';

function EmptyState({ onResetFilter }: { onResetFilter?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">No results found</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Try adjusting your search query.
      </p>
      {onResetFilter && (
        <Button variant="link" className="mt-4" onClick={onResetFilter}>
          Reset search
        </Button>
      )}
    </div>
  );
}

interface IMarketTableProps {
  table: ITableControllerState;
  state: IPageState;
}

/**
 * The main market overview table organism. Purely presentational — receives all
 * data and handlers from the controller via props.
 */
export function MarketTable({ table, state }: IMarketTableProps) {
  if (state.isLoading) return <SkeletonTable rows={10} columns={6} />;

  if (state.hasError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {state.isRateLimit ? 'Rate limit reached' : 'Failed to load data'}
        </p>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {state.isRateLimit
            ? 'CoinGecko API rate limit exceeded. Please wait a moment before retrying.'
            : 'An error occurred while fetching market data. Please try again.'}
        </p>
        <Button onClick={() => state.refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          value={table.filtering.query}
          onChange={table.filtering.onChange}
          placeholder="Search by name or symbol..."
        />
        {state.isFetching && !state.isLoading && (
          <span className="text-xs text-gray-400 dark:text-gray-500" aria-live="polite">
            Refreshing...
          </span>
        )}
      </div>

      <Table<ICoin>
        data={table.data}
        columns={COIN_COLUMNS}
        rowKey={(row) => row.id}
        sortState={table.sorting.state}
        onSort={table.sorting.onSort}
        onRowClick={table.onRowClick}
        onRowHover={table.onRowHover}
        ariaRowLabel={(row) => `View details for ${row.name}`}
        emptyState={
          <EmptyState
            onResetFilter={table.filtering.query ? () => table.filtering.onChange('') : undefined}
          />
        }
      />
    </div>
  );
}
